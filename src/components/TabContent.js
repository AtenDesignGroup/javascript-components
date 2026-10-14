/**
 * @file
 * Components - Tab Content
 * Accessible, manually activated tabs with a responsive accordion layout.
 */

/**
 * Public state for one tab or accordion item.
 *
 * @typedef {Object} TabContentItemState
 * @property {number} index - Zero-based item index.
 * @property {string} id - Stable ID of the item's group.
 * @property {HTMLButtonElement} trigger - The item's activation button.
 * @property {HTMLElement} panel - Currently controlled content, or the group after destroy.
 * @property {boolean} open - Whether the item's content is open.
 */

/**
 * Independent state records with live references to the component's DOM elements.
 *
 * @typedef {Object} TabContentState
 * @property {'tabs'|'accordion'|null} mode - Current layout, or null when uninitialized.
 * @property {number|null} activeIndex - Active item index, or null when no item is open.
 * @property {number[]} openIndices - Sorted indices of open items.
 * @property {TabContentItemState[]} items - State and DOM references for each item.
 */

/**
 * Manages manually activated tabs and responsive accordion controls, preserving
 * selection and focus while synchronizing accessible state with the DOM.
 */
export class TabContent {
  /**
   * Creates an instance without modifying the DOM or attaching listeners.
   *
   * @param {HTMLElement} element - Root containing the navigation, groups, and triggers.
   * @param {Object} [options={}] - Selector, class, responsive, and state callback options.
   * @param {Object} [options.selectors] - Selectors merged with the component defaults.
   * @param {Object} [options.classes] - Class names merged with the component defaults.
   * @param {number} [options.breakpoint=768] - Inclusive minimum viewport width for tabs.
   * @param {'horizontal'|'vertical'} [options.orientation] - Keyboard orientation;
   *   defaults to authored aria-orientation, then horizontal.
   * @param {Object} [options.accordion] - Accordion behavior options.
   * @param {boolean} [options.accordion.singleOpen=false] - Limit open accordion items to one.
   * @param {boolean} [options.accordion.collapsible=true] - Allow closing the last open item.
   * @param {function(TabContentState & {reason: string}): void|null} [options.onChange=null]
   *   - Synchronous callback after committed state changes.
   */
  constructor(element, options = {}) {
    const defaultOptions = {
      selectors: {
        navigation: '.tab-content__navigation',
        group: '.tab-content__group',
        trigger: '.tab-content__trigger',
        content: '.tab-content__content',
      },
      classes: { expanded: 'is-expanded' },
      breakpoint: 768,
      orientation: 'horizontal',
      accordion: { singleOpen: false, collapsible: true },
      onChange: null,
    };

    this.options = {
      ...defaultOptions,
      ...options,
      selectors: { ...defaultOptions.selectors, ...(options.selectors ?? {}) },
      classes: { ...defaultOptions.classes, ...(options.classes ?? {}) },
      accordion: { ...defaultOptions.accordion, ...(options.accordion ?? {}) },
    };
    this.element = element;
    this.expandedClass = this.options.classes.expanded;
    this.navigation = element.querySelector(this.options.selectors.navigation);
    if (options.orientation === undefined && this.navigation?.hasAttribute('aria-orientation')) {
      this.options.orientation = this.navigation.getAttribute('aria-orientation');
    }
    this.groups = element.querySelectorAll(this.options.selectors.group);
    this.triggers = element.querySelectorAll(this.options.selectors.trigger);
    this.mediaQuery = null;
    this.state = null;
    this.initialized = false;
    this.items = [];
    this.openIndices = new Set();
    this.activeIndex = 0;
    this.focusIndex = 0;
    this._snapshots = [];
    this._onTriggerClick = this.onTriggerClick.bind(this);
    this._onTriggerKeydown = this.onTriggerKeydown.bind(this);
    this._onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  /**
   * Validates configuration, snapshots authored DOM, and attaches interaction
   * and responsive listeners. Repeated initialization and empty roots are no-ops.
   *
   * @throws {TypeError} If a supported option has an invalid value.
   * @throws {Error} If navigation or trigger/group relationships are invalid.
   * @return {void}
   */
  init() {
    if (this.initialized) return;
    if (!Number.isFinite(this.options.breakpoint) || this.options.breakpoint < 0) {
      throw new TypeError('TabContent: breakpoint must be a finite, non-negative number.');
    }
    if (!['horizontal', 'vertical'].includes(this.options.orientation)) {
      throw new TypeError('TabContent: orientation must be horizontal or vertical.');
    }
    if (this.options.onChange !== null && typeof this.options.onChange !== 'function') {
      throw new TypeError('TabContent: onChange must be a function or null.');
    }
    if (typeof this.options.accordion.singleOpen !== 'boolean' ||
        typeof this.options.accordion.collapsible !== 'boolean') {
      throw new TypeError('TabContent: accordion options must be booleans.');
    }
    if (!this.triggers.length) return;
    if (!this.navigation) throw new Error('TabContent: a navigation container is required.');

    const groups = Array.from(this.groups);
    const controlledGroups = Array.from(this.triggers, (trigger) => this.getControlledByID(trigger));
    if (controlledGroups.some((group) => !groups.includes(group)) ||
        new Set(controlledGroups).size !== groups.length ||
        controlledGroups.length !== groups.length ||
        new Set(Array.from(this.triggers, (trigger) => trigger.id)).size !== this.triggers.length ||
        Array.from(this.triggers).some((trigger) => trigger.tagName !== 'BUTTON' || !trigger.id)) {
      throw new Error('TabContent: each button needs an ID and must control a distinct group.');
    }

    this._remember(this.navigation, ['role', 'aria-orientation', 'hidden']);
    this.items = Array.from(this.triggers, (trigger, index) => {
      const group = controlledGroups[index];
      this._remember(group, ['role', 'aria-labelledby', 'hidden', 'tabindex']);
      this._remember(trigger, [
        'role', 'aria-selected', 'aria-expanded', 'aria-controls', 'aria-haspopup',
        'aria-disabled', 'tabindex', 'type',
      ]);
      const location = { parent: trigger.parentNode, next: trigger.nextSibling };
      let panel = group.querySelector(this.options.selectors.content);
      const contentNodes = Array.from(group.childNodes).filter((node) => node !== trigger);
      const onlyContent = panel && contentNodes.every((node) =>
        node === panel || (node.nodeType === 3 && !node.textContent.trim()));
      const generated = !onlyContent;
      if (generated) {
        panel = group.ownerDocument.createElement('div');
        contentNodes.forEach((node) => panel.append(node));
        group.append(panel);
      }
      this._remember(panel, ['id', 'role', 'aria-labelledby', 'hidden']);
      if (!panel.id) {
        let id = `${group.id}-content`;
        while (group.ownerDocument.getElementById(id)) id += '-panel';
        panel.id = id;
      }
      return { trigger, group, panel, location, generated };
    });

    this.activeIndex = 0;
    this.focusIndex = 0;
    // Desktop has always started on the first tab; mobile keeps authored open state.
    this.openIndices = new Set(this.items.flatMap(({ trigger, group }, index) =>
      this.containsExpandedClass(trigger) || this.containsExpandedClass(group) ? [index] : []));
    this.mediaQuery = window.matchMedia(`(min-width: ${this.options.breakpoint}px)`);
    this.initialized = true;
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this._onTriggerClick);
      trigger.addEventListener('keydown', this._onTriggerKeydown);
    });
    this.mediaQuery.addEventListener('change', this._onMediaQueryChange);
    if (!Number.isInteger(this.options.breakpoint)) {
      window.addEventListener('resize', this._onMediaQueryChange);
    }
    this.onMediaQueryChange();
  }

  /**
   * Removes listeners and generated markup, restores authored DOM and focus,
   * and notifies consumers with closed item state for content cleanup.
   * Repeated destruction is a no-op; the instance can be initialized again.
   *
   * @return {void}
   */
  destroy() {
    if (!this.initialized) return;
    this.triggers.forEach((trigger) => {
      trigger.removeEventListener('click', this._onTriggerClick);
      trigger.removeEventListener('keydown', this._onTriggerKeydown);
    });
    this.mediaQuery.removeEventListener('change', this._onMediaQueryChange);
    window.removeEventListener('resize', this._onMediaQueryChange);
    const focused = this.element.ownerDocument.activeElement;
    this.items.forEach(({ panel, generated }) => {
      if (generated) panel.replaceWith(...panel.childNodes);
    });
    this.items.slice().reverse().forEach(({ trigger, location }) => {
      location.parent.insertBefore(trigger, location.next);
    });
    this._snapshots.forEach(({ element, attributes, expanded }) => {
      attributes.forEach(([name, value]) => {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      });
      element.classList.toggle(this.expandedClass, expanded);
    });
    if (this.element.contains(focused) && focused !== this.element.ownerDocument.activeElement) {
      focused.focus();
    }
    this.initialized = false;
    this.mediaQuery = null;
    this.state = null;
    this.openIndices.clear();
    const snapshot = this.getState();
    this.items = [];
    this._snapshots = [];
    this._notify('destroy', snapshot);
  }

  /**
   * Saves managed attributes and the expanded class for restoration on destroy.
   *
   * @private
   * @param {HTMLElement} element - Element whose authored state must be preserved.
   * @param {string[]} names - Attribute names to snapshot, including absent attributes.
   * @return {void}
   */
  _remember(element, names) {
    this._snapshots.push({
      element,
      attributes: names.map((name) => [name, element.getAttribute(name)]),
      expanded: this.containsExpandedClass(element),
    });
  }

  /**
   * Applies collapsed styling and mode-specific ARIA/focus state to a trigger.
   * Does not change the open-item model or notify consumers.
   *
   * @param {HTMLButtonElement} element - Trigger to collapse.
   * @return {void}
   */
  collapseTrigger(element) {
    element.classList.remove(this.expandedClass);
    if (this.state === 'desktop') {
      element.setAttribute('aria-selected', 'false');
      element.setAttribute('tabindex', '-1');
    } else {
      element.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Applies expanded styling and mode-specific ARIA/focus state to a trigger.
   * Does not change the open-item model or notify consumers.
   *
   * @param {HTMLButtonElement} element - Trigger to expand.
   * @return {void}
   */
  expandTrigger(element) {
    element.classList.add(this.expandedClass);
    if (this.state === 'desktop') {
      element.setAttribute('aria-selected', 'true');
      element.setAttribute('tabindex', '0');
    } else {
      element.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Initializes or switches layouts using the configured breakpoint, preserving
   * the active item and retaining focus or moving it out of hidden content.
   * Unchanged layouts do not render or notify consumers.
   *
   * @return {void}
   */
  onMediaQueryChange() {
    if (!this.initialized) return;
    // Some engines round fractional media queries down, including 768.0001px.
    const desktop = Number.isInteger(this.options.breakpoint)
      ? this.mediaQuery.matches
      : window.innerWidth >= this.options.breakpoint;
    const nextState = desktop ? 'desktop' : 'mobile';
    if (nextState === this.state) return;
    const initial = this.state === null;
    const focused = this.element.ownerDocument.activeElement;
    const focusedItem = this.items.findIndex(({ trigger, group }) =>
      trigger === focused || group.contains(focused));
    this.state = nextState;

    if (this.state === 'desktop') {
      if (!initial && !this.openIndices.has(this.activeIndex) && this.openIndices.size) {
        this.activeIndex = this.openIndices.values().next().value;
      }
      this.openIndices = new Set([this.activeIndex]);
      this.focusIndex = focusedItem >= 0 ? focusedItem : this.activeIndex;
    } else {
      if (initial && this.openIndices.size) this.activeIndex = this.openIndices.values().next().value;
      if (this.options.accordion.singleOpen && this.openIndices.size > 1) {
        this.openIndices = new Set([this.activeIndex]);
      }
      if (!this.options.accordion.collapsible && !this.openIndices.size) {
        this.openIndices.add(this.activeIndex);
      }
    }
    this._render();
    if (focusedItem >= 0) {
      const { trigger, group } = this.items[focusedItem];
      const hidden = group.hidden || this.items[focusedItem].panel.hidden;
      if (hidden || focused === trigger) trigger.focus();
      else if (focused !== this.element.ownerDocument.activeElement) focused.focus();
    }
    this._notify(initial ? 'init' : 'breakpoint');
  }

  /**
   * Synchronizes trigger locations, roles, relationships, visibility, expanded
   * classes, and tab stops with the current layout and open-item model.
   *
   * @private
   * @return {void}
   */
  _render() {
    const desktop = this.state === 'desktop';
    this.navigation.hidden = !desktop;
    if (desktop) {
      this.navigation.setAttribute('role', 'tablist');
      this.navigation.setAttribute('aria-orientation', this.options.orientation);
    } else {
      this.navigation.removeAttribute('role');
      this.navigation.removeAttribute('aria-orientation');
    }
    this.items.forEach(({ trigger, group, panel }, index) => {
      const open = this.openIndices.has(index);
      trigger.setAttribute('type', 'button');
      trigger.removeAttribute('aria-haspopup');
      trigger.removeAttribute('aria-disabled');
      group.classList.toggle(this.expandedClass, open);
      if (desktop) {
        if (trigger.parentNode !== this.navigation) this.navigation.append(trigger);
        group.setAttribute('role', 'tabpanel');
        group.setAttribute('aria-labelledby', trigger.id);
        group.setAttribute('tabindex', '0');
        group.hidden = !open;
        panel.hidden = false;
        panel.removeAttribute('role');
        panel.removeAttribute('aria-labelledby');
        trigger.setAttribute('role', 'tab');
        trigger.setAttribute('aria-controls', group.id);
        trigger.removeAttribute('aria-expanded');
      } else {
        if (trigger.parentNode !== group) group.prepend(trigger);
        group.removeAttribute('role');
        group.removeAttribute('aria-labelledby');
        group.removeAttribute('tabindex');
        group.hidden = false;
        panel.hidden = !open;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', trigger.id);
        trigger.removeAttribute('role');
        trigger.removeAttribute('aria-selected');
        trigger.removeAttribute('tabindex');
        trigger.setAttribute('aria-controls', panel.id);
        if (open && !this.options.accordion.collapsible && this.openIndices.size === 1) {
          trigger.setAttribute('aria-disabled', 'true');
        }
      }
      if (open) this.expandTrigger(trigger);
      else this.collapseTrigger(trigger);
      if (desktop) trigger.setAttribute('tabindex', index === this.focusIndex ? '0' : '-1');
    });
  }

  /**
   * Selects a tab or toggles an accordion item within configured constraints,
   * then renders and notifies consumers when the open state changes.
   *
   * @param {MouseEvent|KeyboardEvent} event - Activation event whose currentTarget is a trigger.
   * @return {void}
   */
  onTriggerClick(event) {
    const index = Array.from(this.triggers).indexOf(event.currentTarget);
    if (this.state === 'desktop') {
      if (index === this.activeIndex) {
        this.focusIndex = index;
        this._render();
        return;
      }
      this.activeIndex = index;
      this.focusIndex = index;
      this.openIndices = new Set([index]);
    } else if (this.openIndices.has(index)) {
      if (!this.options.accordion.collapsible && this.openIndices.size === 1) return;
      this.openIndices.delete(index);
      if (index === this.activeIndex && this.openIndices.size) {
        this.activeIndex = this.openIndices.values().next().value;
      }
    } else {
      if (this.options.accordion.singleOpen) this.openIndices.clear();
      this.openIndices.add(index);
      this.activeIndex = index;
    }
    this._render();
    this._notify('interaction');
  }

  /**
   * Activates with Enter/Space or moves tab focus with orientation-specific
   * arrows and Home/End. Focus navigation leaves selection unchanged and only
   * handled keys prevent the browser's default action.
   *
   * @param {KeyboardEvent} event - Key event from a trigger.
   * @return {void}
   */
  onTriggerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTriggerClick(event);
      return;
    }
    if (this.state !== 'desktop') return;
    const index = Array.from(this.triggers).indexOf(event.currentTarget);
    const previous = this.options.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const next = this.options.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    let target;
    if (event.key === previous) target = (index + this.triggers.length - 1) % this.triggers.length;
    else if (event.key === next) target = (index + 1) % this.triggers.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = this.triggers.length - 1;
    else return;
    event.preventDefault();
    this.focusIndex = target;
    this.triggers.forEach((trigger, triggerIndex) => {
      trigger.setAttribute('tabindex', triggerIndex === target ? '0' : '-1');
    });
    this.triggers[target].focus();
  }

  /**
   * Returns a fresh public snapshot. Panel references are the controlled content
   * for the current mode; consumers need not inspect generated markup.
   *
   * @return {TabContentState} Independent state arrays and records with live DOM references.
   */
  getState() {
    return {
      mode: this.state === null ? null : this.state === 'desktop' ? 'tabs' : 'accordion',
      activeIndex: this.openIndices.size ? this.activeIndex : null,
      openIndices: Array.from(this.openIndices).sort((a, b) => a - b),
      items: this.items.map(({ trigger, group, panel }, index) => ({
        index,
        id: group.id,
        trigger,
        panel: this.state === 'mobile' ? panel : group,
        open: this.openIndices.has(index),
      })),
    };
  }

  /**
   * Invokes the optional consumer callback after DOM and state updates.
   * Callback errors propagate; teardown is complete before destroy notifications.
   *
   * @private
   * @param {'init'|'interaction'|'breakpoint'|'destroy'} reason - Cause of the notification.
   * @param {TabContentState} [snapshot=this.getState()] - State to deliver; destroy
   *   supplies a final snapshot before clearing its item references.
   * @return {void}
   */
  _notify(reason, snapshot = this.getState()) {
    if (this.options.onChange) this.options.onChange({ ...snapshot, reason });
  }

  /**
   * Checks whether an element has the configured expanded class.
   *
   * @param {Element} target - Element to inspect.
   * @return {boolean} Whether the expanded class is present.
   */
  containsExpandedClass(target) {
    return target.classList.contains(this.expandedClass);
  }

  /**
   * Finds the element identified by a trigger's aria-controls within this root
   * without treating the ID as a CSS selector.
   *
   * @param {Element} target - Trigger carrying the aria-controls attribute.
   * @return {Element|null} Controlled element, or null when no matching ID exists.
   */
  getControlledByID(target) {
    const id = target.getAttribute('aria-controls');
    return Array.from(this.element.querySelectorAll('[id]')).find((element) => element.id === id) ?? null;
  }
}
