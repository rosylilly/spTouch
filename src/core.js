
/**
 * @class
 * @constructor
 * @param {String|Array<HTMLElement>|HTMLElement} selector spTouchを適用する要素のセレクタ、もしくは要素のオブジェクト及びその配列
 * @param {HTMLElement} [context] selectorのコンテキスト
 * @example
 * spTouch(document.getElementById('id')) == spTouch('#id')
 * spTouch('div > p').bind({
 *    flick: function(){ ... }
 *    });
 */
function spTouch (selector, context, option) {
  return new spTouch.fn.init(selector, context, option);
};


spTouch.fn = spTouch.prototype = /** @lends spTouch.prototype */{
  constructor: spTouch,

  /**
   * @private
   */
  init: function(selector, context, option) {
    option = option || {};
    if (context && !spTouch.isDOMObject(context)) {
      option = context;
      context = null;
    };
    context = context || document;
    this.length = 0;

    if (spTouch.isDOMObject(selector)) {
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
    if (!option['noListener'])
      spTouch.setEventListeners(this);
    return this;
  },

  /**
   * すべてのHTMLElementに実行します
   * @param {Function} func 実行する関数
   */
  each: function(func) {
    for (var i = 0, l = this.length; i < l; i++) {
      func.apply(this, [this[i], i]);
    };
  },

  /**
   * イベントリスナの設定
   * @param {Object} listeners イベントリスナのオブジェクト
   * @example 
   * spTouch('div').bind({
   *     flick: function(){ ... },
   *     tap: function(){ ... }
   *   });
   */
  bind: function(listeners) {
    this.each(function(element) {
        for (var event in listeners) {
          element.addEventListener(event, listeners[event]);
        };
      });
  },

  /**
   * CSSの値を取得、設定する
   * @param {String} property CSSプロパティ名
   * @param {String} [value] 設定する値
   */
  css: function(property, value) {
    if (!value) {
      if (this.length == 1) {
        var st = document.defaultView.getComputedStyle(this[0], ''); 
        return st.getPropertyValue(property);
      } else {
        var values = [];
        this.each(function(e) {
            var st = document.defaultView.getComputedStyle(e, '');
            values.push(st.getPropertyValue(property));
          });
        return values;
      };
    } else {
      this.each(function(e) {
          e.style[property] = value;
        });
    };
  },

  /**
   * @property {Number} 
   */
  length: 0
};
spTouch.fn.init.prototype = spTouch.fn;

spTouch.ext = spTouch.fn.ext = function(obj, target) {
  var name;
  target = target || spTouch;
  for(name in obj) {
    target[name] = obj[name];
  };
};


spTouch.ext(
  /** @lends spTouch */
  {
  /**
   * 配列に対して順次funcを実行する
   * @param {Array} obj 対象となる配列
   * @param {Function} func 実行する関数
   */
  each: function(obj, func) {
    spTouch.fn.each.apply(obj, [func]);
  },

  /**
   * @private
   */
  setEventListeners: function(object) {
    spTouch.each(object, function(element) {
        element.addEventListener('touchstart', Gesture.Listeners.touchstart);
        element.addEventListener('touchmove', Gesture.Listeners.touchmove);
        element.addEventListener('touchend', Gesture.Listeners.touchend);
        element.addEventListener('touchcancel', Gesture.Listeners.touchend);
      });
    if (!spTouch.setEventListeners.initialized) {
      document.addEventListener('scroll', Gesture.Listeners.documentscroll);
      document.addEventListener('touchstart', Gesture.Listeners.documenttouchstart);
      document.addEventListener('touchmove', Gesture.Listeners.documenttouchmove);
      document.addEventListener('touchend', Gesture.Listeners.documenttouchend);
      document.addEventListener('touchcancel', Gesture.Listeners.documenttouchend);
      spTouch.setEventListeners.initialized = true;
    };
  },

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

spTouch.setEventListeners.initialized = false;
