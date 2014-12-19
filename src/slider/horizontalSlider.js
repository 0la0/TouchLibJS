
  /************************************************
   *            HORIZONTAL SLIDER
   *            INHERITS SLIDER
   ***********************************************/
  HorizSlider.prototype = new Slider();
  HorizSlider.prototype.constructor = HorizSlider; 
  function HorizSlider (params) {
    Slider.call(this, params);
    this.registerListeners(this);
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

  /**
   *  HORIZONTAL SPECIFIC LISTENERS
   **/
  HorizSlider.prototype.registerListeners = function (self) {
    Slider.prototype.registerListeners.call(this, self);
    //-----------MOUSE LISTENERS----------------//
    self.canvasEl.addEventListener('mousedown', function (e) {
      e.preventDefault();
      self.mouseIsDown = true;
      self.setVal(e.pageX - self.canvasEl.offsetLeft);
    }, false);
    self.canvasEl.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        self.setVal(e.pageX - self.canvasEl.offsetLeft);
      }
    }, false);
    //-----------TOUCH LISTENERS----------------//
    self.canvasEl.addEventListener('touchstart', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.touches.length; i++) {
        if (e.touches[i].target === this) {
          self.mouseIsDown = true;
          self.setVal(e.touches[i].pageX - self.canvasEl.offsetLeft);
          break;
        }
      }
    }, false);
    self.canvasEl.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].target === this) {
            self.setVal(e.touches[i].pageX - self.canvasEl.offsetLeft);
            break;
          }
        }
      }
    }, false);
  }
