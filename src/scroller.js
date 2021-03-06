
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
            if (x) { 
              if (!(
                (_this.scrollLeft() <= 0 && event.moveX < 0) ||
                (_this.scrollLeft() >= _this[0].scrollWidth - _this[0].clientWidth && event.moveX > 0)
              )) {
                event.parentEvent.preventDefault();
              };
              _this.scrollLeft(_this.scrollLeft() + event.moveX);
            };
            if (y) {
              if (!(
                (_this.scrollTop() <= 0 && event.moveY < 0) ||
                (_this.scrollTop() >= _this[0].scrollHeight - _this[0].clientHeight && event.moveY > 0)
              )) {
                event.parentEvent.preventDefault();
              };
              _this.scrollTop(_this.scrollTop() + event.moveY);
            };
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
            element.scrollTop = Math.floor(n);
          });
      };
      return this[0].scrollTop;
    },

    scrollLeft: function(n) {
      if (!(n === null || n === undefined)) {
        this.each(function(element) {
            element.scrollLeft = Math.floor(n);
          });
      };
      return this[0].scrollLeft;
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
