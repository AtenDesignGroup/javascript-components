import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/TabContent.js', import.meta.url), 'utf8');

async function mount(page, options = {}, { width = 1024, orientation = '', content = true } = {}) {
  await page.setViewportSize({ width, height: 800 });
  await page.setContent(`
    <button id="outside">Outside</button>
    <div class="tab-content">
      <div class="tab-content__navigation" role="tablist" ${orientation ? `aria-orientation="${orientation}"` : ''}></div>
      ${[0, 1, 2].map((index) => `
        <section id="group-${index}" class="tab-content__group${index === 0 ? ' is-expanded' : ''}" role="tabpanel" aria-labelledby="trigger-${index}">
          <button id="trigger-${index}" type="button" class="tab-content__trigger${index === 0 ? ' is-expanded' : ''}" role="tab"
            aria-selected="${index === 0}" aria-expanded="${index === 0}" aria-haspopup="true" aria-controls="group-${index}">
            <span>Item ${index}</span>
          </button>
          <div ${content ? 'class="tab-content__content"' : 'data-custom-panel'}><a href="#video-${index}">Video ${index}</a><div data-player></div><template><iframe title="Video ${index}" src="about:blank"></iframe></template></div>
        </section>`).join('')}
    </div>`);
  await page.evaluate(async ({ source, options }) => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const { TabContent } = await import(url);
    URL.revokeObjectURL(url);
    window.TabContent = TabContent;
    window.changes = [];
    window.originalNode = document.querySelector('.tab-content').cloneNode(true);
    window.component = new TabContent(document.querySelector('.tab-content'), {
      ...options,
      onChange(change) {
        window.changes.push({
          ...change,
          items: change.items.map(({ index, id, open, trigger, panel }) => ({
            index, id, open, trigger: trigger.id, panel: panel.id,
          })),
        });
      },
    });
    window.component.init();
  }, { source, options });
}

async function resize(page, width, mode) {
  await page.setViewportSize({ width, height: 800 });
  await expect.poll(() => page.evaluate(() => window.component.getState().mode)).toBe(mode);
}

test('default horizontal manual activation, wrap, Home/End, and roving focus', async ({ page }) => {
  await mount(page);
  const first = page.locator('#trigger-0');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await first.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#trigger-2')).toBeFocused();
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  await page.keyboard.press('ArrowRight');
  await expect(first).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.press('Space');
  await expect(page.locator('#trigger-2')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#group-0')).toBeHidden();
  await page.keyboard.press('Home');
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
});

for (const orientation of ['horizontal', 'vertical']) {
  test(`${orientation} handles only its own arrows and prevents scrolling`, async ({ page }) => {
    await mount(page, { orientation });
    const keys = orientation === 'vertical'
      ? ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ']
      : ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '];
    const ignored = orientation === 'vertical' ? 'ArrowLeft' : 'ArrowDown';
    const result = await page.evaluate(({ keys, ignored }) => {
      const trigger = document.querySelector('#trigger-0');
      return [...keys, ignored].map((key) => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        trigger.dispatchEvent(event);
        return event.defaultPrevented;
      });
    }, { keys, ignored });
    expect(result).toEqual([...keys.map(() => true), false]);
    await expect(page.locator('[role="tablist"]')).toHaveAttribute('aria-orientation', orientation);
  });
}

test('vertical orientation can be declared in markup and explicitly overridden', async ({ page }) => {
  await mount(page, {}, { orientation: 'vertical' });
  await page.locator('#trigger-0').focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#trigger-2')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#trigger-0')).toBeFocused();
  await mount(page, { orientation: 'horizontal' }, { orientation: 'vertical' });
  await expect(page.locator('[role="tablist"]')).toHaveAttribute('aria-orientation', 'horizontal');
});

test('roles, controls, visibility and selection stay coherent in both directions', async ({ page }) => {
  await mount(page, { breakpoint: 768.0001 });
  await page.locator('#trigger-1').click();
  await page.locator('#trigger-1').focus();
  await resize(page, 768, 'accordion');
  await expect(page.locator('[role="tab"], [role="tablist"], [role="tabpanel"]')).toHaveCount(0);
  await expect(page.locator('#trigger-1')).toBeFocused();
  await expect(page.locator('#trigger-1')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#trigger-1')).not.toHaveAttribute('aria-selected');
  await expect(page.locator('#trigger-1')).not.toHaveAttribute('aria-haspopup');
  await expect(page.locator('#trigger-0')).toBeVisible();
  await expect(page.locator('#group-0 .tab-content__content')).toBeHidden();
  expect(await page.evaluate(() => [...document.querySelectorAll('.tab-content__trigger')].every((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    return panel.getAttribute('role') === 'region' && panel.getAttribute('aria-labelledby') === trigger.id;
  }))).toBe(true);
  await resize(page, 769, 'tabs');
  await expect(page.locator('#trigger-1')).toBeFocused();
  await expect(page.locator('#trigger-1')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tablist"] > [role="tab"]')).toHaveCount(3);
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(3);
  await expect(page.locator('#group-0')).toBeHidden();
  await expect(page.locator('#group-1')).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].every((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    return panel.getAttribute('role') === 'tabpanel' && panel.getAttribute('aria-labelledby') === trigger.id;
  }))).toBe(true);
});

