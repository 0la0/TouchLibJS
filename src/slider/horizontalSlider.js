
  /************************************************
   *            HORIZONTAL SLIDER
   *            EXTENDS    SLIDER
   ***********************************************/
  HorizSlider.prototype = new Slider();
  HorizSlider.prototype.constructor = HorizSlider; 
  function HorizSlider (params) {
    Slider.call(this, params);
  }

  /**
   *  SETS THE VALUE AND UPDATES THE UI
   **/
  HorizSlider.prototype.setVal = function (val) {
    //check for outOfBounds error that can happen with touch
    if (val > this.width) {
      val = this.width;
    }
    Slider.prototype.setVal.call(this, val);
  }

  /**
   *  RETURNS THE NORMALIZED VALUE [0 - 1]
   **/
  HorizSlider.prototype.getVal = function () {
    return Math.round((this.val / this.width) * 100) / 100;
  }

  /**
   *  HORIZONTAL SPECIFIC RENDER
   **/
  HorizSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(this.lastVal - 11, 0, 22, this.height);
    this.g2d.fillRect(this.val - 10, 0, 20, this.height);
    this.lastVal = this.val;
    this.renderIsInQueue = false;
  }

  HorizSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    this.setVal(x);
  }

