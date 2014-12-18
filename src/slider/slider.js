  /****************************************************************
   *
   *  HTML5 UI SLIDER
   *  IMPLEMENTED ON A CANVAS GRAPHICS CONTEXT
   *  WORKS WITH BOTH MOUSE AND TOUCH
   *
   *  See demoDriver.html for implementation examples
   *
   *  Types: VertSlider, HorizSlider, 
   *         DiscreteHorizSlider, DiscreteVertSlider
   *
   ***************************************************************/

  var Slider = function (params) {
    if (params == undefined) {
      console.log('no params in parent constructor');
      return;
    }
    
    if (typeof(params.notify) == 'function') {
      this.notify = params.notify;
    } else {
      throw 'constructon needs an notify function to be useful';
      return;
    }

    var parentEl;
    if (params.elementId != undefined) {
      try {
        parentEl = document.getElementById(params.elementId);
        if (parentEl == null) {
          throw 'cannot build button: param object needs an elementId';
          return;
        }
      } catch (err) {
        console.log('err getting element');
      }
    } else {
      throw 'cannot build button: param object needs an elementId';
      return; 
    }

    if (params.label == undefined) {
      params.label = '';
    }
    if (params.fillstyle == undefined) {
      fillstyle = '#666666';
    }

    if (params.width == undefined || params.width == isNaN) {
      if (this instanceof VertSlider) {
        params.width = 20;
      } else {
        params.height = 100;
      }
    }
    if (params.height == undefined || params.height == isNaN) {
      if (this instanceof VertSlider) {
        params.height = 100;
      } else {
        params.height = 20;
      }
    }
    if (params.outputIsOverridden != undefined) {
      this.outputIsOverridden = params.outputIsOverridden;
    } else {
      this.outputIsOverridden = false;
    }

    this.labelEl = document.createElement('div');
    this.labelEl.appendChild(document.createTextNode(params.label));
    this.canvasEl = document.createElement('canvas');
    this.outputEl = document.createElement('div');
    parentEl.appendChild(this.labelEl);
    parentEl.appendChild(this.canvasEl);
    parentEl.appendChild(this.outputEl);

    this.val = 0;
    this.lastVal = 0;
    this.width = params.width;
    this.height = params.height;
    this.canvasEl.width;
    this.canvasEl.height;
    this.fillstyle = params.fillstyle;
    this.g2d = this.canvasEl.getContext('2d');
    this.setSize(this.width, this.height);
    this.g2d.clearRect(0, 0, this.width, this.height);
    this.g2d.fillStyle = this.fillstyle;
    this.mouseIsDown = false;
    this.rafIsInQueue = false;
    
    //set style
    if (params.sliderCss != undefined) {
      for (var key in params.sliderCss) {
        this.canvasEl.style[key] = params.sliderCss[key];
      }
    } 

    if (params.cssClass != undefined) {
      this.setClass(params.cssClass);
    }

    if (params.initVal == undefined) {
      this.setValue(0);
    } else {
      this.setValue(params.initVal);
    }
  }

  /**
   *  SET THE SIZE OF THE UI ELEMENT
   **/
  Slider.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.canvasEl.width = width;
    this.canvasEl.height = height;
    this.g2d.width = this.canvasEl.width;
    this.g2d.height = this.canvasEl.height;
    this.g2d.fillStyle = this.fillstyle;
  }

  /**
   *  SETS THE CSS CLASS OF THE SLIDER ELEMENTS
   **/
  Slider.prototype.setClass = function (className) {
    if (className == null) {
      console.log('error: no class given');
      return; 
    }
    this.labelEl.className = className;
    this.canvasEl.className = className;
    this.outputEl.className = className;
  }

  /**
   *  SETS THE VALUE BASED ON A NORMALIZED INPUT [0 - 1]
   **/
  Slider.prototype.setValue = function (val) {
    if (val < 0 || val > 1) {
      console.log('error: input value outOfBounds, try [0 - 1]');
      return;
    }
    if (this instanceof VertSlider) {
      this.setVal(val * this.height);
    } else {
      this.setVal(val * this.width);
    }
  }

  /**
   *  SETS THE REGULAR VALUE AND UPDATES THE UI
   **/
  Slider.prototype.setVal = function (val) {
    if (val < 0) {
      val = 0;
    }
    this.lastVal = this.val;
    this.val = val;
    this.notify(this.getVal());
    if (!this.rafIsInQueue) {
      this.rafIsInQueue = true;
      var update = this.renderVal();
      requestAnimationFrame(function () {
        update;
      });
    }
  }

  /**
   *  COMMON RENDER VALUE PROCEDURES
   **/
  Slider.prototype.renderVal = function () {
    if (!this.outputIsOverridden) {
      //console.log('setting in self');
      this.outputEl.innerHTML = this.getVal();  
    }
    this.rafIsInQueue = false;
  }

  /**
   *  COMMON CANVAS LISTENERS
   **/
  Slider.prototype.registerListeners = function (self) {
    //-----------MOUSE LISTENERS----------------//
    self.canvasEl.addEventListener('mouseup', function (e) {
      e.preventDefault();
      if (self.mouseIsDown) {
        self.mouseIsDown = false;
      }
    }, false);
    self.canvasEl.addEventListener('mouseout', function (e) {
      e.preventDefault();
      if (self.mouseIsDown) {
        self.mouseIsDown = false;
      }
    }, false);
    //-----------TOUCH LISTENERS----------------//
    self.canvasEl.addEventListener('touchend', function (e) {
      e.preventDefault();
      self.mouseIsDown = false;
    }, false);
  }
