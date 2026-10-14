import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import * as packageExports from '@atendesign/javascript-components';

const menuSource = await readFile(new URL('../src/components/Menu.js', import.meta.url), 'utf8');
const artifacts = [
  'javascript-components.esm.js',
  'javascript-components.umd.js',
  'javascript-components.umd.min.js',
];

for (const artifact of artifacts) {
  test(`package export and ${artifact} preserve Menu and provide responsive TabContent`, async ({ page }) => {
    expect(Object.keys(packageExports).sort()).toEqual(['Accordion', 'Menu', 'Modal', 'Sticky', 'TabContent']);
    const code = await readFile(new URL(`../dist/${artifact}`, import.meta.url), 'utf8');
    await page.setViewportSize({ width: 768, height: 600 });
    await page.setContent(`
      <div class="tab-content">
        <div class="tab-content__navigation"></div>
        <div class="tab-content__group is-expanded" id="one">
          <button class="tab-content__trigger" id="tab-one" aria-controls="one">One</button>
          <div class="tab-content__content">Content</div>
        </div>
      </div>`);
    if (artifact.includes('.esm.')) {
      await page.evaluate(async (code) => {
        const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
        window.JavaScriptComponents = await import(url);
        URL.revokeObjectURL(url);
      }, code);
    } else {
      await page.addScriptTag({ content: code });
    }
    expect(await page.evaluate(() => {
      const { TabContent, Menu } = window.JavaScriptComponents;
      const component = new TabContent(document.querySelector('.tab-content'), {
        breakpoint: 768.0001, orientation: 'vertical', accordion: { singleOpen: true },
      });
      component.init();
      const mode = component.getState().mode;
      component.destroy();
      return { mode, menu: typeof Menu.prototype.mount, clean: !document.querySelector('[role="region"]') };
    })).toEqual({ mode: 'accordion', menu: 'function', clean: true });
  });
}

test('SurfMenu-style subclass overrides and inherited custom selectors remain compatible', async ({ page }) => {
  await page.setContent(`
    <nav class="m-menu"><ul class="m-menu__list">
      ${[0, 1].map((index) => `<li class="m-menu__item">
        <button class="m-menu__dropdown-trigger" id="menu-${index}" aria-expanded="false">Menu ${index}</button>
        <div class="m-menu__dropdown"><ul class="m-menu__list"><li class="m-menu__item"><a class="m-menu__link" id="link-${index}" href="#">Link</a></li></ul></div>
      </li>`).join('')}
    </ul></nav>`);
  await page.evaluate(async (source) => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const { Menu } = await import(url);
    URL.revokeObjectURL(url);
    class SurfMenu extends Menu {
      onItemKeydown(event) {
        const current = event.target;
        if (['ArrowLeft', 'ArrowRight'].includes(event.key) && this.getParentMenuItems(current).length > 0) {
          event.stopPropagation();
          event.preventDefault();
          const parent = this.getSubMenuTrigger(current);
          const siblings = Array.from(this.getSiblings(parent));
          const index = siblings.indexOf(parent);
          const offset = event.key === 'ArrowLeft' ? -1 : 1;
          (siblings[index + offset] ?? parent).focus();
          this.collapseSubMenu(parent);
          return;
        }
        super.onItemKeydown(event);
      }
    }
    window.menu = new SurfMenu(document.querySelector('.m-menu'), {
      selectors: {
        trigger: '.m-menu__dropdown-trigger',
        items: '.m-menu__list',
        item: '.m-menu__item',
        link: '.m-menu__link',
        dropdown: '.m-menu__dropdown',
      },
      classes: { expanded: 'is-open' },
      breakpoint: 1400,
    });
    window.menu.mount();
  }, menuSource);
  for (const [index, key] of [[0, 'ArrowLeft'], [1, 'ArrowRight']]) {
    await page.locator(`#menu-${index}`).click();
    await page.locator(`#link-${index}`).focus();
    await page.keyboard.press(key);
    await expect(page.locator(`#menu-${index}`)).toBeFocused();
    await expect(page.locator(`#menu-${index}`)).toHaveAttribute('aria-expanded', 'false');
  }
  await page.locator('#menu-0').click();
  await expect(page.locator('#menu-0')).toHaveClass('m-menu__dropdown-trigger is-open');
  await page.locator('#link-0').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-0')).toBeFocused();
  await page.evaluate(() => window.menu.destroy());
  await page.locator('#menu-0').click();
  await expect(page.locator('#menu-0')).toHaveAttribute('aria-expanded', 'false');
});
