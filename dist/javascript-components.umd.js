(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JavaScriptComponents = {}));
})(this, (function (exports) { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
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
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = true,
        o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = true, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
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
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /**
   * @file
   * Components - Accordion
   * Functionality for an Accordion or group of Accordions using accessible methods as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/accordion
   */

  /**
   * Represents an Accordion component with event handling and state management
   * for expand/collapse interactions. One instance manages a single accordion element.
   */
  var Accordion = /*#__PURE__*/function () {
    function Accordion(element) {
      var _options$selectors, _options$classes;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Accordion);
      // Default options
      var defaultOptions = {
        selectors: {
          trigger: '.accordion__trigger[aria-controls]'
        },
        classes: {
          expanded: 'is-expanded'
        }
      };

      // Deep merge for nested options
      this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultOptions), options), {}, {
        selectors: _objectSpread2(_objectSpread2({}, defaultOptions.selectors), (_options$selectors = options.selectors) !== null && _options$selectors !== void 0 ? _options$selectors : {}),
        classes: _objectSpread2(_objectSpread2({}, defaultOptions.classes), (_options$classes = options.classes) !== null && _options$classes !== void 0 ? _options$classes : {})
      });
      this.element = element;
      this.expandedClass = this.options.classes.expanded;
      this.trigger = this.element.querySelector(this.options.selectors.trigger);
      this.panel = this.trigger ? this.element.querySelector("#".concat(Accordion.getControlledByID(this.trigger))) : null;

      // Store bound handler references for cleanup
      this._onClickTrigger = this.onClickTrigger.bind(this);
      this._onKeydownTrigger = this.onKeydownTrigger.bind(this);
    }

    // LIFECYCLE

    /**
     * Initializes the accordion component by attaching the necessary event listeners
     * for click and keyboard interactions. Exits early if no trigger element is found.
     *
     * @return {void} Does not return any value.
     */
    return _createClass(Accordion, [{
      key: "init",
      value: function init() {
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
    }, {
      key: "destroy",
      value: function destroy() {
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
    }, {
      key: "expand",
      value: function expand() {
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
    }, {
      key: "collapse",
      value: function collapse() {
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
    }, {
      key: "onClickTrigger",
      value: function onClickTrigger() {
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
    }, {
      key: "onKeydownTrigger",
      value: function onKeydownTrigger(event) {
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
    }, {
      key: "isExpanded",
      value: function isExpanded() {
        return this.trigger.classList.contains(this.expandedClass);
      }

      /**
       * Returns the value of the `aria-controls` attribute on the given element,
       * which corresponds to the ID of the panel it controls.
       *
       * @param {Element} target - The DOM element from which to read `aria-controls`.
       * @return {string|null} The controlled element's ID, or `null` if the attribute is absent.
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
              ((_parentSiblings = parentSiblings[currentIndex + 1]) !== null && _parentSiblings !== void 0 ? _parentSiblings : parentItem).focus();
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
              ((_parentSiblings3 = _parentSiblings2[_currentIndex - 1]) !== null && _parentSiblings3 !== void 0 ? _parentSiblings3 : _parentItem).focus();
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
   * Components - Modal
   */

  /**
   * Represents a Modal component with event handling and state management
   * for dialog interactions. This class is responsible for opening and closing
   * a modal dialog, trapping focus within it while open, and restoring focus
   * to the triggering element on close. The modal element is relocated to the
   * bottom of the document body on mount to simplify fixed positioning.
   */
  var Modal = /*#__PURE__*/function () {
    function Modal(element) {
      var _options$selectors, _options$classes;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Modal);
      var defaultOptions = {
        selectors: {
          trigger: "[aria-controls=\"".concat(element.id, "\"]"),
          closeButton: '.modal__close',
          overlay: '.modal__overlay'
        },
        classes: {
          expanded: 'is-expanded'
        }
      };

      // Deep merge for nested options
      this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultOptions), options), {}, {
        selectors: _objectSpread2(_objectSpread2({}, defaultOptions.selectors), (_options$selectors = options.selectors) !== null && _options$selectors !== void 0 ? _options$selectors : {}),
        classes: _objectSpread2(_objectSpread2({}, defaultOptions.classes), (_options$classes = options.classes) !== null && _options$classes !== void 0 ? _options$classes : {})
      });
      this.element = element;
      this.expandedClass = this.options.classes.expanded;
      this.overlay = null;
      this.closeButtons = [];
      this.triggers = [];
      this._previousFocus = null;
      this._previousOverflow = null;

      // Store bound handler references for cleanup
      this._onTriggerClick = this.onTriggerClick.bind(this);
      this._onCloseClick = this.onCloseClick.bind(this);
      this._onOverlayClick = this.onOverlayClick.bind(this);
      this._onKeydown = this.onKeydown.bind(this);
    }

    // LIFECYCLE

    /**
     * Moves the modal element to the bottom of <body>, caches internal elements,
     * queries document-global triggers by `aria-controls`, and attaches all event
     * listeners required for open/close and keyboard interactions.
     *
     * @return {void} This method does not return any value.
     */
    return _createClass(Modal, [{
      key: "mount",
      value: function mount() {
        var _this = this;
        // Move the modal element to the bottom of <body> for fixed-position ease
        document.body.appendChild(this.element);

        // Cache internal elements
        this.overlay = this.element.querySelector(this.options.selectors.overlay);
        this.closeButtons = this.element.querySelectorAll(this.options.selectors.closeButton);

        // Triggers can live anywhere in the document
        this.triggers = document.querySelectorAll(this.options.selectors.trigger);

        // Event listeners
        this.triggers.forEach(function (trigger) {
          return trigger.addEventListener('click', _this._onTriggerClick);
        });
        this.closeButtons.forEach(function (btn) {
          return btn.addEventListener('click', _this._onCloseClick);
        });
        if (this.overlay) {
          this.overlay.addEventListener('click', this._onOverlayClick);
        }
      }

      /**
       * Removes all event listeners attached by `mount()`, cleaning up the instance
       * so it can be safely discarded or re-mounted.
       *
       * @return {void} This method does not return any value.
       */
    }, {
      key: "destroy",
      value: function destroy() {
        var _this2 = this;
        if (this.triggers) {
          this.triggers.forEach(function (trigger) {
            return trigger.removeEventListener('click', _this2._onTriggerClick);
          });
        }
        if (this.closeButtons) {
          this.closeButtons.forEach(function (btn) {
            return btn.removeEventListener('click', _this2._onCloseClick);
          });
        }
        if (this.overlay) {
          this.overlay.removeEventListener('click', this._onOverlayClick);
        }
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
    }, {
      key: "open",
      value: function open(trigger) {
        this._previousFocus = trigger !== null && trigger !== void 0 ? trigger : document.activeElement;
        this.element.classList.add(this.expandedClass);
        this.element.setAttribute('aria-hidden', 'false');
        this.triggers.forEach(function (t) {
          return t.setAttribute('aria-expanded', 'true');
        });
        this._previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this._onKeydown);

        // Focus the first focusable element inside the modal, or the modal itself
        var focusable = this.getFocusableElements();
        if (focusable.length) {
          focusable[0].focus();
        } else {
          // Ensure the modal container is focusable so focus can be moved inside
          if (!this.element.hasAttribute('tabindex')) {
            this.element.setAttribute('tabindex', '-1');
          }
          this.element.focus();
        }
      }

      /**
       * Closes the modal dialog by removing the expanded class and updating ARIA
       * attributes. Restores body scroll and returns focus to the element that
       * originally opened the modal.
       *
       * @return {void} This method does not return any value.
       */
    }, {
      key: "close",
      value: function close() {
        var _this$_previousOverfl;
        this.element.classList.remove(this.expandedClass);
        this.element.setAttribute('aria-hidden', 'true');
        this.triggers.forEach(function (t) {
          return t.setAttribute('aria-expanded', 'false');
        });
        document.body.style.overflow = (_this$_previousOverfl = this._previousOverflow) !== null && _this$_previousOverfl !== void 0 ? _this$_previousOverfl : '';
        this._previousOverflow = null;
        document.removeEventListener('keydown', this._onKeydown);

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
    }, {
      key: "onTriggerClick",
      value: function onTriggerClick(event) {
        event.preventDefault();
        this.open(event.currentTarget);
      }

      /**
       * Handles click events on close button elements and closes the modal.
       *
       * @return {void} This method does not return any value.
       */
    }, {
      key: "onCloseClick",
      value: function onCloseClick() {
        this.close();
      }

      /**
       * Handles click events on the overlay element. Closes the modal only when the
       * click target is the overlay itself, ignoring clicks on the dialog content within it.
       *
       * @param {MouseEvent} event - The click event fired on the overlay.
       * @return {void} This method does not return any value.
       */
    }, {
      key: "onOverlayClick",
      value: function onOverlayClick(event) {
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
    }, {
      key: "onKeydown",
      value: function onKeydown(event) {
        if (!this.isOpen()) return;
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          this.close();
          return;
        }

        // Focus trap: keep Tab / Shift+Tab cycling within the modal
        if (event.key === 'Tab') {
          var focusable = this.getFocusableElements();
          if (!focusable.length) {
            event.preventDefault();
            return;
          }
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
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
    }, {
      key: "isOpen",
      value: function isOpen() {
        return this.element.classList.contains(this.expandedClass);
      }

      /**
       * Returns an array of all keyboard-focusable elements within the modal element,
       * excluding those with `tabindex="-1"` or the `disabled` attribute.
       *
       * @return {HTMLElement[]} An array of focusable descendant elements.
       */
    }, {
      key: "getFocusableElements",
      value: function getFocusableElements() {
        return Array.from(this.element.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      }
    }]);
  }();

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
  var TabContent = /*#__PURE__*/function () {
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
    function TabContent(element) {
      var _options$selectors, _options$classes, _options$accordion, _this$navigation;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, TabContent);
      var defaultOptions = {
        selectors: {
          navigation: '.tab-content__navigation',
          group: '.tab-content__group',
          trigger: '.tab-content__trigger',
          content: '.tab-content__content'
        },
        classes: {
          expanded: 'is-expanded'
        },
        breakpoint: 768,
        orientation: 'horizontal',
        accordion: {
          singleOpen: false,
          collapsible: true
        },
        onChange: null
      };
      this.options = _objectSpread2(_objectSpread2(_objectSpread2({}, defaultOptions), options), {}, {
        selectors: _objectSpread2(_objectSpread2({}, defaultOptions.selectors), (_options$selectors = options.selectors) !== null && _options$selectors !== void 0 ? _options$selectors : {}),
        classes: _objectSpread2(_objectSpread2({}, defaultOptions.classes), (_options$classes = options.classes) !== null && _options$classes !== void 0 ? _options$classes : {}),
        accordion: _objectSpread2(_objectSpread2({}, defaultOptions.accordion), (_options$accordion = options.accordion) !== null && _options$accordion !== void 0 ? _options$accordion : {})
      });
      this.element = element;
      this.expandedClass = this.options.classes.expanded;
      this.navigation = element.querySelector(this.options.selectors.navigation);
      if (options.orientation === undefined && (_this$navigation = this.navigation) !== null && _this$navigation !== void 0 && _this$navigation.hasAttribute('aria-orientation')) {
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
    return _createClass(TabContent, [{
      key: "init",
      value: function init() {
        var _this = this;
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
        if (typeof this.options.accordion.singleOpen !== 'boolean' || typeof this.options.accordion.collapsible !== 'boolean') {
          throw new TypeError('TabContent: accordion options must be booleans.');
        }
        if (!this.triggers.length) return;
        if (!this.navigation) throw new Error('TabContent: a navigation container is required.');
        var groups = Array.from(this.groups);
        var controlledGroups = Array.from(this.triggers, function (trigger) {
          return _this.getControlledByID(trigger);
        });
        if (controlledGroups.some(function (group) {
          return !groups.includes(group);
        }) || new Set(controlledGroups).size !== groups.length || controlledGroups.length !== groups.length || new Set(Array.from(this.triggers, function (trigger) {
          return trigger.id;
        })).size !== this.triggers.length || Array.from(this.triggers).some(function (trigger) {
          return trigger.tagName !== 'BUTTON' || !trigger.id;
        })) {
          throw new Error('TabContent: each button needs an ID and must control a distinct group.');
        }
        this._remember(this.navigation, ['role', 'aria-orientation', 'hidden']);
        this.items = Array.from(this.triggers, function (trigger, index) {
          var group = controlledGroups[index];
          _this._remember(group, ['role', 'aria-labelledby', 'hidden', 'tabindex']);
          _this._remember(trigger, ['role', 'aria-selected', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-disabled', 'tabindex', 'type']);
          var location = {
            parent: trigger.parentNode,
            next: trigger.nextSibling
          };
          var panel = group.querySelector(_this.options.selectors.content);
          var contentNodes = Array.from(group.childNodes).filter(function (node) {
            return node !== trigger;
          });
          var onlyContent = panel && contentNodes.every(function (node) {
            return node === panel || node.nodeType === 3 && !node.textContent.trim();
          });
          var generated = !onlyContent;
          if (generated) {
            panel = group.ownerDocument.createElement('div');
            contentNodes.forEach(function (node) {
              return panel.append(node);
            });
            group.append(panel);
          }
          _this._remember(panel, ['id', 'role', 'aria-labelledby', 'hidden']);
          if (!panel.id) {
            var id = "".concat(group.id, "-content");
            while (group.ownerDocument.getElementById(id)) id += '-panel';
            panel.id = id;
          }
          return {
            trigger: trigger,
            group: group,
            panel: panel,
            location: location,
            generated: generated
          };
        });
        this.activeIndex = 0;
        this.focusIndex = 0;
        // Desktop has always started on the first tab; mobile keeps authored open state.
        this.openIndices = new Set(this.items.flatMap(function (_ref, index) {
          var trigger = _ref.trigger,
            group = _ref.group;
          return _this.containsExpandedClass(trigger) || _this.containsExpandedClass(group) ? [index] : [];
        }));
        this.mediaQuery = window.matchMedia("(min-width: ".concat(this.options.breakpoint, "px)"));
        this.initialized = true;
        this.triggers.forEach(function (trigger) {
          trigger.addEventListener('click', _this._onTriggerClick);
          trigger.addEventListener('keydown', _this._onTriggerKeydown);
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
    }, {
      key: "destroy",
      value: function destroy() {
        var _this2 = this;
        if (!this.initialized) return;
        this.triggers.forEach(function (trigger) {
          trigger.removeEventListener('click', _this2._onTriggerClick);
          trigger.removeEventListener('keydown', _this2._onTriggerKeydown);
        });
        this.mediaQuery.removeEventListener('change', this._onMediaQueryChange);
        window.removeEventListener('resize', this._onMediaQueryChange);
        var focused = this.element.ownerDocument.activeElement;
        this.items.forEach(function (_ref2) {
          var panel = _ref2.panel,
            generated = _ref2.generated;
          if (generated) panel.replaceWith.apply(panel, _toConsumableArray(panel.childNodes));
        });
        this.items.slice().reverse().forEach(function (_ref3) {
          var trigger = _ref3.trigger,
            location = _ref3.location;
          location.parent.insertBefore(trigger, location.next);
        });
        this._snapshots.forEach(function (_ref4) {
          var element = _ref4.element,
            attributes = _ref4.attributes,
            expanded = _ref4.expanded;
          attributes.forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
              name = _ref6[0],
              value = _ref6[1];
            if (value === null) element.removeAttribute(name);else element.setAttribute(name, value);
          });
          element.classList.toggle(_this2.expandedClass, expanded);
        });
        if (this.element.contains(focused) && focused !== this.element.ownerDocument.activeElement) {
          focused.focus();
        }
        this.initialized = false;
        this.mediaQuery = null;
        this.state = null;
        this.openIndices.clear();
        var snapshot = this.getState();
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
    }, {
      key: "_remember",
      value: function _remember(element, names) {
        this._snapshots.push({
          element: element,
          attributes: names.map(function (name) {
            return [name, element.getAttribute(name)];
          }),
          expanded: this.containsExpandedClass(element)
        });
      }

      /**
       * Applies collapsed styling and mode-specific ARIA/focus state to a trigger.
       * Does not change the open-item model or notify consumers.
       *
       * @param {HTMLButtonElement} element - Trigger to collapse.
       * @return {void}
       */
    }, {
      key: "collapseTrigger",
      value: function collapseTrigger(element) {
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
    }, {
      key: "expandTrigger",
      value: function expandTrigger(element) {
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
    }, {
      key: "onMediaQueryChange",
      value: function onMediaQueryChange() {
        if (!this.initialized) return;
        // Some engines round fractional media queries down, including 768.0001px.
        var desktop = Number.isInteger(this.options.breakpoint) ? this.mediaQuery.matches : window.innerWidth >= this.options.breakpoint;
        var nextState = desktop ? 'desktop' : 'mobile';
        if (nextState === this.state) return;
        var initial = this.state === null;
        var focused = this.element.ownerDocument.activeElement;
        var focusedItem = this.items.findIndex(function (_ref7) {
          var trigger = _ref7.trigger,
            group = _ref7.group;
          return trigger === focused || group.contains(focused);
        });
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
          var _this$items$focusedIt = this.items[focusedItem],
            trigger = _this$items$focusedIt.trigger,
            group = _this$items$focusedIt.group;
          var hidden = group.hidden || this.items[focusedItem].panel.hidden;
          if (hidden || focused === trigger) trigger.focus();else if (focused !== this.element.ownerDocument.activeElement) focused.focus();
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
    }, {
      key: "_render",
      value: function _render() {
        var _this3 = this;
        var desktop = this.state === 'desktop';
        this.navigation.hidden = !desktop;
        if (desktop) {
          this.navigation.setAttribute('role', 'tablist');
          this.navigation.setAttribute('aria-orientation', this.options.orientation);
        } else {
          this.navigation.removeAttribute('role');
          this.navigation.removeAttribute('aria-orientation');
        }
        this.items.forEach(function (_ref8, index) {
          var trigger = _ref8.trigger,
            group = _ref8.group,
            panel = _ref8.panel;
          var open = _this3.openIndices.has(index);
          trigger.setAttribute('type', 'button');
          trigger.removeAttribute('aria-haspopup');
          trigger.removeAttribute('aria-disabled');
          group.classList.toggle(_this3.expandedClass, open);
          if (desktop) {
            if (trigger.parentNode !== _this3.navigation) _this3.navigation.append(trigger);
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
            if (open && !_this3.options.accordion.collapsible && _this3.openIndices.size === 1) {
              trigger.setAttribute('aria-disabled', 'true');
            }
          }
          if (open) _this3.expandTrigger(trigger);else _this3.collapseTrigger(trigger);
          if (desktop) trigger.setAttribute('tabindex', index === _this3.focusIndex ? '0' : '-1');
        });
      }

      /**
       * Selects a tab or toggles an accordion item within configured constraints,
       * then renders and notifies consumers when the open state changes.
       *
       * @param {MouseEvent|KeyboardEvent} event - Activation event whose currentTarget is a trigger.
       * @return {void}
       */
    }, {
      key: "onTriggerClick",
      value: function onTriggerClick(event) {
        var index = Array.from(this.triggers).indexOf(event.currentTarget);
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
    }, {
      key: "onTriggerKeydown",
      value: function onTriggerKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.onTriggerClick(event);
          return;
        }
        if (this.state !== 'desktop') return;
        var index = Array.from(this.triggers).indexOf(event.currentTarget);
        var previous = this.options.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        var next = this.options.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
        var target;
        if (event.key === previous) target = (index + this.triggers.length - 1) % this.triggers.length;else if (event.key === next) target = (index + 1) % this.triggers.length;else if (event.key === 'Home') target = 0;else if (event.key === 'End') target = this.triggers.length - 1;else return;
        event.preventDefault();
        this.focusIndex = target;
        this.triggers.forEach(function (trigger, triggerIndex) {
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
    }, {
      key: "getState",
      value: function getState() {
        var _this4 = this;
        return {
          mode: this.state === null ? null : this.state === 'desktop' ? 'tabs' : 'accordion',
          activeIndex: this.openIndices.size ? this.activeIndex : null,
          openIndices: Array.from(this.openIndices).sort(function (a, b) {
            return a - b;
          }),
          items: this.items.map(function (_ref9, index) {
            var trigger = _ref9.trigger,
              group = _ref9.group,
              panel = _ref9.panel;
            return {
              index: index,
              id: group.id,
              trigger: trigger,
              panel: _this4.state === 'mobile' ? panel : group,
              open: _this4.openIndices.has(index)
            };
          })
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
    }, {
      key: "_notify",
      value: function _notify(reason) {
        var snapshot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getState();
        if (this.options.onChange) this.options.onChange(_objectSpread2(_objectSpread2({}, snapshot), {}, {
          reason: reason
        }));
      }

      /**
       * Checks whether an element has the configured expanded class.
       *
       * @param {Element} target - Element to inspect.
       * @return {boolean} Whether the expanded class is present.
       */
    }, {
      key: "containsExpandedClass",
      value: function containsExpandedClass(target) {
        return target.classList.contains(this.expandedClass);
      }

      /**
       * Finds the element identified by a trigger's aria-controls within this root
       * without treating the ID as a CSS selector.
       *
       * @param {Element} target - Trigger carrying the aria-controls attribute.
       * @return {Element|null} Controlled element, or null when no matching ID exists.
       */
    }, {
      key: "getControlledByID",
      value: function getControlledByID(target) {
        var _Array$from$find;
        var id = target.getAttribute('aria-controls');
        return (_Array$from$find = Array.from(this.element.querySelectorAll('[id]')).find(function (element) {
          return element.id === id;
        })) !== null && _Array$from$find !== void 0 ? _Array$from$find : null;
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
       * @return {void}
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
     * @return {void}
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

        // Cache elOffsetTop before any sticky class is applied so the natural
        // layout position is captured; elHeight is read live in update() instead.
        this.elOffsetTop = this.element.offsetTop;

        // Prevent the parent from collapsing when the child becomes absolute.
        this.parent.style.minHeight = "".concat(this.parent.offsetHeight, "px");

        // Cache the parent's document-relative top once; refresh on layout change.
        this._cacheParentTop();
        this._resizeObserver = new ResizeObserver(function () {
          _this2._cacheParentTop();
          // Update elOffsetTop only when not stuck to avoid positional feedback.
          if (_this2.currentState !== 'stuck') {
            _this2.elOffsetTop = _this2.element.offsetTop;
          }
          // Refresh minHeight only in default state so it doesn't fight itself.
          if (_this2.currentState === 'default') {
            _this2.parent.style.minHeight = "".concat(_this2.parent.offsetHeight, "px");
          }
          _this2.update();
        });
        this._resizeObserver.observe(this.parent);
        this._resizeObserver.observe(document.documentElement);
        this._resizeObserver.observe(this.element);
        window.addEventListener('scroll', this.onScroll, {
          passive: true
        });

        // Run once on attach so the correct class is applied immediately.
        this.update();
      }

      /**
       * Unmount the sticky element by removing event listeners and disconnecting any observers to clean up resources.
       *
       * @return {void}
       */
    }, {
      key: "destroy",
      value: function destroy() {
        var _this$_resizeObserver;
        window.removeEventListener('scroll', this.onScroll);
        (_this$_resizeObserver = this._resizeObserver) === null || _this$_resizeObserver === void 0 || _this$_resizeObserver.disconnect();

        // Reset inline styles applied by mount() and applyState()
        this.element.style.top = '';
        this.element.classList.remove(this.stuckClass, this.bottomClass);
        if (this.parent) {
          this.parent.style.position = '';
          this.parent.style.minHeight = '';
        }
        this.currentState = 'default';
      }

      /**
       * Apply a visual state to the sticky element by adding/removing CSS classes and setting the `top` style.
       *
       * @param {'default'|'stuck'|'bottom'} state - The state to apply to the element.
       * @param {number} [top] - The top offset in pixels to apply when the state is 'stuck'.
       * @return {void}
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
       * @return {void}
       */
    }, {
      key: "update",
      value: function update() {
        var elHeight = this.element.offsetHeight;

        // The scroll-Y at which the element should start sticking.
        var startStick = this.parentTop + this.elOffsetTop - this.options.topSpacing;
        // The scroll-Y at which the element should anchor to the bottom.
        var endStick = this.parentTop + this.parent.offsetHeight - elHeight - this.options.topSpacing;
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
          var top = scrollY - this.parentTop + this.options.topSpacing;
          this.applyState('stuck', top);
        }

        // Mark the frame as finished so the next scroll event can queue another.
        this.flag = false;
      }
    }, {
      key: "_cacheParentTop",
      value:
      /**
       * Caches the parent element's top offset relative to the document into `this.parentTop`.
       * Should be called at mount and in the ResizeObserver callback, not on every scroll tick.
       *
       * @return {void}
       */
      function _cacheParentTop() {
        this.parentTop = this.parent.getBoundingClientRect().top + window.scrollY;
      }
    }]);
  }();

  exports.Accordion = Accordion;
  exports.Menu = Menu;
  exports.Modal = Modal;
  exports.Sticky = Sticky;
  exports.TabContent = TabContent;

}));
//# sourceMappingURL=javascript-components.umd.js.map
