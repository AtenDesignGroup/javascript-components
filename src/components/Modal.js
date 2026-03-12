/**
 * @file
 * Components - Modal
 */

/**
 * Represents a Modal component with event handling and state management
 * for dialog interactions. This class is responsible for opening and closing
 * a modal dialog, trapping focus within it while open, and restoring focus
 * to the triggering element on close. The modal element is relocated to the
 * bottom of the document body on mount to simplify fixed positioning.
 */
export class Modal {
  constructor(element, options = {}) {
    const defaultOptions = {
      selectors: {
        trigger: `[aria-controls="${element.id}"]`,
        closeButton: '.modal__close',
        overlay: '.modal__overlay',
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
    this.overlay = null;
    this.closeButtons = null;
    this.triggers = null;
    this._previousFocus = null;

    // Store bound handler references for cleanup
    this._onTriggerClick  = this.onTriggerClick.bind(this);
    this._onCloseClick    = this.onCloseClick.bind(this);
    this._onOverlayClick  = this.onOverlayClick.bind(this);
    this._onKeydown       = this.onKeydown.bind(this);
  }

  // LIFECYCLE

  /**
   * Moves the modal element to the bottom of <body>, caches internal elements,
   * queries document-global triggers by `aria-controls`, and attaches all event
   * listeners required for open/close and keyboard interactions.
   *
   * @return {void} This method does not return any value.
   */
  mount() {
    // Move the modal element to the bottom of <body> for fixed-position ease
    document.body.appendChild(this.element);

    // Cache internal elements
    this.overlay      = this.element.querySelector(this.options.selectors.overlay);
    this.closeButtons = this.element.querySelectorAll(this.options.selectors.closeButton);

    // Triggers can live anywhere in the document
    this.triggers = document.querySelectorAll(this.options.selectors.trigger);

    // Event listeners
    this.triggers.forEach((trigger) => trigger.addEventListener('click', this._onTriggerClick));
    this.closeButtons.forEach((btn) => btn.addEventListener('click', this._onCloseClick));

    if (this.overlay) {
      this.overlay.addEventListener('click', this._onOverlayClick);
    }

    document.addEventListener('keydown', this._onKeydown);
  }

  /**
   * Removes all event listeners attached by `mount()`, cleaning up the instance
   * so it can be safely discarded or re-mounted.
   *
   * @return {void} This method does not return any value.
   */
  destroy() {
    this.triggers.forEach((trigger) => trigger.removeEventListener('click', this._onTriggerClick));
    this.closeButtons.forEach((btn) => btn.removeEventListener('click', this._onCloseClick));

    if (this.overlay) {
      this.overlay.removeEventListener('click', this._onOverlayClick);
    }

    document.removeEventListener('keydown', this._onKeydown);
  }

  // STATE

  /**
   * Opens the modal dialog by adding the expanded class and updating ARIA
   * attributes. Stores the previously focused element so focus can be restored
   * on close, locks body scroll, and moves focus to the first focusable element
   * inside the dialog.
   *
   * @param {HTMLElement|null} trigger - The element that triggered the open, used
   *   for focus restoration. Falls back to `document.activeElement` if omitted.
   * @return {void} This method does not return any value.
   */
  open(trigger) {
    this._previousFocus = trigger ?? document.activeElement;

    this.element.classList.add(this.expandedClass);
    this.element.setAttribute('aria-hidden', 'false');

    this.triggers.forEach((t) => t.setAttribute('aria-expanded', 'true'));

    document.body.style.overflow = 'hidden';

    // Focus the first focusable element inside the modal
    const focusable = this.getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  /**
   * Closes the modal dialog by removing the expanded class and updating ARIA
   * attributes. Restores body scroll and returns focus to the element that
   * originally opened the modal.
   *
   * @return {void} This method does not return any value.
   */
  close() {
    this.element.classList.remove(this.expandedClass);
    this.element.setAttribute('aria-hidden', 'true');

    this.triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));

    document.body.style.overflow = '';

    // Return focus to the element that opened the modal
    if (this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
  }

  // EVENT HANDLERS

  /**
   * Handles click events on trigger elements and opens the modal.
   *
   * @param {MouseEvent} event - The click event fired by the trigger element.
   * @return {void} This method does not return any value.
   */
  onTriggerClick(event) {
    event.preventDefault();
    this.open(event.currentTarget);
  }

  /**
   * Handles click events on close button elements and closes the modal.
   *
   * @return {void} This method does not return any value.
   */
  onCloseClick() {
    this.close();
  }

  /**
   * Handles click events on the overlay element. Closes the modal only when the
   * click target is the overlay itself, ignoring clicks on the dialog content within it.
   *
   * @param {MouseEvent} event - The click event fired on the overlay.
   * @return {void} This method does not return any value.
   */
  onOverlayClick(event) {
    // Only close when clicking directly on the overlay, not on the dialog within it
    if (event.target === this.overlay) {
      this.close();
    }
  }

  /**
   * Handles keydown events on the document while the modal is open. Closes the
   * modal on Escape and traps focus within the dialog by intercepting Tab and
   * Shift+Tab to cycle between the first and last focusable elements.
   *
   * @param {KeyboardEvent} event - The keydown event fired on the document.
   * @return {void} This method does not return any value.
   */
  onKeydown(event) {
    if (!this.isOpen()) return;

    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.close();
      return;
    }

    // Focus trap: keep Tab / Shift+Tab cycling within the modal
    if (event.key === 'Tab') {
      const focusable = this.getFocusableElements();
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: if focus is on the first element, wrap to last
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus is on the last element, wrap to first
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  }

  // UTILITIES

  /**
   * Returns whether the modal is currently open.
   *
   * @return {boolean} `true` if the modal has the expanded class, `false` otherwise.
   */
  isOpen() {
    return this.element.classList.contains(this.expandedClass);
  }

  /**
   * Returns an array of all keyboard-focusable elements within the modal element,
   * excluding those with `tabindex="-1"` or the `disabled` attribute.
   *
   * @return {HTMLElement[]} An array of focusable descendant elements.
   */
  getFocusableElements() {
    return Array.from(
      this.element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }
}
