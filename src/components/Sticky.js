/**
 * @file
 * Components - Sticky
 * Functionality for a sticky element that remains visible within its parent container as the user scrolls the page.
 */

export class Sticky {
  constructor(element, options = {}) {
    // Default options
    const defaultOptions = {
      topSpacing: 40,
      classes: {
        stuck: 'is-stuck',
        bottom: 'is-bottom',
      },
    };

    // Merge default options with user-provided options
    this.options = {
      ...defaultOptions,
      ...options,
      classes: {
        ...defaultOptions.classes,
        ...(options.classes || {}),
      },
    };

    this.element = element;
    this.parent = this.element.parentElement;
    this.stuckClass = this.options.classes.stuck;
    this.bottomClass = this.options.classes.bottom;
    this.flag = false;
    this.currentState = 'default';
  }

  /**
   * Mount the sticky element by setting up necessary styles, caching layout values,
   * and attaching event listeners for scroll and resize events.
   *
   * @return {void}
   */
  mount() {
    if (!this.parent) return;

    // Ensure the container is positioned so `position: absolute` works.
    const parentPosition = getComputedStyle(this.parent).position;
    if (parentPosition === 'static') {
      this.parent.style.position = 'relative';
    }

    // Cache layout values *before* any sticky class is applied so that
    // toggling position doesn't feed back into the measurements.
    this.elHeight = this.element.offsetHeight;
    this.elOffsetTop = this.element.offsetTop;

    // Prevent the parent from collapsing when the child becomes absolute.
    this.parent.style.minHeight = `${this.parent.offsetHeight}px`;

    // Cache the parent's document-relative top once and refresh on resize.
    this._cacheParentTop();
    this._resizeObserver = new ResizeObserver(() => this.update());
    this._resizeObserver.observe(this.parent);
    this._resizeObserver.observe(document.documentElement);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    
    // Run once on attach so the correct class is applied immediately.
    this.update();
  }

  /**
   * Unmount the sticky element by removing event listeners and disconnecting any observers to clean up resources.
   *
   * @return {void}
   */
  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    this._resizeObserver?.disconnect();
  }

  /**
   * Apply a visual state to the sticky element by adding/removing CSS classes and setting the `top` style.
   *
   * @param {'default'|'stuck'|'bottom'} state - The state to apply to the element.
   * @param {number} [top] - The top offset in pixels to apply when the state is 'stuck'.
   * @return {void}
   */
  applyState(state, top) {
    // 'stuck' is never short-circuited because the `top` offset changes on
    // every scroll tick even when the state label stays the same.
    if (state === this.currentState && state !== 'stuck') return;
    this.currentState = state;

    if (state === 'stuck') {
      this.element.classList.add(this.stuckClass);
      this.element.classList.remove(this.bottomClass);
      this.element.style.top = `${top}px`;
    } else if (state === 'bottom') {
      this.element.classList.remove(this.stuckClass);
      this.element.classList.add(this.bottomClass);
      this.element.style.top = '';
    } else {
      this.element.classList.remove(this.stuckClass, this.bottomClass);
      this.element.style.top = '';
    }
  }

  /**
   * Recalculate and apply the appropriate sticky state based on the current scroll position.
   *
   * @return {void}
   */
  update() {
    const parentTop = this._cacheParentTop();

    // The scroll-Y at which the element should start sticking.
    const startStick = parentTop + this.elOffsetTop - this.options.topSpacing;
    // The scroll-Y at which the element should anchor to the bottom.
    const endStick =
      parentTop + this.parent.offsetHeight - this.elHeight - this.options.topSpacing;

    const scrollY = window.scrollY;

    if (endStick <= startStick) {
      // Element is taller than (or equal to) the available space —
      // sticky behaviour would be meaningless.
      this.applyState('default');
    } else if (scrollY < startStick) {
      // Above the sticky zone — default position.
      this.applyState('default');
    } else if (scrollY >= endStick) {
      // Past the bottom of the parent — anchor to parent bottom.
      this.applyState('bottom');
    } else {
      // In the sticky zone — track viewport via absolute top.
      const top = scrollY - parentTop + this.options.topSpacing;
      this.applyState('stuck', top);
    }

    // Mark the frame as finished so the next scroll event can queue another.
    this.flag = false;
  };

  /**
   * Handle the scroll event by queuing an update on the next animation frame.
   * This throttles the update calls to once per frame for performance.
   *
   * @return {void}
   */
  onScroll = () => {
    // Only queue an update if one isn't already waiting for the next frame.
    if (!this.flag) {
      window.requestAnimationFrame(() => this.update());
      this.flag = true; // Block any further queues until the frame runs.
    }
  };

  /**
   * Calculates the top offset of the parent element relative to the document.
   *
   * @return {number} The top offset of the parent element in pixels.
   */
  _cacheParentTop() {
    return this.parent.getBoundingClientRect().top + window.scrollY;
  }
}