test('fractional boundary is exact, including 768.0001, without resetting selection', async ({ page }) => {
  await mount(page, { breakpoint: 768.0001 }, { width: 768 });
  expect(await page.evaluate(() => window.component.getState().mode)).toBe('accordion');
  await page.locator('#trigger-1').click();
  await page.evaluate(() => {
    window.widthDescriptor = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  });
  for (const [width, mode] of [[768.00005, 'accordion'], [768.0001, 'tabs'], [768.5, 'tabs'], [768, 'accordion']]) {
    await page.evaluate((width) => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
      window.dispatchEvent(new Event('resize'));
    }, width);
    expect(await page.evaluate(() => window.component.getState().mode)).toBe(mode);
    expect(await page.evaluate(() => window.component.getState().activeIndex)).toBe(1);
  }
  await page.evaluate(() => Object.defineProperty(window, 'innerWidth', window.widthDescriptor));
  await resize(page, 769, 'tabs');
  await resize(page, 768, 'accordion');
  await resize(page, 767, 'accordion');
});

test('integer default retains tabs at 768px and accordion below', async ({ page }) => {
  await mount(page, {}, { width: 768 });
  expect(await page.evaluate(() => window.component.getState().mode)).toBe('tabs');
  await resize(page, 767, 'accordion');
  await resize(page, 768, 'tabs');
});

test('default accordion allows multiple open and all closed', async ({ page }) => {
  await mount(page, {}, { width: 500 });
  await page.locator('#trigger-1').click();
  expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([0, 1]);
  await page.locator('#trigger-0').click();
  await page.locator('#trigger-1').click();
  expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([]);
  expect(await page.evaluate(() => window.component.getState().activeIndex)).toBeNull();
  await resize(page, 1024, 'tabs');
  await expect(page.locator('#trigger-1')).toHaveAttribute('aria-selected', 'true');
});

for (const collapsible of [true, false]) {
  test(`single-open accordion with collapsible=${collapsible}`, async ({ page }) => {
    await mount(page, { accordion: { singleOpen: true, collapsible } }, { width: 500 });
    await page.locator('#trigger-1').click();
    await page.locator('#trigger-1').focus();
    expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([1]);
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual(collapsible ? [] : [1]);
    if (!collapsible) {
      await expect(page.locator('#trigger-1')).toHaveAttribute('aria-disabled', 'true');
    }
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([1]);
    await resize(page, 1024, 'tabs');
    await resize(page, 500, 'accordion');
    expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([1]);
  });
}

test('non-collapsible multi-open mode protects only the last open panel', async ({ page }) => {
  await mount(page, { accordion: { collapsible: false } }, { width: 500 });
  await page.locator('#trigger-1').click();
  await expect(page.locator('#trigger-0')).not.toHaveAttribute('aria-disabled');
  await page.locator('#trigger-0').click();
  await page.locator('#trigger-1').dispatchEvent('click');
  expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([1]);
});

