
  /************************************************
   *         DISCRETE HORIZONTAL SLIDER           *
   *         EXTENDS  HORIZONTAL SLIDER           *
   ************************************************/
  function DiscreteHorizSlider (params) {
    if (!params.numBins) {
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
    
    var oldStyle = this.g2d.fillStyle;
    this.g2d.fillStyle = this.binBorderColor;
    for (var i = 0; i <= this.numBins; i++) {
      this.g2d.fillRect(
        Math.floor(i * this.binSize), 0, this.lineWidth, this.height
      );
    }
    this.g2d.fillStyle = oldStyle;
  }
  DiscreteHorizSlider.prototype = new Slider;

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
    }
  }

  /**
   *  SET THE ACTIVE BIN INDEX
   **/
  DiscreteHorizSlider.prototype.setBin = function (index) {
    if (index < 0 || index >= this.numBins) {
      throw 'indexOutOfBounds Exception';
      return;
    }
    this.currentBin = index;
    if (this.currentBin != this.lastBin) {
      var realVal = this.currentBin * this.width;
      Slider.prototype.setVal.call(this, realVal);
    }
  }

  /**
   *  RETURNS THE CURRENT BIN INDEX (STARTING AT 0)
   **/
  DiscreteHorizSlider.prototype.getVal = function () {
    return this.currentBin;
  }

  /**
   *  @Override
   *  HORIZONTAL SPECIFIC RENDER
   **/
  DiscreteHorizSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(
      Math.floor(this.lastBin * this.binSize) + this.lineWidth, 0, 
      this.renderWidth, this.height
    );
    this.g2d.fillRect(
      Math.floor(this.currentBin * this.binSize) + this.lineWidth, 0, 
      this.renderWidth, this.height
    );
    this.lastBin = this.currentBin;
    this.renderIsInQueue = false;
  }

  /**
   *  @Override
   **/
  DiscreteHorizSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action === 'touchend') return;
    this.setVal(x);
  }

