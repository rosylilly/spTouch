
spTouch.ext(
  /**
   * @lends spTouch.prototype
   */
  {
    /**
     * flickやswipeで要素内スクロールができるようにします。
     * @param {Boolean} [x=true] x方向にスクロールできるかどうか
     * @param {Boolean} [y=true] y方向にスクロールできるかどうか
     */
    scroller: function(x, y) {
      x = (x === null || x === undefined) ? true : !!x;
      y = (y === null || y === undefined) ? true : !!y;

      var _this = this;
      this.bind({
          'swipe': function(event) {
            if (x) { _this.scrollLeft(_this.scrollLeft() + event.moveX) };
            if (y) { _this.scrollTop(_this.scrollTop() + event.moveY) };
          },
          'flick': function(event) {
            if (x) {
              var moveX = (event.speedX / spTouch.fn.scroller.step);
              var speedX = event.speedX / 10;
              var minusX = (speedX < 0);
              if (spTouch.fn.scroller.timer.x) {
                clearInterval(spTouch.fn.scroller.timer.x);
              };
              spTouch.fn.scroller.timer.x = setInterval(function() {
                  _this.scrollLeft(_this.scrollLeft() + speedX);
                  speedX -= moveX;
                  if (minusX && speedX > 0) { clearInterval(spTouch.fn.scroller.timer.x) };
                  if (!minusX && speedX < 0) { clearInterval(spTouch.fn.scroller.timer.x) };
                }, spTouch.fn.scroller.time);
            };
            if (y) {
              var moveY = (event.speedY / spTouch.fn.scroller.step);
              var speedY = event.speedY / 10;
              var minusY = (speedY < 0);
              if (spTouch.fn.scroller.timer.y) {
                clearInterval(spTouch.fn.scroller.timer.y);
              };
              spTouch.fn.scroller.timer.y = setInterval(function() {
                  _this.scrollTop(_this.scrollTop() + speedY);
                  speedY -= moveY;
                  if (minusY && speedY > 0) { clearInterval(spTouch.fn.scroller.timer.y) };
                  if (!minusY && speedY < 0) { clearInterval(spTouch.fn.scroller.timer.y) };
                }, spTouch.fn.scroller.time);
            };
          }
        });
    },

    scrollTop: function(n) {
      if (!(n === null || n === undefined)) {
        this.each(function(element) {
            element.scrollTop = n;
            if ((element.scrollTop + element.offsetHeight == element.scrollHeight) ||
              (element.scrollTop == 0)
            ){
              element.throwTouchEvents = true;
            } else {
              element.throwTouchEvents = false;
            };
          });
      } else {
        return this[0].scrollTop;
      };
    },

    scrollLeft: function(n) {
      if (!(n === null || n === undefined)) {
        this.each(function(element) {
            element.scrollLeft = n;
          });
      } else {
        return this[0].scrollLeft;
      };
    }
}, spTouch.fn);

spTouch.ext({
    time: 5,
    step: 250.0,
    timer: {
      x: null,
      y: null
    }
  }, spTouch.fn.scroller);