test('focus in a panel survives resize and focus from a closing panel moves to its tab', async ({ page }) => {
  await mount(page);
  await page.locator('#group-0 a').focus();
  await resize(page, 500, 'accordion');
  await expect(page.locator('#group-0 a')).toBeFocused();
  await page.locator('#trigger-1').click();
  await page.locator('#group-0 a').focus();
  await resize(page, 1024, 'tabs');
  await expect(page.locator('#trigger-0')).toBeFocused();
  await expect(page.locator('#trigger-1')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#trigger-0')).toHaveAttribute('tabindex', '0');
  await page.locator('#outside').focus();
  await resize(page, 500, 'accordion');
  await expect(page.locator('#outside')).toBeFocused();
});

test('callback observes committed state and manages video content without DOM inference', async ({ page }) => {
  await mount(page, { accordion: { singleOpen: true } });
  await page.evaluate(() => {
    const component = window.component;
    component.options.onChange = (change) => {
      window.changes.push({ reason: change.reason, openIndices: change.openIndices });
      change.items.forEach(({ open, panel }) => {
        const player = panel.querySelector('[data-player]');
        if (!open) player.replaceChildren();
        else if (!player.hasChildNodes()) player.append(panel.querySelector('template').content.cloneNode(true));
        if (open && panel.hidden) throw new Error('Callback fired before rendering');
      });
    };
    component.options.onChange(component.getState());
  });
  await expect(page.locator('iframe')).toHaveCount(1);
  await page.locator('#trigger-2').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#group-2 iframe')).toHaveCount(1);
  await expect(page.locator('#group-0 iframe')).toHaveCount(0);
  await resize(page, 500, 'accordion');
  await page.keyboard.press('Space');
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(await page.evaluate(() => window.changes.map(({ reason }) => reason))).toEqual([
    'init', undefined, 'interaction', 'breakpoint', 'interaction',
  ]);
  await page.evaluate(() => {
    const snapshot = window.component.getState();
    snapshot.openIndices.push(99);
    snapshot.items[0].open = true;
  });
  expect(await page.evaluate(() => window.component.getState().openIndices)).toEqual([]);
});

test('generated content supports video cleanup on destroy, including a throwing callback', async ({ page }) => {
  await mount(page, { breakpoint: 768.0001 }, { content: false });
  expect(await page.evaluate(() => {
    const component = window.component;
    component.options.onChange = ({ reason, items }) => {
      items.forEach(({ panel }) => panel.querySelector('[data-player]').replaceChildren());
      if (reason === 'destroy') throw new Error('Consumer cleanup error');
    };
    let error;
    try { component.destroy(); } catch (caught) { error = caught.message; }
    component.options.onChange = null;
    component.init();
    component.destroy();
    return {
      error,
      restored: document.querySelector('.tab-content').isEqualNode(window.originalNode),
      mode: component.getState().mode,
    };
  })).toEqual({ error: 'Consumer cleanup error', restored: true, mode: null });
});

test('initial accordion constraints normalize authored state and initialization only notifies once', async ({ page }) => {
  await mount(page, { accordion: { singleOpen: true, collapsible: false } }, { width: 500 });
  expect(await page.evaluate(() => {
    const component = window.component;
    component.destroy();
    document.querySelectorAll('.is-expanded').forEach((element) => element.classList.remove('is-expanded'));
    component.init();
    component.init();
    const empty = component.getState().openIndices;
    const initCount = window.changes.filter(({ reason }) => reason === 'init').length;
    component.destroy();
    document.querySelector('#group-1').classList.add('is-expanded');
    document.querySelector('#group-2').classList.add('is-expanded');
    component.init();
    return { empty, multiple: component.getState().openIndices, initCount };
  })).toEqual({ empty: [0], multiple: [1], initCount: 2 });
});

test('notifications omit no-ops and report state/layout changes and destroy exactly once', async ({ page }) => {
  await mount(page, { accordion: { singleOpen: true, collapsible: false } });
  await page.locator('#trigger-0').click();
  await page.locator('#trigger-0').press('ArrowRight');
  expect(await page.evaluate(() => window.changes.length)).toBe(1);
  await page.locator('#trigger-1').press('Enter');
  await resize(page, 500, 'accordion');
  await page.locator('#trigger-1').press('Enter');
  await page.evaluate(() => window.component.onMediaQueryChange());
  expect(await page.evaluate(() => window.changes.map(({ reason }) => reason))).toEqual(['init', 'interaction', 'breakpoint']);
  await page.evaluate(() => { window.component.destroy(); window.component.destroy(); });
  expect(await page.evaluate(() => window.changes.at(-1))).toMatchObject({
    reason: 'destroy', mode: null, activeIndex: null, openIndices: [],
  });
  expect(await page.evaluate(() => window.component.getState().items)).toEqual([]);
});

for (const content of [true, false]) {
  test(`repeated init/destroy restores authored DOM and removes listeners (existing content=${content})`, async ({ page }) => {
    await mount(page, { breakpoint: 768.0001 }, { content });
    for (let cycle = 0; cycle < 3; cycle++) {
      await page.evaluate(() => {
        window.component.init();
        window.component.init();
      });
      await page.locator('#trigger-1').click();
      await resize(page, 500, 'accordion');
      await page.locator('#trigger-1').focus();
      await page.evaluate(() => {
        window.component.destroy();
        window.component.destroy();
      });
      await expect(page.locator('#trigger-1')).toBeFocused();
      expect(await page.evaluate(() => document.querySelector('.tab-content').isEqualNode(window.originalNode))).toBe(true);
      const count = await page.evaluate(() => window.changes.length);
      await page.locator('#trigger-1').click();
      await page.locator('#trigger-1').press('Enter');
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.waitForTimeout(50);
      expect(await page.evaluate(() => window.changes.length)).toBe(count);
      expect(await page.evaluate(() => window.component.getState().mode)).toBeNull();
    }
  });
}

test('invalid options/markup fail before changing the DOM; empty components are safe', async ({ page }) => {
  await mount(page);
  expect(await page.evaluate(() => {
    window.component.destroy();
    const root = document.querySelector('.tab-content');
    const original = root.innerHTML;
    const errors = [{ breakpoint: NaN }, { orientation: 'diagonal' }, { onChange: true }, { accordion: { singleOpen: 1 } }]
      .map((options) => {
        try { new window.TabContent(root, options).init(); return false; }
        catch (error) { return error instanceof TypeError && root.innerHTML === original; }
      });
    root.querySelector('button').setAttribute('aria-controls', 'missing');
    try { new window.TabContent(root).init(); errors.push(false); }
    catch (error) { errors.push(error.message.startsWith('TabContent:')); }
    const empty = new window.TabContent(document.createElement('div'));
    empty.init();
    empty.destroy();
    return errors;
  })).toEqual([true, true, true, true, true]);
});
