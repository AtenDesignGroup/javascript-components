/**
 * @file
 * Components - Tab Content
 * Functionality for a Tab Content component using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/tabs
 */

/**
 * Represents a Tab Content component with event handling and state management
 * for tab navigation. On desktop viewports the triggers are collected into a
 * navigation bar; on mobile they revert to an accordion-style layout within
 * each content group.
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

    // Deep merge for nested options
    this.options = {
      ...defaultOptions,
      ...options,
      selectors: { ...defaultOptions.selectors, ...(options.selectors ?? {}) },
      classes:   { ...defaultOptions.classes,   ...(options.classes   ?? {}) },
    };

    this.element = element;
    this.expandedClass = this.options.classes.expanded;
    this.navigation = this.element.querySelector(this.options.selectors.navigation);
    this.groups = this.element.querySelectorAll(this.options.selectors.group);
    this.triggers = this.element.querySelectorAll(this.options.selectors.trigger);
    this.mediaQuery = null;
    this.state = null;

    // Store bound handler references for cleanup
    this._onTriggerClick     = this.onTriggerClick.bind(this);
    this._onTriggerKeydown   = this.onTriggerKeydown.bind(this);
    this._onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  // LIFECYCLE

  /**
   * Initializes the tab content component by attaching event listeners to each
   * trigger and setting up the responsive media query. Exits early per-trigger
   * if no triggers are found.
   *
   * @return {void} Does not return any value.
   */
  init() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this._onTriggerClick);
      trigger.addEventListener('keydown', this._onTriggerKeydown);
    });

    // Device or viewport change listener and on load.
    this.mediaQuery = window.matchMedia(`(min-width: ${this.options.breakpoint}px)`);
    this.mediaQuery.addEventListener('change', this._onMediaQueryChange);
    this._onMediaQueryChange();
  }

  /**
   * Removes all event listeners attached by `init()`, cleaning up the instance
   * so it can be safely discarded or re-initialized.
   *
   * @return {void} Does not return any value.
   */
  destroy() {
    if (this.triggers) {
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener('click', this._onTriggerClick);
        trigger.removeEventListener('keydown', this._onTriggerKeydown);
      });
    }

    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this._onMediaQueryChange);
    }
  }

  // STATE

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

  // EVENT HANDLERS

  /**
   * Handles changes in media query state and repositions triggers between the
   * navigation bar (desktop) and their individual content groups (mobile).
   *
   * @return {void} Does not return any value.
   */
  onMediaQueryChange() {
    if (this.mediaQuery.matches) {
      this.state = 'desktop';

      this.triggers.forEach((trigger, index) => {
        if (this.navigation) this.navigation.append(trigger);

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
   * Handles click events on a trigger element. On desktop, switches to the
   * clicked tab; on mobile, toggles the associated content group like an accordion.
   *
   * @param {MouseEvent} event - The click event fired on the trigger.
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
   * Handles keydown events on a trigger element. On desktop, `Enter`/`Space`
   * activates the tab and arrow/Home/End keys navigate between tabs. On mobile,
   * `Enter`/`Space` toggles the accordion group.
   *
   * @param {KeyboardEvent} event - The keydown event fired on the trigger.
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
        event.preventDefault();

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
        event.preventDefault();

        if (event.currentTarget === this.triggers[this.triggers.length - 1]) {
          setTimeout(() => {
            this.triggers[0].focus();
          }, 1);
        } else {
          setTimeout(() => {
            event.target.nextElementSibling.focus();
          }, 1);
        }
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setTimeout(() => {
          this.triggers[0].focus();
        }, 1);
      }

      if (event.key === 'End') {
        event.preventDefault();
        setTimeout(() => {
          this.triggers[this.triggers.length - 1].focus();
        }, 1);
      }
    }

    if (this.state === 'mobile') {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

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
  }

  // UTILITIES

  /**
   * Returns whether the specified element contains the expanded class.
   *
   * @param {HTMLElement} target - The element to check.
   * @return {boolean} `true` if the element has the expanded class, `false` otherwise.
   */
  containsExpandedClass(target) {
    return target.classList.contains(this.expandedClass);
  }

  /**
   * Returns the element controlled by the given trigger's `aria-controls` attribute.
   *
   * @param {HTMLElement} target - The trigger element.
   * @return {HTMLElement|null} The controlled element, or `null` if not found.
   */
  getControlledByID(target) {
    const controlID = target.getAttribute('aria-controls');
    return this.element.querySelector(`#${controlID}`);
  }
}
