/**
 * @file
 * Components - Accordion
 * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/accordion
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

    // Merge default options with user-provided options
    this.options = { ...defaultOptions, ...options };

    this.expandedClass = this.options.classes.expanded;
    this.element = element;
    this.trigger = this.element.querySelector(this.options.selectors.trigger);
    this.panel = this.element.querySelector(`#${Accordion.getControlledByID(this.trigger)}`);
    this.init();
  }

  /**
   * Initializes the accordion component by setting up DOM element references
   * and attaching necessary event listeners for interaction.
   *
   * @return {void} Does not return any value.
   */
  init() {
    this.trigger.addEventListener('click', this.onClickTrigger);
    this.trigger.addEventListener('keydown', this.onKeydownTrigger);
  }

  /**
   * Toggles the expanded or collapsed state of a component.
   *
   * This function checks the current state of the component using the `isExpanded` method.
   * If the component is expanded, it will invoke the `collapse` method to collapse the component.
   * Otherwise, it will invoke the `expand` method to expand the component.
   *
   * Designed to be used as an event handler for a click event to trigger UI state changes.
   */
  onClickTrigger = () => {
    if (this.isExpanded()) {
      this.collapse();
    } else {
      this.expand();
    }
  };

  /**
   * Handles the 'keydown' event for an interactive element.
   *
   * This function is triggered when a keydown event occurs and is designed specifically
   * to respond to the 'Enter' or 'Space' keys. If either key is pressed, the default browser
   * behavior is prevented, and the function toggles between collapsing and expanding
   * the associated element based on its current state.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  onKeydownTrigger = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // Check to see if class exists first.
      if (this.isExpanded()) {
        this.collapse();
      } else {
        this.expand();
      }
    }
  };

  /**
   * Expands the accordion by adding the expanded class to the relevant elements
   * and updating the aria-expanded attribute to indicate an expanded state.
   *
   * @return {void} Does not return a value.
   */
  expand() {
    this.panel.classList.add(this.expandedClass);
    this.trigger.classList.add(this.expandedClass);
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * Collapses the accordion by removing the expanded class from the accordion content
   * and trigger elements, and updates the aria-expanded attribute to false.
   *
   * @return {void} Does not return a value.
   */
  collapse() {
    this.panel.classList.remove(this.expandedClass);
    this.trigger.classList.remove(this.expandedClass);
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Checks whether the accordion section is currently expanded.
   *
   * This function determines the state of the accordion by checking if
   * the trigger element contains a specific CSS class that represents
   * the expanded state of the accordion.
   *
   * @return {boolean} True if the accordion is expanded, otherwise false.
   */
  isExpanded() {
    return this.trigger.classList.contains(this.expandedClass);
  }

  /**
   * Retrieves the ID of the element controlled by the given target element.
   *
   * This function accesses the `aria-controls` attribute of the provided target
   * element and returns its value. The `aria-controls` attribute typically
   * contains the ID of another element that the target element controls or affects.
   *
   * @param {Element} target - The DOM element from which to retrieve the `aria-controls` attribute.
   * @returns {string | null} The value of the `aria-controls` attribute, or null if the attribute
   * is not present.
   */
  static getControlledByID(target) {
    return target.getAttribute('aria-controls');
  }
}
