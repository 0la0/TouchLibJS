
  /******************************************
   *  SliderFieldHoriz Extends SliderField  *
   ******************************************/
  SliderFieldHoriz.prototype = new SliderField();
  SliderFieldHoriz.prototype.constructor = SliderFieldHoriz;
  function SliderFieldHoriz (params) {
    SliderField.call(this, params);
    this.sliderHeight = Math.floor(this.height / this.numSliders);
    this.render();
  } 

  /**
   *  @Override
   **/
  SliderFieldHoriz.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    //get slider index
    var index;
    var vals = [];
    for (var i = 0; i < this.numSliders; i++) {
      var lowerBound = i * this.sliderHeight;
      var upperBound = lowerBound + this.sliderHeight;
      if (y >= lowerBound && y <= upperBound) {
        index = i;
        break;
      }
    }
    if (index == undefined) return;
    this.setVal(index, x / this.width);
  }

  /**
   *  @Override
   **/
  SliderFieldHoriz.prototype.render = function () {
    this.g2d.clearRect(0, 0, this.width, this.height);
    for (var i = 0; i < this.numSliders; i++) {
      this.g2d.fillRect(0, i * this.sliderHeight + 2,
        this.realVals[i] * this.width, this.sliderHeight - 2);
    }
    this.renderIsInQueue = false;
  }

