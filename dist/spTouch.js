/**
 * spTouch - pure javascript touch event library for smartphones
 * @author hebisan <hebisan@biscot.to>
 * @version master#c7cffccb210ac77b7c4da42666d1363943a674fb
 */

!function(global) {

/**
 * @class
 * @constructor
 * @param {String|Array<HTMLElement>|HTMLElement} selector spTouchを適用する要素のセレクタ、もしくは要素のオブジェクト及びその配列
 * @param {HTMLElement} [context] selectorのコンテキスト
 */
function spTouch (selector, context) {
  return new spTouch.fn.init(selector, context);
};


spTouch.fn = spTouch.prototype = /** @lends spTouch.prototype */{
  constructor: spTouch,

  /**
   * @private
   */
  init: function(selector, context) {
    context = context || document;
    this.length = 0;

    if (selector["tagName"]) {
      this[0] = selector;
      this.length = 1;
    } else {
      if (!spTouch.isString(selector) && !spTouch.isArray(selector))
        throw '`selector`\'s type is String, Array or HTMLElement';

      if (spTouch.isString(selector)) {
        var elm = [];
        if (elm = context.getElementById(selector.toString().substr(1))) {
          this[0] = elm;
          this.length = 1;
          selector = [];
        };

        if (elm = context.getElementsByClassName(selector.toString().substr(1))) {
          if(elm.length > 0) selector = elm;
        };

        if (elm = context.getElementsByTagName(selector)) {
          if(elm.length > 0) selector = elm;
        };

        if (spTouch.isString(selector)) {
          selector = context.querySelectorAll(selector);
        };
      };

      if (selector.length > 0) {
        var elements = [];
        for (var i = 0, l = selector.length; i < l; i++) {
          var element = selector[i];
          if (spTouch.isDOMObject(element)) {
            elements.push(element);
          };
        };
        for (var i = 0, l = elements.length; i < l; i++) { this[i] = elements[i] };
        this.length = elements.length;
      };
    };
    return this;
  },

  /**
   * @property {Number} 
   */
  length: 0
};

spTouch.ext = spTouch.fn.ext = function(obj) {
  var name;
  for(name in obj) {
    spTouch[name] = obj[name];
  };
};


spTouch.ext(
  /** @lends spTouch */
  {
  /**
   * 文字列かどうかの判別
   * @returns {Boolean}
   * @param {*} obj 判別するオブジェクト
   */
  isString: function(obj) {
    return (typeof obj == 'string');
  },
  /**
   * 配列かどうかの判別
   * @function
   * @returns {Boolean}
   * @param {*} obj 判別するオブジェクト
   */
  isArray: Array.isArray || function(obj) {
    return (toString.call(obj) == '[object Array]');
  },
  /**
   * HTMLElementかどうかの判別
   * @returns {Boolean}
   * @param {*} obj 判別するオブジェクト
   */
  isDOMObject: function(obj) {
    if (HTMLElement.prototype['isPrototypeOf']) {
      return HTMLElement.prototype.isPrototypeOf(obj);
    };
    return (obj && obj.nodeType === 1 && obj.ownerDocument === document)
  }
});

/**
 * @class
 * @constructor
 * @param {Number} speedX x軸の速度
 * @param {Number} speedY y軸の速度
 */
function FlickEvent (speedX, speedY) {
  this = document.createEvent('UIEvents');
  this.initUIEvent('flick', true, true, window, 1);

  return this;
};
global.spTouch = spTouch;
}(window);
