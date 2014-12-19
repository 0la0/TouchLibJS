
  /************************************************
   *            VERTICAL SLIDER
   *            EXTENDS  SLIDER
   ***********************************************/
  VertSlider.prototype = new Slider();
  VertSlider.prototype.constructor = VertSlider;
  function VertSlider (params) {
    Slider.call(this, params);
    this.registerListeners(this);
  } 

  /**
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
   *  VERTICAL SPECIFIC LISTENERS
   **/
  VertSlider.prototype.registerListeners = function (self) {
    Slider.prototype.registerListeners.call(this, self);
    //-----------MOUSE LISTENERS----------------//
    self.canvasEl.addEventListener('mousedown', function (e) {
      e.preventDefault();
      self.mouseIsDown = true;
      self.setVal(self.height - (e.pageY - self.canvasEl.offsetTop));
    }, false);
    self.canvasEl.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        self.setVal(self.height - (e.pageY - self.canvasEl.offsetTop));
      }
    }, false);
    //-----------TOUCH LISTENERS----------------//
    self.canvasEl.addEventListener('touchstart', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.touches.length; i++) {
        if (e.touches[i].target === this) {
          self.mouseIsDown = true;
          self.setVal(
            self.height - (e.touches[i].pageY - self.canvasEl.offsetTop)
          );
          break;
        }
      }
    }, false);
    self.canvasEl.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].target === this) {
            self.setVal(
              self.height - (e.touches[i].pageY - self.canvasEl.offsetTop)
            );
            break;
          }
        }
      }
    }, false);
  }
