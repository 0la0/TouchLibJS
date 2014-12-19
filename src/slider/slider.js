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

  /**********************************
   *  Slider Extends Canvas Object  *
   **********************************/
  Slider.prototype = new CanvasObject();
  Slider.prototype.constructor = Slider;
  function Slider (params) {
    if (params == undefined) return;
    
    if (typeof(params.notify) == 'function') {
      this.notify = params.notify;
    } else {
      throw 'constructor needs a notify function to be useful';
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

    CanvasObject.call(this, params);
    this.labelEl = document.createElement('div');
    this.labelEl.appendChild(document.createTextNode(params.label));
    this.outputEl = document.createElement('div');
    this.parentEl.insertBefore(this.labelEl, this.canvasEl);
    this.parentEl.appendChild(this.outputEl);

    this.val = 0;
    this.lastVal = 0;
    this.g2d = this.canvasEl.getContext('2d');
    this.setSize(params.width, params.height);
    this.g2d.clearRect(0, 0, this.width, this.height);
    this.g2d.fillStyle = params.fillstyle;
    //this.mouseIsDown = false;
    //this.rafIsInQueue = false;
    
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
    //this.lastVal = this.val;
    this.val = val;
    this.notify(this.getVal());
    /*
    if (!this.rafIsInQueue) {
      this.rafIsInQueue = true;
      var update = this.renderVal();
      requestAnimationFrame(function () {
        update;
      });
    }
    */
    this.requestRender();
  }

  /**
   *  COMMON RENDER VALUE PROCEDURES
   **/
  Slider.prototype.render = function () {
    if (!this.outputIsOverridden) {
      this.outputEl.innerHTML = this.getVal();  
    }
    //this.renderIsInQueue = false;
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
