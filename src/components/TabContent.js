/**
 * @file
 * Components - Tab Content
 * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/tabs
 */

export class TabContent {
  constructor(element, options = {}) {
    // Default options
    const defaultOptions = {
      selectors: {
        navigation: '.tab-content__navigation',
        group: '.tab-content__group',
        trigger: '.tab-content__trigger',
      },
      classes: {
        expanded: 'is-expanded',
      },
      breakpoint: 768,
    };

    // Merge default options with user-provided options
    this.options = {...defaultOptions, ...options};

    this.element = element;
    this.expandedClass = this.options.classes.expanded;
    this.navigation = this.element.querySelector(this.options.selectors.navigation);
    this.groups = this.element.querySelectorAll(this.options.selectors.group);
    this.triggers = this.element.querySelectorAll(this.options.selectors.trigger);
    this.mediaQuery = null;
    this.state = null;
  }


  /**
   * Initializes the tab content component by setting up DOM element references
   * and attaching necessary event listeners for interaction.
   *
   * @return {void} Does not return any value.
   */
  init() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this.onTriggerClick.bind(this));
      trigger.addEventListener('keydown', this.onTriggerKeydown.bind(this));
    });

    // Device or viewport change listener and on load.
    this.mediaQuery = window.matchMedia(`(min-width: ${this.options.breakpoint}px)`);
    this.mediaQuery.addEventListener('change', this.onMediaQueryChange.bind(this));
    this.onMediaQueryChange();
  }

  /**
   * Handles the 'change' event for a media query.
   *
   * This function is triggered when the media query's evaluated result changes, such as when the viewport width crosses a specified breakpoint.
   * It updates the component's state and adjusts the UI accordingly to ensure that the tab content behaves correctly in both desktop and mobile views.
    *
   * @return {void} Does not return any value.
   */
  onMediaQueryChange() {
    if (this.mediaQuery.matches) {
      this.state = 'desktop';

      this.triggers.forEach((trigger, index) => {
        this.navigation.append(trigger);

        if (index !== 0) {
          this.collapseTrigger(trigger);
          this.groups[index].classList.remove(this.expandedClass);
        } else {
          this.expandTrigger(trigger);
          this.groups[0].classList.add(this.expandedClass);
        }
      });
    } else {
      this.state = 'mobile';

      this.triggers.forEach((trigger, index) => {
        this.groups[index].prepend(trigger);
        trigger.removeAttribute('tabindex');
      });
    }
  }

  /**
   * Collapses the specified trigger element, updating its ARIA attributes and CSS classes.
   *
   * @param {HTMLElement} element - The trigger element to collapse.
   * @return {void} Does not return any value.
   */
  collapseTrigger(element) {
    element.classList.remove(this.expandedClass);
    element.setAttribute('aria-selected', 'false');
    element.setAttribute('aria-expanded', 'false');

    if (this.state === 'desktop') {
      element.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Expands the specified trigger element, updating its ARIA attributes and CSS classes.
   *
   * @param {HTMLElement} element - The trigger element to expand.
   * @return {void} Does not return any value.
   */
  expandTrigger(element) {
    element.classList.add(this.expandedClass);
    element.setAttribute('aria-selected', 'true');
    element.setAttribute('aria-expanded', 'true');

    if (this.state === 'desktop') {
      element.removeAttribute('tabindex');
    }
  }

  /**
   * Handles the 'click' event for a trigger element.
   *
   * This function is triggered when a user clicks on a trigger element.
   * It toggles the expanded state of the associated content group based on the current state (desktop or mobile).
   *
   * @param {Event} event - The click event object.
   * @return {void} Does not return any value.
   */
  onTriggerClick(event) {
    const controlledGroup = this.getControlledByID(event.currentTarget);

    if (this.state === 'desktop') {
      if (
        !this.containsExpandedClass(event.currentTarget) &&
        !this.containsExpandedClass(controlledGroup)
      ) {
        this.triggers.forEach((trigger) => {
          this.collapseTrigger(trigger);
        });

        this.groups.forEach((group) => {
          group.classList.remove(this.expandedClass);
        });

        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.expandedClass);
      }
    }

    if (this.state === 'mobile') {
      if (this.containsExpandedClass(event.currentTarget)) {
        this.collapseTrigger(event.currentTarget);
        controlledGroup.classList.remove(this.expandedClass);
      } else {
        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.expandedClass);
      }
    }
  }

  /**
   * Handles the 'keydown' event for a trigger element.
   *
   * This function is triggered when a user presses a key while focused on a trigger element.
   * It manages keyboard navigation and toggling of the associated content group based on the current state (desktop or mobile).
   *
   * @param {Event} event - The keydown event object.
   * @return {void} Does not return any value.
   */
  onTriggerKeydown(event) {
    const controlledGroup = this.getControlledByID(event.currentTarget);

    if (this.state === 'desktop') {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (
          !this.containsExpandedClass(event.currentTarget) &&
          !this.containsExpandedClass(controlledGroup)
        ) {
          this.triggers.forEach((trigger) => {
            this.collapseTrigger(trigger);
          });

          this.groups.forEach((element) => {
            element.classList.remove(this.expandedClass);
          });

          this.expandTrigger(event.currentTarget);
          controlledGroup.classList.add(this.expandedClass);
        }
      }

      if (event.key === 'ArrowLeft') {
        if (event.currentTarget === this.triggers[0]) {
          setTimeout(() => {
            this.triggers[this.triggers.length - 1].focus();
          }, 1);
        } else {
          setTimeout(() => {
            event.target.previousElementSibling.focus();
          }, 1);
        }
      }

      if (event.key === 'ArrowRight') {
        if (event.currentTarget === this.triggers[this.triggers.length - 1]) {
          setTimeout(() => {
            this.triggers[0].focus();
          });
        } else {
          setTimeout(() => {
            event.target.nextElementSibling.focus();
          }, 1);
        }
      }

      if (event.key === 'Home') {
        setTimeout(() => {
          this.triggers[0].focus();
        }, 1);
      }

      if (event.key === 'End') {
        setTimeout(() => {
          this.triggers[this.triggers.length - 1].focus();
        })
      }
    }

    if (this.state === 'mobile') {
      if (this.containsExpandedClass(event.currentTarget)) {
        this.collapseTrigger(event.currentTarget);
        controlledGroup.classList.remove(this.expandedClass);
      } else {
        // Expand accordion.
        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.expandedClass);
      }
    }
  }

  /**
   * Checks if the specified element contains the expanded class.
   *
   * @param {HTMLElement} target - The element to check.
   * @return {boolean} True if the element contains the expanded class, false otherwise.
   */
  containsExpandedClass(target) {
    return target.classList.contains(this.expandedClass);
  }

  /**
   * Retrieves the element controlled by the specified trigger element's ID.
   *
   * @param {HTMLElement} target - The trigger element.
   * @return {HTMLElement} The element controlled by the trigger.
   */
  getControlledByID(target) {
    const controlID = target.getAttribute('aria-controls');
    return this.element.querySelector(`#${controlID}`);
  }
}
