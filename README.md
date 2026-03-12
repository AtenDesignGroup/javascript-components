# Aten Design Group -- JavaScript Components

[![npm version](https://badge.fury.io/js/%40atendesign%2Fjavascript-components.svg)](https://badge.fury.io/js/%40atendesign%2Fjavascript-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of JavaScript libraries that adhere ceremoniously with WCAG guidelines. This package provides accessible, keyboard-navigable UI components with full ARIA support and responsive design capabilities.

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/AtenDesignGroup/javascript-components/issues) on GitHub.

## 👤 Author

**Philip Stier - Tech Lead, Senior Developer**

---
01. [Installation](#installation)
02. [Accordion](#accordion)
03. [Tab Content](#tab-content)
04. [Menu](#menu)
05. [Sticky](#sticky)
06. [Modal](#modal)
---

## Installation

`npm install @atendesign/javascript-components`

## Accordion

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design
- 🎨 Customizable styling
- 🔄 Toggle state management

### Basic Usage

**HTML**

```
<div class="accordion">
    <h3 class="accordion__heading">
        <button id="accordion-trigger-01" class="accordion__trigger" aria-expanded="false" aria-controls="accordion-section-01>
            Accordion Section
        </button>
    </h3>

    <div id="accordion-section-01" class="accordion__content" role="region" aria-labelledby="accordion-trigger-01">
        <p>This is the accordion content.</p>
    </div>
</div>
```

**JavaScript**

```
import { Accordion } from '@atendesign/javascript-components';

document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.accordion').forEach(accordion => {
        const accordionComponent = new Accordion(accordion, {options});
        accordionComponent.init();
    });
});

```

### Options

| Option | Type | Default                                | Description |
|--------|------|----------------------------------------|-------------|
| `selectors.trigger` | string | `'.accordion__trigger[aria-controls]'` | CSS selector for accordion trigger buttons |
| `classes.expanded` | string | `'is-expanded'`                        | CSS class applied to expanded accordion state |

### Custom Options Example

```javascript
const accordionComponent = new Accordion(accordionElement, {
    selectors: {
        trigger: '.my-accordion__trigger[aria-controls]',
    },
    classes: {
        expanded: 'is-open',
    },
});

accordionComponent.init();
```

### Required HTML Attributes

- `aria-expanded` on trigger button (automatically managed by the component)
- `aria-controls` on trigger button (must match content panel's ID)
- `id` on content panel (must match trigger's aria-controls value)
- `aria-labelledby` on content panel (must match trigger button's ID)
- `role="region"` on content panel

### Keyboard Support

- `Enter` or `Space`: Toggle accordion section
- Mouse click: Toggle accordion section

## Tab Content

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design
- 🎨 Customizable styling
- 🔄 Tab state management

### Basic Usage

**HTML**

```
<div class="tab-content">
  <div role="tablist" class="tab-content__navigation"></div>

  <div id="tab-content-01"
       class="tab-content__group is-expanded"
       role="tabpanel"
       aria-labelledby="tab-tab-content-01">
    <button type="button"
            id="tab-tab-content-01"
            class="tab-content__trigger is-expanded"
            role="tab"
            aria-haspopup="true"
            aria-selected="true"
            aria-expanded="true"
            aria-controls="tab-content-01">
      Tab 01
    </button>

    <div class="tab-content__content">
      <p>Text content goes here - Tab 01</p>
    </div>
  </div>
</div>
```

**JavaScript**

```
import { TabContent } from '@atendesign/javascript-components';

document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        const tabContentComponent = new TabContent(tabContent);
        tabContentComponent.init();
    });
});
```

### Options

| Option               | Type    | Default                      | Description                                         |
|----------------------|---------|------------------------------|-----------------------------------------------------|
| `selectors.navigation` | string  | `'.tab-content__navigation'` | CSS selector for desktop tab navigation container   |
| `selectors.group`      | string  | `'.tab-content__group'`      | CSS selector for tab groups                         |
| `selectors.trigger`    | string  | `'.tab-content__trigger'`    | CSS selector for tab trigger buttons                |
| `classes.expanded`     | string  | `'is-expanded'`              | CSS class applied to expanded tabs/groups           |
| `breakpoint`           | number  | `768`                        | Media breakpoint where tabs switch to accordions    |

### Custom Options Example

```javascript
const tabContentComponent = new TabContent(tabContentElement, {
    selectors: {
        navigation: '.my-tabs__navigation',
        group: '.my-tabs__group',
        trigger: '.my-tabs__trigger',
    },
    classes: {
        expanded: 'is-open',
    },
    breakpoint: 1024,
});

tabContentComponent.init();
```

### Required HTML Attributes

- `role="tablist"` on tab container
- `role="tab"` on each tab button
- `role="tabpanel"` on each content panel
- `aria-selected` on tab buttons (automatically managed by the component)
- `aria-controls` on tab buttons (must match panel's ID)
- `id` on content panels (must match tab's aria-controls value)
- `aria-labelledby` on content panels (must match tab button's ID)
- `tabindex` on tab buttons (automatically managed by the component)

### Keyboard Support

- `Arrow Left/Right`: Navigate between tabs
- `Home`: Move to first tab
- `End`: Move to last tab
- `Enter` or `Space`: Activate focused tab
- Mouse click: Activate tab

## Menu

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design (desktop/mobile state)
- 🎨 Customizable styling
- 🔄 Submenu expand/collapse management
- 🖱️ Click-outside to close

### Basic Usage

**HTML**

```html
<nav class="menu">
  <ul class="menu__items">
    <li class="menu__item">
      <a class="menu__link" href="#">Home</a>
    </li>
    <li class="menu__item">
      <button class="menu__dropdown-trigger" aria-expanded="false">About</button>
      <div class="menu__dropdown">
        <ul class="menu__items">
          <li class="menu__item">
            <a class="menu__link" href="#">Our Team</a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">Our Story</a>
          </li>
        </ul>
      </div>
    </li>
    <li class="menu__item">
      <a class="menu__link" href="#">Services</a>
    </li>
  </ul>
</nav>
```

**JavaScript**

```javascript
import { Menu } from '@atendesign/javascript-components';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.menu').forEach(menu => {
        const menuComponent = new Menu(menu);
        menuComponent.mount();
    });
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectors.trigger` | string | `'.menu__dropdown-trigger'` | CSS selector for dropdown trigger buttons |
| `selectors.items` | string | `'.menu__items'` | CSS selector for the menu items container |
| `selectors.item` | string | `'.menu__item'` | CSS selector for individual menu items |
| `selectors.link` | string | `'.menu__link'` | CSS selector for menu item links |
| `selectors.dropdown` | string | `'.menu__dropdown'` | CSS selector for dropdown containers |
| `classes.expanded` | string | `'is-expanded'` | CSS class applied to expanded dropdown state |
| `breakpoint` | number | `768` | Viewport width (px) at which the menu switches between mobile and desktop behaviour |

### Custom Options Example

```javascript
const menuComponent = new Menu(menuElement, {
    selectors: {
        trigger: '.my-menu__dropdown-trigger',
        items: '.my-menu__items',
        item: '.my-menu__item',
        link: '.my-menu__link',
        dropdown: '.my-menu__dropdown',
    },
    classes: {
        expanded: 'is-open',
    },
    breakpoint: 1024,
});

menuComponent.mount();
```

### Required HTML Attributes

- `aria-expanded` on dropdown trigger buttons (automatically managed by the component)

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` or `Space` | Expand focused submenu and move focus to its first item |
| `Arrow Down` | Expand submenu (focus first item) or move to the next sibling item |
| `Arrow Up` | Expand submenu (focus last item) or move to the previous sibling item |
| `Arrow Right` | When inside a submenu, collapse it and move focus to the next top-level item |
| `Arrow Left` | When inside a submenu, collapse it and move focus to the previous top-level item |
| `Escape` | Collapse the open submenu and return focus to its trigger |
| `Home` | Close all submenus and focus the first top-level menu item |
| `End` | Close all submenus and focus the last top-level menu item |
| Mouse click | Toggle submenu / close all when clicking outside the menu |

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `mount()` | Attaches all event listeners and initialises the responsive media query |
| `destroy()` | Removes all event listeners and cleans up the component |

## Sticky

### Features

- 🌟 Scroll-aware positioning bounded within a parent container
- ⚡ Optimised with `requestAnimationFrame` throttling — one update per frame
- 📐 `ResizeObserver` keeps layout measurements accurate after DOM reflow
- 🎨 Customizable class names and top-spacing
- 🔄 Three-state lifecycle: `default` → `stuck` → `bottom`

### Basic Usage

**HTML**

```html
<div class="sticky-parent">
  <aside class="sticky-element">
    I stick within my parent!
  </aside>
  <div class="sticky-content">
    <!-- tall content -->
  </div>
</div>
```

**CSS**

```css
/* The parent receives position: relative automatically if not already set. */
.sticky-element.is-stuck {
  position: absolute;
}

.sticky-element.is-bottom {
  position: absolute;
  bottom: 0;
}
```

**JavaScript**

```javascript
import { Sticky } from '@atendesign/javascript-components';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.is-sticky').forEach(el => {
        const stickyComponent = new Sticky(el);
        stickyComponent.mount();
    });
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `topSpacing` | number | `40` | Gap in pixels between the viewport top and the stuck element |
| `classes.stuck` | string | `'is-stuck'` | CSS class applied when the element is in the sticky (viewport-tracking) state |
| `classes.bottom` | string | `'is-bottom'` | CSS class applied when the element has reached the bottom boundary of its parent |

### Custom Options Example

```javascript
const stickyComponent = new Sticky(el, {
    topSpacing: 80,
    classes: {
        stuck: 'is-pinned',
        bottom: 'is-anchored',
    },
});

stickyComponent.mount();
```

### How It Works

The element transitions between three states as the page scrolls:

| State | Condition | Description |
|-------|-----------|-------------|
| `default` | Before the sticky zone | Element stays in its natural document position |
| `stuck` | Inside the sticky zone | Tracks the viewport via `position: absolute` + an inline `top` offset |
| `bottom` | Past the parent's boundary | Anchored to the parent's bottom edge |

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `mount()` | Caches layout values, attaches scroll and resize listeners, and applies the initial state |
| `destroy()` | Removes the scroll listener and disconnects the `ResizeObserver` |

## Modal

### Features

- 🌟 Fully accessible implementation
- ⌨️ Full keyboard support with focus trapping
- 🔒 Body scroll locked while open
- 🖱️ Overlay click to close
- 🔄 Focus restored to the triggering element on close
- 📌 Modal relocated to `<body>` on mount for reliable fixed positioning

### Basic Usage

**HTML**

```html
<button type="button" aria-controls="my-modal" aria-expanded="false">
  Open Modal
</button>

<div id="my-modal"
     class="modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="my-modal-title"
     aria-hidden="true">
  <div class="modal__overlay">
    <div class="modal__dialog">
      <button type="button" class="modal__close" aria-label="Close modal">Close</button>
      <h2 id="my-modal-title">Modal Title</h2>
      <p>Modal content goes here.</p>
    </div>
  </div>
</div>
```

**JavaScript**

```javascript
import { Modal } from '@atendesign/javascript-components';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(modal => {
        const modalComponent = new Modal(modal);
        modalComponent.mount();
    });
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectors.trigger` | string | `'[aria-controls="{id}"]'` | CSS selector for trigger buttons (scoped to the whole document) |
| `selectors.closeButton` | string | `'.modal__close'` | CSS selector for close buttons inside the modal |
| `selectors.overlay` | string | `'.modal__overlay'` | CSS selector for the overlay element; clicking it closes the modal |
| `classes.expanded` | string | `'is-expanded'` | CSS class applied to the modal element when it is open |

### Custom Options Example

```javascript
const modalComponent = new Modal(modalElement, {
    selectors: {
        trigger: '.my-open-button',
        closeButton: '.my-modal__close',
        overlay: '.my-modal__overlay',
    },
    classes: {
        expanded: 'is-open',
    },
});

modalComponent.mount();
```

### Required HTML Attributes

- `id` on the modal element (must match each trigger's `aria-controls` value)
- `role="dialog"` on the modal element
- `aria-modal="true"` on the modal element
- `aria-labelledby` on the modal element (should reference the dialog heading's ID)
- `aria-hidden="true"` on the modal element (automatically managed by the component)
- `aria-controls` on trigger buttons (must match the modal element's ID)
- `aria-expanded` on trigger buttons (automatically managed by the component)
- `aria-label` or visible label on each close button

### Keyboard Support

| Key | Action |
|-----|--------|
| `Escape` | Close the modal and return focus to the triggering element |
| `Tab` | Move focus to the next focusable element; wraps from last to first |
| `Shift+Tab` | Move focus to the previous focusable element; wraps from first to last |

### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `mount()` | Relocates the modal to `<body>`, caches internal elements, and attaches all event listeners |
| `destroy()` | Removes all event listeners attached by `mount()` |
