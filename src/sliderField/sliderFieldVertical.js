

  /*****************************************
   *  SliderFieldVert Extends SliderField  *
   *****************************************/
  function SliderFieldVert (params) {
    SliderField.call(this, params);
    this.sliderWidth = Math.floor(this.width / this.numSliders);
    this.g2d.translate(0, this.height);
    this.g2d.scale(1, -1);
    this.render();
  }
  SliderFieldVert.prototype = new SliderField;
  
  /**
   *  @Override
   **/
  SliderFieldVert.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    //get slider index
    var index;
    for (var i = 0; i < this.numSliders; i++) {
      var lowerBound = i * this.sliderWidth;
      var upperBound = lowerBound + this.sliderWidth;
      if (x >= lowerBound && x <= upperBound) {
        index = i;
        break;
      }
    }
    if (index == undefined) return;
    this.setVal(index, (this.height - y) / this.height);
  }

  /**
   *  @Override
   **/
  SliderFieldVert.prototype.render = function () {
    this.g2d.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < this.numSliders; i++) {
      this.g2d.fillRect(i * this.sliderWidth + 2, 0,
        this.sliderWidth - 2, this.realVals[i] * this.height);
    }
    this.renderIsInQueue = false;
  }

