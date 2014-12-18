
  /************************************************
   *         DISCRETE HORIZONTAL SLIDER
   *         INHERITS HORIZONTAL SLIDER
   ***********************************************/
  DiscreteHorizSlider.prototype = new Slider();
  DiscreteHorizSlider.prototype.constructor = HorizSlider; 
  function DiscreteHorizSlider (params) {
    if (params.numBins == undefined) {
      throw 'discrete horizontal slider needs an integer number of bins';
      return;
    }
    this.numBins = params.numBins
    this.binSize = Math.floor(params.width / this.numBins);
    this.lineWidth = 4;
    this.renderWidth = this.binSize - this.lineWidth;
    this.currentBin = 0;
    this.lastBin = -99;
    this.binBorderColor = params.binBorderColor;
    Slider.call(this, params);
    this.registerListeners(this);

    var oldStyle = this.g2d.fillStyle;
    this.g2d.fillStyle = this.binBorderColor;
    for (var i = 0; i <= this.numBins; i++) {
      this.g2d.fillRect(
        Math.floor(i * this.binSize), 0, this.lineWidth, this.height
      );
    }
    this.g2d.fillStyle = oldStyle;
  }

  /**
   *  SETS THE VALUE AND UPDATES THE UI
   **/
  DiscreteHorizSlider.prototype.setVal = function (val) {
    //check for outOfBounds error that can happen with touch
    if (val > this.width) {
      val = this.width;
    }
    //---calc bin---//
    var b = val / this.width;
    b *= this.numBins;
    b = Math.floor(b);
    if (b < 0) {
      b = 0;
    } else if (b >= this.numBins) {
      b = this.numBins - 1;
    }
    this.currentBin = b;
    if (this.currentBin != this.lastBin) {
      Slider.prototype.setVal.call(this, val);
      this.lastBin = this.currentBin;
    }
    
  }

  /**
   *  RETURNS THE CURRENT BIN INDEX (STARTING AT 0)
   **/
  DiscreteHorizSlider.prototype.getVal = function () {
    return this.currentBin;
  }

  /**
   *  HORIZONTAL SPECIFIC RENDER
   **/
  DiscreteHorizSlider.prototype.renderVal = function () {
    Slider.prototype.renderVal.call(this);
    this.g2d.clearRect(
      Math.floor(this.lastBin * this.binSize) + this.lineWidth, 0, 
      this.renderWidth, this.height
    );
    this.g2d.fillRect(
      Math.floor(this.currentBin * this.binSize) + this.lineWidth, 0, 
      this.renderWidth, this.height
    );
  }

  /**
   *  HORIZONTAL SPECIFIC LISTENERS
   **/
  DiscreteHorizSlider.prototype.registerListeners = function (self) {
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
