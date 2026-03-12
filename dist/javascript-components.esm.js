function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * @file
 * Components - Accordion
 * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/accordion
 */

var Accordion = /*#__PURE__*/function () {
  function Accordion(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Accordion);
    /**
     * Toggles the expanded or collapsed state of a component.
     *
     * This function checks the current state of the component using the `isExpanded` method.
     * If the component is expanded, it will invoke the `collapse` method to collapse the component.
     * Otherwise, it will invoke the `expand` method to expand the component.
     *
     * Designed to be used as an event handler for a click event to trigger UI state changes.
     */
    _defineProperty(this, "onClickTrigger", function () {
      if (_this.isExpanded()) {
        _this.collapse();
      } else {
        _this.expand();
      }
    });
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
    _defineProperty(this, "onKeydownTrigger", function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        // Check to see if class exists first.
        if (_this.isExpanded()) {
          _this.collapse();
        } else {
          _this.expand();
        }
      }
    });
    // Default options
    var defaultOptions = {
      selectors: {
        trigger: '.accordion__trigger[aria-controls]'
      },
      classes: {
        expanded: 'is-expanded'
      }
    };

    // Merge default options with user-provided options
    this.options = _objectSpread2(_objectSpread2({}, defaultOptions), options);
    this.expandedClass = this.options.classes.expanded;
    this.element = element;
    this.trigger = this.element.querySelector(this.options.selectors.trigger);
    this.panel = this.element.querySelector("#".concat(Accordion.getControlledByID(this.trigger)));
  }

  /**
   * Initializes the accordion component by setting up DOM element references
   * and attaching necessary event listeners for interaction.
   *
   * @return {void} Does not return any value.
   */
  return _createClass(Accordion, [{
    key: "init",
    value: function init() {
      this.trigger.addEventListener('click', this.onClickTrigger);
      this.trigger.addEventListener('keydown', this.onKeydownTrigger);
    }
  }, {
    key: "expand",
    value:
    /**
     * Expands the accordion by adding the expanded class to the relevant elements
     * and updating the aria-expanded attribute to indicate an expanded state.
     *
     * @return {void} Does not return a value.
     */
    function expand() {
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
  }, {
    key: "collapse",
    value: function collapse() {
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
  }, {
    key: "isExpanded",
    value: function isExpanded() {
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
  }], [{
    key: "getControlledByID",
    value: function getControlledByID(target) {
      return target.getAttribute('aria-controls');
    }
  }]);
}();

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
var Menu = /*#__PURE__*/function () {
  function Menu(element) {
    var _options$selectors, _options$classes;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Menu);
    // Default options
    var defaultOptions = {
      selectors: {
        trigger: '.menu__dropdown-trigger',
        items: '.menu__items',
        item: '.menu__item',
        link: '.menu__link',
        dropdown: '.menu__dropdown'
      },
      classes: {
        expanded: 'is-expanded'
      },
      breakpoint: 768
    };
    this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultOptions), options), {}, {
      selectors: _objectSpread2(_objectSpread2({}, defaultOptions.selectors), (_options$selectors = options.selectors) !== null && _options$selectors !== void 0 ? _options$selectors : {}),
      classes: _objectSpread2(_objectSpread2({}, defaultOptions.classes), (_options$classes = options.classes) !== null && _options$classes !== void 0 ? _options$classes : {})
    });
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
    this._onButtonClick = this.onButtonClick.bind(this);
    this._onItemKeydown = this.onItemKeydown.bind(this);
    this._onClickWindow = this.onClickWindow.bind(this);
    this._onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  /**
   * Attaches event listeners to specific elements for handling user interactions
   * and initializes a ResizeObserver to monitor changes in document size.
   *
   * @return {void} This method does not return any value.
   */
  return _createClass(Menu, [{
    key: "mount",
    value: function mount() {
      var _this = this;
      this.triggers.forEach(function (trigger) {
        return trigger.addEventListener('click', _this._onButtonClick);
      });
      this.items.forEach(function (item) {
        return item.addEventListener('keydown', _this._onItemKeydown);
      });
      this.window.addEventListener('click', this._onClickWindow);
      this.mediaQuery = window.matchMedia("(min-width: ".concat(this.options.breakpoint, "px)"));
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
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;
      this.triggers.forEach(function (trigger) {
        return trigger.removeEventListener('click', _this2._onButtonClick);
      });
      this.items.forEach(function (item) {
        return item.removeEventListener('keydown', _this2._onItemKeydown);
      });
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
  }, {
    key: "onMediaQueryChange",
    value: function onMediaQueryChange() {
      this.state = this.mediaQuery.matches ? 'desktop' : 'mobile';
    }

    /**
     * Handles the click event for a button, expanding or collapsing a submenu based on its
     * current state.
     *
     * @param {Event} event - The event object associated with the button click.
     * @return {void} Does not return a value.
     */
  }, {
    key: "onButtonClick",
    value: function onButtonClick(event) {
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
  }, {
    key: "onClickWindow",
    value: function onClickWindow(event) {
      if (!this.element.contains(event.target)) {
        this.closeAll();
      }
    }

    /**
     * Closes all expandable items by setting their 'aria-expanded' attribute to 'false'.
     *
     * @return {void} Does not return a value.
     */
  }, {
    key: "closeAll",
    value: function closeAll() {
      var _this3 = this;
      this.triggers.forEach(function (trigger) {
        if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
        if (trigger.classList.contains(_this3.expandedClass)) trigger.classList.remove(_this3.expandedClass);
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
  }, {
    key: "onItemKeydown",
    value: function onItemKeydown(event) {
      var _this4 = this,
        _this$items$0$querySe,
        _this$items$querySele;
      var preventDefault = false;
      var current = event.target;
      switch (event.key) {
        case 'Enter':
        case ' ':
          if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
            preventDefault = true;
            this.expandSubMenu(current);
            setTimeout(function () {
              _this4.getSubMenuLinks(current)[0].focus();
            }, 100);
          }
          break;
        case 'Up':
        case 'ArrowUp':
          preventDefault = true;
          if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
            var subMenuLinks = this.getSubMenuLinks(current);
            this.expandSubMenu(current);
            setTimeout(function () {
              subMenuLinks[subMenuLinks.length - 1].focus();
            }, 100);
          } else {
            var previousSibling = this.getPreviousSibling(current);
            previousSibling.focus();
          }
          break;
        case 'Down':
        case 'ArrowDown':
          preventDefault = true;
          if (!Menu.isExpanded(current) && this.getSubMenuLinks(current).length > 0) {
            var _subMenuLinks = this.getSubMenuLinks(current);
            this.expandSubMenu(current);
            setTimeout(function () {
              _subMenuLinks[0].focus();
            }, 100);
          } else {
            var nextSibling = this.getNextSibling(current);
            nextSibling.focus();
          }
          break;
        case 'ArrowRight':
          preventDefault = true;
          if (this.getParentMenuItems(current).length > 0) {
            var _parentSiblings;
            var parentItem = this.getSubMenuTrigger(current);
            var parentSiblings = this.getSiblings(parentItem);
            var currentIndex = Array.from(parentSiblings).indexOf(parentItem);
            (_parentSiblings = parentSiblings[currentIndex + 1]) === null || _parentSiblings === void 0 || _parentSiblings.focus();
            this.collapseSubMenu(parentItem);
          } else {
            var _this$getNextSibling;
            (_this$getNextSibling = this.getNextSibling(current)) === null || _this$getNextSibling === void 0 || _this$getNextSibling.focus();
          }
          break;
        case 'ArrowLeft':
          preventDefault = true;
          if (this.getParentMenuItems(current).length > 0) {
            var _parentSiblings3;
            var _parentItem = this.getSubMenuTrigger(current);
            var _parentSiblings2 = this.getSiblings(_parentItem);
            var _currentIndex = Array.from(_parentSiblings2).indexOf(_parentItem);
            (_parentSiblings3 = _parentSiblings2[_currentIndex - 1]) === null || _parentSiblings3 === void 0 || _parentSiblings3.focus();
            this.collapseSubMenu(_parentItem);
          } else {
            var _this$getPreviousSibl;
            (_this$getPreviousSibl = this.getPreviousSibling(current)) === null || _this$getPreviousSibl === void 0 || _this$getPreviousSibl.focus();
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
          (_this$items$0$querySe = this.items[0].querySelector('a, button')) === null || _this$items$0$querySe === void 0 || _this$items$0$querySe.focus();
          break;
        case 'End':
          preventDefault = true;
          this.closeAll();
          (_this$items$querySele = this.items[this.items.length - 1].querySelector('a, button')) === null || _this$items$querySele === void 0 || _this$items$querySele.focus();
          break;
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
  }, {
    key: "expandSubMenu",
    value: function expandSubMenu(target) {
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
  }, {
    key: "collapseSubMenu",
    value: function collapseSubMenu(target) {
      target.setAttribute('aria-expanded', 'false');
      target.classList.remove(this.expandedClass);
    }

    /**
     * Retrieves the next sibling element of the given target element within a group of siblings.
     *
     * @param {Element} target - The target element whose next sibling is to be found.
     * @return {Element|null} The next sibling element, or null if no siblings are found.
     */
  }, {
    key: "getNextSibling",
    value: function getNextSibling(target) {
      var siblings = this.getSiblings(target);
      if (!siblings.length) return null;
      var currentIndex = Array.from(siblings).indexOf(target);
      var nextIndex = (currentIndex + 1) % siblings.length;
      return siblings[nextIndex];
    }

    /**
     * Retrieves the previous sibling of the given target element from a list of siblings.
     *
     * @param {Element} target - The target element for which the previous sibling is to be retrieved.
     * @return {Element|null} The previous sibling element, or null if there are no siblings.
     */
  }, {
    key: "getPreviousSibling",
    value: function getPreviousSibling(target) {
      var siblings = this.getSiblings(target);
      if (!siblings.length) return null;
      var currentIndex = Array.from(siblings).indexOf(target);
      var previousIndex = currentIndex === 0 ? siblings.length - 1 : currentIndex - 1;
      return siblings[previousIndex];
    }

    /**
     * Retrieves the sibling elements of the provided target within a specific menu structure.
     *
     * @param {Element} target - The target element whose siblings are to be retrieved.
     * @return {NodeList} A collection of sibling elements matching the specified selectors, or an
     * empty NodeList if no siblings are found.
     */
  }, {
    key: "getSiblings",
    value: function getSiblings(target) {
      return target.closest(this.itemsSelector).querySelectorAll("\n      :scope > ".concat(this.itemSelector, " > a,\n      :scope > ").concat(this.itemSelector, " > button\n    "));
    }

    /**
     * Retrieves the parent menu items associated with a given target element.
     *
     * @param {Element} target - The DOM element for which the parent menu items will be fetched.
     * @return {NodeList} A list of parent menu items, including `<a>`, `<button>`, and `<span>`
     * elements, or an empty NodeList if no parent menu exists.
     */
  }, {
    key: "getParentMenuItems",
    value: function getParentMenuItems(target) {
      var menuBelow = target.closest(this.dropdownSelector);
      if (!menuBelow) return [];
      var parentMenu = menuBelow.closest(this.itemsSelector);
      if (!parentMenu) return [];
      return parentMenu.querySelectorAll("\n      :scope > ".concat(this.itemSelector, " > a,\n      :scope > ").concat(this.itemSelector, " > button\n    "));
    }

    /**
     * Retrieves the submenu links for a specified target element.
     *
     * @param {Element} target - The DOM element whose submenu links are to be retrieved.
     * @return {NodeList|Array} A NodeList containing the submenu link elements.
     * If the submenu does not exist, an empty array is returned.
     */
  }, {
    key: "getSubMenuLinks",
    value: function getSubMenuLinks(target) {
      var subMenu = target.nextElementSibling;
      if (!subMenu) return [];
      return subMenu.querySelectorAll("\n      :scope > ".concat(this.itemsSelector, " > ").concat(this.itemSelector, " > a,\n      :scope > ").concat(this.itemsSelector, " > ").concat(this.itemSelector, " > button\n    "));
    }

    /**
     * Retrieves the trigger element of a sub-menu based on the provided target element.
     *
     * @param {Element} target - The target DOM element to find the sub-menu trigger for.
     * @return {Element|null} The trigger element of the sub-menu if it exists, or null if not found.
     */
  }, {
    key: "getSubMenuTrigger",
    value: function getSubMenuTrigger(target) {
      var menuBelow = target.closest(this.dropdownSelector);
      return menuBelow ? menuBelow.previousElementSibling : null;
    }

    /**
     * Determines if a given element is expanded based on its `aria-expanded` attribute.
     *
     * @param {Element} element - The DOM element to check for the `aria-expanded` attribute.
     * @return {boolean} Returns true if the `aria-expanded` attribute is set to 'true',
     * otherwise false.
     */
  }], [{
    key: "isExpanded",
    value: function isExpanded(element) {
      return element.getAttribute('aria-expanded') === 'true';
    }
  }]);
}();

/**
 * @file
 * Components - Tab Content
 * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/tabs
 */

var TabContent = /*#__PURE__*/function () {
  function TabContent(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, TabContent);
    // Default options
    var defaultOptions = {
      selectors: {
        navigation: '.tab-content__navigation',
        group: '.tab-content__group',
        trigger: '.tab-content__trigger'
      },
      classes: {
        expanded: 'is-expanded'
      },
      breakpoint: 768
    };

    // Merge default options with user-provided options
    this.options = _objectSpread2(_objectSpread2({}, defaultOptions), options);
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
  return _createClass(TabContent, [{
    key: "init",
    value: function init() {
      var _this = this;
      this.triggers.forEach(function (trigger) {
        trigger.addEventListener('click', _this.onTriggerClick.bind(_this));
        trigger.addEventListener('keydown', _this.onTriggerKeydown.bind(_this));
      });

      // Device or viewport change listener and on load.
      this.mediaQuery = window.matchMedia("(min-width: ".concat(this.options.breakpoint, "px)"));
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
  }, {
    key: "onMediaQueryChange",
    value: function onMediaQueryChange() {
      var _this2 = this;
      if (this.mediaQuery.matches) {
        this.state = 'desktop';
        this.triggers.forEach(function (trigger, index) {
          _this2.navigation.append(trigger);
          if (index !== 0) {
            _this2.collapseTrigger(trigger);
            _this2.groups[index].classList.remove(_this2.expandedClass);
          } else {
            _this2.expandTrigger(trigger);
            _this2.groups[0].classList.add(_this2.expandedClass);
          }
        });
      } else {
        this.state = 'mobile';
        this.triggers.forEach(function (trigger, index) {
          _this2.groups[index].prepend(trigger);
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
  }, {
    key: "collapseTrigger",
    value: function collapseTrigger(element) {
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
  }, {
    key: "expandTrigger",
    value: function expandTrigger(element) {
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
  }, {
    key: "onTriggerClick",
    value: function onTriggerClick(event) {
      var _this3 = this;
      var controlledGroup = this.getControlledByID(event.currentTarget);
      if (this.state === 'desktop') {
        if (!this.containsExpandedClass(event.currentTarget) && !this.containsExpandedClass(controlledGroup)) {
          this.triggers.forEach(function (trigger) {
            _this3.collapseTrigger(trigger);
          });
          this.groups.forEach(function (group) {
            group.classList.remove(_this3.expandedClass);
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
  }, {
    key: "onTriggerKeydown",
    value: function onTriggerKeydown(event) {
      var _this4 = this;
      var controlledGroup = this.getControlledByID(event.currentTarget);
      if (this.state === 'desktop') {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!this.containsExpandedClass(event.currentTarget) && !this.containsExpandedClass(controlledGroup)) {
            this.triggers.forEach(function (trigger) {
              _this4.collapseTrigger(trigger);
            });
            this.groups.forEach(function (element) {
              element.classList.remove(_this4.expandedClass);
            });
            this.expandTrigger(event.currentTarget);
            controlledGroup.classList.add(this.expandedClass);
          }
        }
        if (event.key === 'ArrowLeft') {
          if (event.currentTarget === this.triggers[0]) {
            setTimeout(function () {
              _this4.triggers[_this4.triggers.length - 1].focus();
            }, 1);
          } else {
            setTimeout(function () {
              event.target.previousElementSibling.focus();
            }, 1);
          }
        }
        if (event.key === 'ArrowRight') {
          if (event.currentTarget === this.triggers[this.triggers.length - 1]) {
            setTimeout(function () {
              _this4.triggers[0].focus();
            });
          } else {
            setTimeout(function () {
              event.target.nextElementSibling.focus();
            }, 1);
          }
        }
        if (event.key === 'Home') {
          setTimeout(function () {
            _this4.triggers[0].focus();
          }, 1);
        }
        if (event.key === 'End') {
          setTimeout(function () {
            _this4.triggers[_this4.triggers.length - 1].focus();
          });
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
  }, {
    key: "containsExpandedClass",
    value: function containsExpandedClass(target) {
      return target.classList.contains(this.expandedClass);
    }

    /**
     * Retrieves the element controlled by the specified trigger element's ID.
     *
     * @param {HTMLElement} target - The trigger element.
     * @return {HTMLElement} The element controlled by the trigger.
     */
  }, {
    key: "getControlledByID",
    value: function getControlledByID(target) {
      var controlID = target.getAttribute('aria-controls');
      return this.element.querySelector("#".concat(controlID));
    }
  }]);
}();

/**
 * @file
 * Components - Sticky
 * Functionality for a sticky element that remains visible within its parent container as the user scrolls the page.
 */

var Sticky = /*#__PURE__*/function () {
  function Sticky(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Sticky);
    /**
     * Handle the scroll event by queuing an update on the next animation frame.
     * This throttles the update calls to once per frame for performance.
     * 
     * @returns {void}
     */
    _defineProperty(this, "onScroll", function () {
      // Only queue an update if one isn't already waiting for the next frame.
      if (!_this.flag) {
        window.requestAnimationFrame(function () {
          return _this.update();
        });
        _this.flag = true; // Block any further queues until the frame runs.
      }
    });
    // Default options
    var defaultOptions = {
      topSpacing: 40,
      classes: {
        stuck: 'is-stuck',
        bottom: 'is-bottom'
      }
    };

    // Merge default options with user-provided options
    this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultOptions), options), {}, {
      classes: _objectSpread2(_objectSpread2({}, defaultOptions.classes), options.classes || {})
    });
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
   * @returns {void}
   */
  return _createClass(Sticky, [{
    key: "mount",
    value: function mount() {
      var _this2 = this;
      if (!this.parent) return;

      // Ensure the container is positioned so `position: absolute` works.
      var parentPosition = getComputedStyle(this.parent).position;
      if (parentPosition === 'static') {
        this.parent.style.position = 'relative';
      }

      // Cache layout values *before* any sticky class is applied so that
      // toggling position doesn't feed back into the measurements.
      this.elHeight = this.element.offsetHeight;
      this.elOffsetTop = this.element.offsetTop;

      // Prevent the parent from collapsing when the child becomes absolute.
      this.parent.style.minHeight = "".concat(this.parent.offsetHeight, "px");

      // Cache the parent's document-relative top once and refresh on resize.
      this._cacheParentTop();
      this._resizeObserver = new ResizeObserver(function () {
        return _this2._cacheParentTop();
      });
      this._resizeObserver.observe(this.parent);
      this._resizeObserver.observe(document.documentElement);
      window.addEventListener('scroll', this.onScroll, {
        passive: true
      });

      // Run once on attach so the correct class is applied immediately.
      this.update();
    }

    /**
     * Unmount the sticky element by removing event listeners and disconnecting any observers to clean up resources.
     * 
     * @returns {void}
     */
  }, {
    key: "destroy",
    value: function destroy() {
      var _this$_resizeObserver;
      window.removeEventListener('scroll', this.onScroll);
      (_this$_resizeObserver = this._resizeObserver) === null || _this$_resizeObserver === void 0 || _this$_resizeObserver.disconnect();
    }

    /**
     * Apply a visual state to the sticky element by adding/removing CSS classes and setting the `top` style.
     * 
     * @param {'default'|'stuck'|'bottom'} state - The state to apply to the element.
     * @param {number} [top] - The top offset in pixels to apply when the state is 'stuck'.
     * @returns {void}
     */
  }, {
    key: "applyState",
    value: function applyState(state, top) {
      // 'stuck' is never short-circuited because the `top` offset changes on
      // every scroll tick even when the state label stays the same.
      if (state === this.currentState && state !== 'stuck') return;
      this.currentState = state;
      if (state === 'stuck') {
        this.element.classList.add(this.stuckClass);
        this.element.classList.remove(this.bottomClass);
        this.element.style.top = "".concat(top, "px");
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
     * @returns {void}
     */
  }, {
    key: "update",
    value: function update() {
      var parentTop = this._cacheParentTop();

      // The scroll-Y at which the element should start sticking.
      var startStick = parentTop + this.elOffsetTop - this.options.topSpacing;
      // The scroll-Y at which the element should anchor to the bottom.
      var endStick = parentTop + this.parent.offsetHeight - this.elHeight - this.options.topSpacing;
      var scrollY = window.scrollY;
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
        var top = scrollY - parentTop + this.options.topSpacing;
        this.applyState('stuck', top);
      }

      // Mark the frame as finished so the next scroll event can queue another.
      this.flag = false;
    }
  }, {
    key: "_cacheParentTop",
    value:
    /**
     * Calculate and cache the top offset of the parent element relative to the document.
     * 
     * @returns {number} The top offset of the parent element in pixels.
     */
    function _cacheParentTop() {
      return this.parent.getBoundingClientRect().top + window.scrollY;
    }
  }]);
}();

export { Accordion, Menu, Sticky, TabContent };
//# sourceMappingURL=javascript-components.esm.js.map
