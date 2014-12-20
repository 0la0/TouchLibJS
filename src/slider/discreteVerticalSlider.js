
  /************************************************
   *           DISCRETE VERTICAL SLIDER
   *           EXTENDS  VERTICAL SLIDER
   ***********************************************/
  DiscreteVertSlider.prototype = new Slider();
  DiscreteVertSlider.prototype.constructor = HorizSlider; 
  function DiscreteVertSlider (params) {
    if (!params.numBins) {
      throw 'discrete vertical slider needs an integer number of bins';
      return;
    }
    this.numBins = params.numBins
    this.binSize = Math.floor(params.height / this.numBins);
    this.lineWidth = 4;
    this.renderHeight = this.binSize - this.lineWidth;
    this.currentBin = 0;
    this.lastBin = -99;
    this.binBorderColor = params.binBorderColor;
    
    Slider.call(this, params);
    
    var oldStyle = this.g2d.fillStyle;
    this.g2d.fillStyle = this.binBorderColor;
    for (var i = 0; i <= this.numBins; i++) {
      this.g2d.fillRect(
        0, Math.floor(i * this.binSize), this.height, this.lineWidth
      );
    }
    this.g2d.fillStyle = oldStyle;
  }

  /**
   *  SETS THE VALUE AND UPDATES THE UI
   **/
  DiscreteVertSlider.prototype.setVal = function (val) {
    //check for outOfBounds error that can happen with touch
    if (val > this.height) {
      val = this.height;
    }
    //---calc bin---//
    var b = val / this.height;
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
    }
    
  }

  /**
   *  RETURNS THE CURRENT BIN INDEX (STARTING AT 0)
   **/
  DiscreteVertSlider.prototype.getVal = function () {
    return this.currentBin;
  }

  /**
   *  VERTICAL SPECIFIC RENDER
   **/
  DiscreteVertSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(
      0, Math.floor(this.lastBin * this.binSize) + this.lineWidth,
      this.width, this.renderHeight
    );
    this.g2d.fillRect(
      0, Math.floor(this.currentBin * this.binSize) + this.lineWidth,
      this.width, this.renderHeight
    );
    this.lastBin = this.currentBin;
    this.renderIsInQueue = false;
  }

  DiscreteVertSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    this.setVal(y);
  }

