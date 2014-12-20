

  /***************************************
   *  SliderField Extends Canvas Object  *
   ***************************************/
  SliderField.prototype = new CanvasObject();
  SliderField.prototype.constructor = SliderField;
  function SliderField (params) {
    if (!params) return;
    CanvasObject.call(this, params);

    if (params.numSliders == undefined) this.numSliders = 10;
    else this.numSliders = params.numSliders;
    
    this.realVals = [];
    for (var i = 0; i < this.numSliders; i++) {
      this.realVals.push(Math.random());
    }
    this.g2d.fillStyle = '#666666';
    this.notify = params.notify;
    this.errMsg = 'slider field values need an array of length ';
    this.errMsg += this.numSliders;
  }

  /*
   *  Set one value in the slider field
   */
  SliderField.prototype.setVal = function (index, val) {
    if (index < 0 || index >= this.numSliders) {
      throw 'SliderField.setVal - indexOutOfBounds Exception';
      return;
    }
    if (val < 0) val = 0;
    else if (val > 1) val = 1;
    this.realVals[index] = val;
    this.notify(this.realVals);
    this.requestRender();
  }

  /*
   *  Set all values in the slider field
   */
  SliderField.prototype.setVals = function (vals) {
    if (!(vals instanceof Array)) {
      throw this.errMsg;
      return;
    }
    else if (vals.length != this.numSliders) {
      throw this.errMsg;
      return;
    }
    for (var i = 0; i < this.numSliders; i++) {
      var val = vals[i];
      if (val < 0) val = 0;
      else if (val > 1) val = 1;
      this.realVals[i] = val;
    }
    this.notify(this.realVals);
    this.requestRender();
  }

  /*
   *  Get one value in the slider field
   */
  SliderField.prototype.getVal = function (index) {
    if (index < 0 || index >= this.numSliders) {
      throw 'SliderField.setVal - indexOutOfBounds Exception';
      return;
    }
    return this.realVals[index];
  }

  /*
   *  Get all values in the slider field - realVals array
   */
  SliderField.prototype.getVal = function () {
    return this.realVals;
  }

