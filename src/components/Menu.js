/**
 * @file
 * Components - Menu
 */

/**
 * Represents a Menu component with event handling and state management
 * for navigation within the menu. This class is responsible for managing
 * interactions with menu buttons and items, including expanding, collapsing,
 * and navigating through menu elements based on user input such as clicks
 * and keyboard events.
 */
export class Menu {
  constructor(element, options = {}) {
    // Default options
    const defaultOptions = {
      selectors: {
        trigger:  '.menu__dropdown-trigger',
        items:    '.menu__items',
        item:     '.menu__item',
        link:     '.menu__link',
        dropdown: '.menu__dropdown',
      },
      classes: {
        expanded: 'is-expanded',
      },
      breakpoint: 768,
    };

    this.options = {
      ...defaultOptions,
      ...options,
      selectors: { ...defaultOptions.selectors, ...(options.selectors ?? {}) },
      classes:   { ...defaultOptions.classes,   ...(options.classes   ?? {}) },
    };
    this.element = element;
    this.triggers = this.element.querySelectorAll(this.options.selectors.trigger);
    this.items = this.element.querySelectorAll(this.options.selectors.item);
    this.dropdowns = this.element.querySelectorAll(this.options.selectors.dropdown);
    this.expandedClass = this.options.classes.expanded;
    this.triggerSelector = this.options.selectors.trigger;
    this.itemsSelector = this.options.selectors.items;
    this.itemSelector = this.options.selectors.item;
    this.linkSelector = this.options.selectors.link;
    this.dropdownSelector = this.options.selectors.dropdown;
    this.window = window;
    this.mediaQuery = null;
    this.state = null;

    // Store bound handler references so mount() and destroy() use the same function identity.
    this._onButtonClick      = this.onButtonClick.bind(this);
    this._onItemKeydown      = this.onItemKeydown.bind(this);
    this._onClickWindow      = this.onClickWindow.bind(this);
    this._onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  /**
   * Attaches event listeners to specific elements for handling user interactions
   * and initializes a ResizeObserver to monitor changes in document size.
   *
   * @return {void} This method does not return any value.
   */
  mount() {
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this._onButtonClick));
    this.items.forEach((item) => item.addEventListener('keydown', this._onItemKeydown));
    this.window.addEventListener('click', this._onClickWindow);
    this.mediaQuery = window.matchMedia(`(min-width: ${this.options.breakpoint}px)`);
    this.mediaQuery.addEventListener('change', this._onMediaQueryChange);
    this.onMediaQueryChange();
  }

  /**
   * Cleans up event listeners and disconnects any observers associated with the instance.
   *
   * Removes the 'click' event listener from all buttons and the 'keydown' event listener from all
   * items. If there is an observer, it disconnects it to stop observing changes.
   *
   * @return {void} Does not return a value.
   */
  destroy() {
    this.triggers.forEach((trigger) => trigger.removeEventListener('click', this._onButtonClick));
    this.items.forEach((item) => item.removeEventListener('keydown', this._onItemKeydown));
    this.window.removeEventListener('click', this._onClickWindow);
    this.mediaQuery.removeEventListener('change', this._onMediaQueryChange);
  }

  /**
   * Handles changes in media query state and updates the application state
   * accordingly. This method checks if the media query condition is met and
   * adjusts the `state` property to either 'desktop' or 'mobile'.
   *
   * @return {void} This method does not return any value.
   */
  onMediaQueryChange() {
    this.state = this.mediaQuery.matches ? 'desktop' : 'mobile';
  }

  /**
   * Handles the click event for a button, expanding or collapsing a submenu based on its
   * current state.
   *
   * @param {Event} event - The event object associated with the button click.
   * @return {void} Does not return a value.
   */
  onButtonClick(event) {
    if (Menu.isExpanded(event.currentTarget)) {
      this.collapseSubMenu(event.currentTarget);
    } else {
      if (this.state === 'desktop') this.closeAll();
      this.expandSubMenu(event.currentTarget);
    }
  }

  /**
   * Handles the click event on the window and determines if the click occurred outside a
   * specific element. If the click is outside the specified element, it invokes the
   * `closeAll` method.
   *
   * @param {Event} event The click event object containing details about the event and its target.
   * @return {void} This method does not return a value.
   */
  onClickWindow(event) {
    if (!this.element.contains(event.target)) {
      this.closeAll();
    }
  }

  /**
   * Closes all expandable items by setting their 'aria-expanded' attribute to 'false'.
   *
   * @return {void} Does not return a value.
   */
  closeAll() {
    this.triggers.forEach((trigger) => {
      if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
      if (trigger.classList.contains(this.expandedClass)) trigger.classList.remove(this.expandedClass);
    });
  }

  /**
   * Handles the `keydown` event for a menu item and determines the appropriate
   * action based on the pressed key. This includes expanding or collapsing submenus,
   * navigating between menu items, and closing menus.
   *
   * @param {KeyboardEvent} event The keyboard event triggered when a key is pressed.
   * @return {void} Does not return a value. The method modifies focus and DOM states directly.
   */
  onItemKeydown(event) {
    let preventDefault = false;
    const current = event.target;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
          preventDefault = true;
          this.expandSubMenu(current);

          setTimeout(() => {
            this.getSubMenuLinks(current)[0].focus();
          }, 100);
        }

        break;

      case 'Up':
      case 'ArrowUp':
        preventDefault = true;

        if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
          const subMenuLinks = this.getSubMenuLinks(current);
          this.expandSubMenu(current);

          setTimeout(() => {
            subMenuLinks[subMenuLinks.length - 1].focus();
          }, 100);
        } else {
          const previousSibling = this.getPreviousSibling(current);
          previousSibling.focus();
        }

        break;

      case 'Down':
      case 'ArrowDown':
        preventDefault = true;

        if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
          const subMenuLinks = this.getSubMenuLinks(current);
          this.expandSubMenu(current);

          setTimeout(() => {
            subMenuLinks[0].focus();
          }, 100);
        } else {
          const nextSibling = this.getNextSibling(current);
          nextSibling.focus();
        }

        break;

      case 'ArrowRight':
        preventDefault = true;

        if (this.getParentMenuItems(current).length > 0) {
          const parentItem = this.getSubMenuTrigger(current);
          const parentSiblings = this.getSiblings(parentItem);
          const currentIndex = Array.from(parentSiblings).indexOf(parentItem);
          parentSiblings[currentIndex + 1]?.focus();
          this.collapseSubMenu(parentItem);
        } else {
          this.getNextSibling(current)?.focus();
        }

        break;

      case 'ArrowLeft':
        preventDefault = true;

        if (this.getParentMenuItems(current).length > 0) {
          const parentItem = this.getSubMenuTrigger(current);
          const parentSiblings = this.getSiblings(parentItem);
          const currentIndex = Array.from(parentSiblings).indexOf(parentItem);
          parentSiblings[currentIndex - 1]?.focus();
          this.collapseSubMenu(parentItem);
        } else {
          this.getPreviousSibling(current)?.focus();
        }

        break;

      case 'Escape':
      case 'Esc':
        if (this.getSubMenuTrigger(current)) {
          preventDefault = true;
          this.collapseSubMenu(this.getSubMenuTrigger(current));
          this.getSubMenuTrigger(current).focus();
        } else {
          this.closeAll();
        }

        break;

      case 'Home':
        preventDefault = true;
        this.closeAll();
        this.items[0].querySelector('a, button')?.focus();
        break;

      case 'End':
        preventDefault = true;
        this.closeAll();
        this.items[this.items.length - 1].querySelector('a, button')?.focus();
        break;

      default: // Do nothing
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /**
   * Expands a given submenu by setting the 'aria-expanded' attribute to 'true'.
   *
   * @param {HTMLElement} target - The DOM element representing the submenu to expand.
   * @return {void} This method does not return any value.
   */
  expandSubMenu(target) {
    target.setAttribute('aria-expanded', 'true');
    target.classList.add(this.expandedClass);
  }

  /**
   * Collapses the sub-menu by setting the `aria-expanded` attribute to 'false' on the specified
   * target element.
   *
   * @param {HTMLElement} target - The HTML element representing the sub-menu to be collapsed.
   * @return {void} This method does not return a value.
   */
  collapseSubMenu(target) {
    target.setAttribute('aria-expanded', 'false');
    target.classList.remove(this.expandedClass);
  }

  /**
   * Retrieves the next sibling element of the given target element within a group of siblings.
   *
   * @param {Element} target - The target element whose next sibling is to be found.
   * @return {Element|null} The next sibling element, or null if no siblings are found.
   */
  getNextSibling(target) {
    const siblings = this.getSiblings(target);
    if (!siblings.length) return null;
    const currentIndex = Array.from(siblings).indexOf(target);
    const nextIndex = (currentIndex + 1) % siblings.length;
    return siblings[nextIndex];
  }

  /**
   * Retrieves the previous sibling of the given target element from a list of siblings.
   *
   * @param {Element} target - The target element for which the previous sibling is to be retrieved.
   * @return {Element|null} The previous sibling element, or null if there are no siblings.
   */
  getPreviousSibling(target) {
    const siblings = this.getSiblings(target);
    if (!siblings.length) return null;
    const currentIndex = Array.from(siblings).indexOf(target);
    const previousIndex = currentIndex === 0 ? siblings.length - 1 : currentIndex - 1;
    return siblings[previousIndex];
  }

  /**
   * Retrieves the sibling elements of the provided target within a specific menu structure.
   *
   * @param {Element} target - The target element whose siblings are to be retrieved.
   * @return {NodeList} A collection of sibling elements matching the specified selectors, or an
   * empty NodeList if no siblings are found.
   */
  getSiblings(target) {
    return target.closest(this.itemsSelector).querySelectorAll(`
      :scope > ${this.itemSelector} > a,
      :scope > ${this.itemSelector} > button
    `);
  }

  /**
   * Retrieves the parent menu items associated with a given target element.
   *
   * @param {Element} target - The DOM element for which the parent menu items will be fetched.
   * @return {NodeList} A list of parent menu items, including `<a>`, `<button>`, and `<span>`
   * elements, or an empty NodeList if no parent menu exists.
   */
  getParentMenuItems(target) {
    const menuBelow = target.closest(this.dropdownSelector);
    if (!menuBelow) return [];

    const parentMenu = menuBelow.closest(this.itemsSelector);
    if (!parentMenu) return [];

    return parentMenu.querySelectorAll(`
      :scope > ${this.itemSelector} > a,
      :scope > ${this.itemSelector} > button
    `);
  }

  /**
   * Retrieves the submenu links for a specified target element.
   *
   * @param {Element} target - The DOM element whose submenu links are to be retrieved.
   * @return {NodeList|Array} A NodeList containing the submenu link elements.
   * If the submenu does not exist, an empty array is returned.
   */
  getSubMenuLinks(target) {
    const subMenu = target.nextElementSibling;
    if (!subMenu) return [];
    return subMenu.querySelectorAll(`
      :scope > ${this.itemsSelector} > ${this.itemSelector} > a,
      :scope > ${this.itemsSelector} > ${this.itemSelector} > button
    `);
  }

  /**
   * Retrieves the trigger element of a sub-menu based on the provided target element.
   *
   * @param {Element} target - The target DOM element to find the sub-menu trigger for.
   * @return {Element|null} The trigger element of the sub-menu if it exists, or null if not found.
   */
  getSubMenuTrigger(target) {
    const menuBelow = target.closest(this.dropdownSelector);
    return menuBelow ? menuBelow.previousElementSibling : null;
  }

  /**
   * Determines if a given element is expanded based on its `aria-expanded` attribute.
   *
   * @param {Element} element - The DOM element to check for the `aria-expanded` attribute.
   * @return {boolean} Returns true if the `aria-expanded` attribute is set to 'true',
   * otherwise false.
   */
  static isExpanded(element) {
    return element.getAttribute('aria-expanded') === 'true';
  }
}
