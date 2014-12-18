(function(window){

  var TouchLib = {};

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

  /************************************************
   *            VERTICAL SLIDER
   *            INHERITS SLIDER
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
  VertSlider.prototype.renderVal = function () {
    Slider.prototype.renderVal.call(this);
    this.g2d.clearRect(0, this.height - this.lastVal - 11, this.width, 22);
    this.g2d.fillRect(0, this.height - this.val - 10, this.width, 20);
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

  /************************************************
   *            HORIZONTAL SLIDER
   *            INHERITS SLIDER
   ***********************************************/
  HorizSlider.prototype = new Slider();
  HorizSlider.prototype.constructor = HorizSlider; 
  function HorizSlider (params) {
    Slider.call(this, params);
    this.registerListeners(this);
  }

  /**
   *  SETS THE VALUE AND UPDATES THE UI
   **/
  HorizSlider.prototype.setVal = function (val) {
    //check for outOfBounds error that can happen with touch
    if (val > this.width) {
      val = this.width;
    }
    Slider.prototype.setVal.call(this, val);
  }

  /**
   *  RETURNS THE NORMALIZED VALUE [0 - 1]
   **/
  HorizSlider.prototype.getVal = function () {
    return Math.round((this.val / this.width) * 100) / 100;
  }

  /**
   *  HORIZONTAL SPECIFIC RENDER
   **/
  HorizSlider.prototype.renderVal = function () {
    Slider.prototype.renderVal.call(this);
    this.g2d.clearRect(this.lastVal - 11, 0, 22, this.height);
    this.g2d.fillRect(this.val - 10, 0, 20, this.height);
  }

  /**
   *  HORIZONTAL SPECIFIC LISTENERS
   **/
  HorizSlider.prototype.registerListeners = function (self) {
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

  /************************************************
   *           DISCRETE VERTICAL SLIDER
   *           INHERITS VERTICAL SLIDER
   ***********************************************/
  DiscreteVertSlider.prototype = new Slider();
  DiscreteVertSlider.prototype.constructor = HorizSlider; 
  function DiscreteVertSlider (params) {
    if (params.numBins == undefined) {
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
    this.registerListeners(this);

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
      this.lastBin = this.currentBin;
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
  DiscreteVertSlider.prototype.renderVal = function () {
    Slider.prototype.renderVal.call(this);
    this.g2d.clearRect(
      0, Math.floor(this.lastBin * this.binSize) + this.lineWidth,
      this.width, this.renderHeight
    );
    this.g2d.fillRect(
      0, Math.floor(this.currentBin * this.binSize) + this.lineWidth,
      this.width, this.renderHeight
    );
  }

  /**
   *  VERTICAL SPECIFIC LISTENERS
   **/
  DiscreteVertSlider.prototype.registerListeners = function (self) {
    Slider.prototype.registerListeners.call(this, self);
    //-----------MOUSE LISTENERS----------------//
    self.canvasEl.addEventListener('mousedown', function (e) {
      e.preventDefault();
      self.mouseIsDown = true;
      self.setVal(e.pageY - self.canvasEl.offsetTop);

    }, false);
    self.canvasEl.addEventListener('mousemove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        self.setVal(e.pageY - self.canvasEl.offsetTop);
      }
    }, false);
    //-----------TOUCH LISTENERS----------------//
    self.canvasEl.addEventListener('touchstart', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.touches.length; i++) {
        if (e.touches[i].target === this) {
          self.mouseIsDown = true;
          self.setVal(e.touches[i].pageY - self.canvasEl.offsetTop);
          break;
        }
      }
    }, false);
    self.canvasEl.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (self.mouseIsDown){
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].target === this) {
            self.setVal(e.touches[i].pageY - self.canvasEl.offsetTop);
            break;
          }
        }
      }
    }, false);
  }

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


  /****************************************************************
   *
   *  BUTTONS
   *
   *  See demoDriver.html for implementation examples
   *
   *  Types: ToggleButton, TriggerButton
   *
   ***************************************************************/

  var Button = function (params) {
    if (params == undefined) {
      console.log('no params in parent constructor');
      return;
    }
    this.val;
    this.notify;
    this.element;
    this.on;
    this.off;
    
    if (params.elementId != undefined) {
      try {
        this.element = document.getElementById(params.elementId);
        if (this.element == null) {
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

    if (typeof(params.notify) == 'function') {
      this.notify = params.notify;
    } else {
      throw 'button constructor needs an notify function to be useful';
      return;
    }

    if (params.on != undefined) {
      this.on = params.on;
    } else {
      throw 'pram object needs on attributes';
    }

    if (params.off != undefined) {
      this.off = params.off;
    } else {
      throw 'pram object needs off attributes';
    }

    if (params.css != undefined) {
      for (var key in params.css) {
        this.element.style[key] = params.css[key];
      }
    } 
    this.createListeners(this);
  }

  Button.prototype.createListeners = function (self) {
    try {
      self.element.addEventListener('mousedown', function (e) {
        e.preventDefault();
        self.processAction();
      }, false);
    } catch (err) {
      console.log('error creating mouse listener');
    }
    try {
      self.element.addEventListener('touchstart', function (e) {
        e.preventDefault();
        self.processAction();
      }, false);
    } catch (err) {
      console.log('error creating touch listener'); 
    }
    
  }

  Button.prototype.processAction = function () {
    console.log('process action - no subtype');
  }

  Button.prototype.render = function (val) {
    if (val) {

      for (var key in this.on) {
        if (key == 'innerHTML') {
          this.element[key] = this.on[key];
        } else {
          this.element.style[key] = this.on[key];
        }
      }

    } 
    else {

      for (var key in this.off) {
        if (key == 'innerHTML') {
          this.element[key] = this.off[key];
        } else {
          try {
            this.element.style[key] = this.off[key];  
          } catch (err) {
            console.log('err: ', err);
          } 
        }
      }

    }
  }

    //----------------------------------------//
   //     TOGGLE BUTTON INHERITS BUTTON      //
  //----------------------------------------//
  ToggleButton.prototype = new Button();
  ToggleButton.prototype.constructor = ToggleButton;
  function ToggleButton (params) {
    Button.call(this, params);
    //this.otherMethodCalls();
    //this.registerListeners(this);
    if (params.val != undefined) {
      this.setVal(params.val);
    } else {
      this.setVal(false);
    }
  } 

  ToggleButton.prototype.processAction = function () {
    this.val = !this.val;
    this.notify(this.val);
    this.render(this.val);
  }

  ToggleButton.prototype.setVal = function (val) {
    this.val = val;
    this.notify(this.val);
    this.render(this.val);
  }

  ToggleButton.prototype.getVal = function () {
    return this.val;
  }


    //----------------------------------------//
   //    TRIGGER BUTTON INHERITS BUTTON      //
  //----------------------------------------//
  TriggerButton.prototype = new Button();
  TriggerButton.prototype.constructor = TriggerButton;
  function TriggerButton (params) {
    Button.call(this, params);
    this.timeout;
    this.timeoutTime;
    if (!isNaN(params.triggerTimeout)) {
      this.timeoutTime = params.triggerTimeout;
    } else {
      throw 'constructor error: need a numeric timeout parameter';
      return;
    }
    this.render(false);
  } 

  TriggerButton.prototype.processAction = function () {
    this.notify();
    //turn on
    this.render(true);
    //if (this.timeout != undefined) {
      clearTimeout(this.timeout);
    //}
    var self = this;
    this.timeout = setTimeout(function () {
      //turn off
      self.render(false);
    }, self.timeoutTime);
  }

  TouchLib.VertSlider = VertSlider;
  TouchLib.HorizSlider = HorizSlider;
  TouchLib.DiscreteVertSlider = DiscreteVertSlider;
  TouchLib.DiscreteHorizSlider = DiscreteHorizSlider;
  TouchLib.ToggleButton = ToggleButton;
  TouchLib.TriggerButton = TriggerButton;
  window.TouchLib = TouchLib;

})(window);