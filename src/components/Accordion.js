/**
 * @file
 * Components - Accordion
 * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/accordion
 */

/**
 * Represents an Accordion component with event handling and state management
 * for expand/collapse interactions. One instance manages a single accordion element.
 */
export class Accordion {
  constructor(element, options = {}) {
    // Default options
    const defaultOptions = {
      selectors: {
        trigger: '.accordion__trigger[aria-controls]',
      },
      classes: {
        expanded: 'is-expanded',
      },
    };

    // Deep merge for nested options
    this.options = {
      ...defaultOptions,
      ...options,
      selectors: { ...defaultOptions.selectors, ...(options.selectors ?? {}) },
      classes:   { ...defaultOptions.classes,   ...(options.classes   ?? {}) },
    };

    this.element = element;
    this.expandedClass = this.options.classes.expanded;
    this.trigger = this.element.querySelector(this.options.selectors.trigger);
    this.panel = this.trigger
      ? this.element.querySelector(`#${Accordion.getControlledByID(this.trigger)}`)
      : null;

    // Store bound handler references for cleanup
    this._onClickTrigger   = this.onClickTrigger.bind(this);
    this._onKeydownTrigger = this.onKeydownTrigger.bind(this);
  }

  // LIFECYCLE

  /**
   * Initializes the accordion component by attaching the necessary event listeners
   * for click and keyboard interactions. Exits early if no trigger element is found.
   *
   * @return {void} Does not return any value.
   */
  init() {
    if (!this.trigger) return;

    this.trigger.addEventListener('click', this._onClickTrigger);
    this.trigger.addEventListener('keydown', this._onKeydownTrigger);
  }

  /**
   * Removes all event listeners attached by `init()`, cleaning up the instance
   * so it can be safely discarded or re-initialized.
   *
   * @return {void} Does not return any value.
   */
  destroy() {
    if (this.trigger) {
      this.trigger.removeEventListener('click', this._onClickTrigger);
      this.trigger.removeEventListener('keydown', this._onKeydownTrigger);
    }
  }

  // STATE

  /**
   * Expands the accordion by adding the expanded class to the panel and trigger
   * elements and updating the `aria-expanded` attribute to `true`.
   *
   * @return {void} Does not return a value.
   */
  expand() {
    if (this.panel) this.panel.classList.add(this.expandedClass);
    this.trigger.classList.add(this.expandedClass);
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * Collapses the accordion by removing the expanded class from the panel and
   * trigger elements and updating the `aria-expanded` attribute to `false`.
   *
   * @return {void} Does not return a value.
   */
  collapse() {
    if (this.panel) this.panel.classList.remove(this.expandedClass);
    this.trigger.classList.remove(this.expandedClass);
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  // EVENT HANDLERS

  /**
   * Handles click events on the trigger element, toggling the expanded or
   * collapsed state of the accordion.
   *
   * @return {void} Does not return any value.
   */
  onClickTrigger() {
    if (this.isExpanded()) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * Handles keydown events on the trigger element. Responds to `Enter` and
   * `Space` by toggling the accordion state and suppressing the default browser
   * action.
   *
   * @param {KeyboardEvent} event - The keyboard event fired on the trigger.
   * @return {void} Does not return any value.
   */
  onKeydownTrigger(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (this.isExpanded()) {
        this.collapse();
      } else {
        this.expand();
      }
    }
  }

  // UTILITIES

  /**
   * Returns whether the accordion section is currently expanded.
   *
   * @return {boolean} `true` if the trigger has the expanded class, `false` otherwise.
   */
  isExpanded() {
    return this.trigger.classList.contains(this.expandedClass);
  }

  /**
   * Returns the value of the `aria-controls` attribute on the given element,
   * which corresponds to the ID of the panel it controls.
   *
   * @param {Element} target - The DOM element from which to read `aria-controls`.
   * @return {string|null} The controlled element's ID, or `null` if the attribute is absent.
   */
  static getControlledByID(target) {
    return target.getAttribute('aria-controls');
  }
}
