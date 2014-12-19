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
    if (!params) return;
    
    if (typeof(params.notify) == 'function') {
      this.notify = params.notify;
    } else {
      throw 'constructor needs a notify function to be useful';
      return;
    }
    
    if (!params.label) params.label = '';
    if (!params.fillstyle) params.fillstyle = '#666666'

    if (!params.width) {
      if (this instanceof VertSlider) {
        params.width = 20;
      } else {
        params.height = 100;
      }
    }
    if (!params.height) {
      if (this instanceof VertSlider) {
        params.height = 100;
      } else {
        params.height = 20;
      }
    }
    if (params.outputIsOverridden) {
      this.outputIsOverridden = params.outputIsOverridden;
    } else {
      this.outputIsOverridden = false;
    }
    this.labelEl = document.createElement('div');
    this.outputEl = document.createElement('div');
    
    CanvasObject.call(this, params);

    this.labelEl.appendChild(document.createTextNode(params.label));
    this.parentEl.insertBefore(this.labelEl, this.canvasEl);
    this.parentEl.appendChild(this.outputEl);

    this.val = 0;
    this.lastVal = 0;
    this.g2d = this.canvasEl.getContext('2d');
    this.setSize(params.width, params.height);
    this.g2d.clearRect(0, 0, this.width, this.height);
    this.g2d.fillStyle = params.fillstyle;
    
    //set style
    if (params.sliderCss) {
      for (var key in params.sliderCss) {
        this.canvasEl.style[key] = params.sliderCss[key];
      }
    } 

    if (params.initVal) {
      this.setValue(params.initVal);
    } else {
      this.setValue(0);
    }
  }

  /**
   *  SETS THE CSS CLASS OF THE SLIDER ELEMENTS
   **/
  Slider.prototype.setClass = function (className) {
    CanvasObject.prototype.setClass.call(this, className);
    if (!className) {
      console.log('slider set class error: no class given');
      return; 
    }
    this.labelEl.className = className;
    this.outputEl.className = className;
  }

  /**
   *  SETS THE VALUE BASED ON A NORMALIZED INPUT [0 - 1]
   **/
  Slider.prototype.setValue = function (val) {
    if (val < 0 || val > 1) {
      console.log('slider set value input outOfBounds, try [0 - 1]');
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
    this.val = val;
    this.notify(this.getVal());
    this.requestRender();
  }

  /**
   *  COMMON RENDER VALUE PROCEDURES
   **/
  Slider.prototype.render = function () {
    if (!this.outputIsOverridden) {
      this.outputEl.innerHTML = this.getVal();  
    }
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
