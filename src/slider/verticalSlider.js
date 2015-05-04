
  /***********************************************
   *            VERTICAL SLIDER                  *
   *            EXTENDS  SLIDER                  *
   ***********************************************/
  function VertSlider (params) {
    Slider.call(this, params);
  }
  VertSlider.prototype = new Slider;

  /**
   *  @Override
   *  SETS THE VALUE AND UPDATES THE UI
   **/
  VertSlider.prototype.setVal = function (val) {
    //check for outOfBounds error that can happen with touch
    if (val > this.height) {
      val = this.height;
    }
    Slider.prototype.setVal.call(this, val);
  }

  /**
   *  RETURNS THE NORMALIZED VALUE [0 - 1]
   **/
  VertSlider.prototype.getVal = function () {
    return Math.round((this.val / this.height) * 100) / 100;
  }

  /**
   *  @Override
   *  VERTICAL SPECIFIC RENDER
   **/
  VertSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(0, this.height - this.lastVal - 11, this.width, 22);
    this.g2d.fillRect(0, this.height - this.val - 10, this.width, 20);
    this.lastVal = this.val;
    this.renderIsInQueue = false;
  }

  /**
   *  @Override
   **/
  VertSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action === 'touchend') return;
    this.setVal(this.height - y);
  }

