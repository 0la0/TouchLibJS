(function(window){

  var TouchLib = {};


  /************************************************
   *  Parent object for all canvas based widgets  *
   ************************************************/
  function CanvasObject (params) {
    if (!params) return;
    if (params.elementId) {
      try {
        this.parentEl = document.getElementById(params.elementId);
        if (this.parentEl == null) {
          throw 'cannot build object: param object needs an elementId';
          return;
        }
      } catch (err) {
        console.log('err getting element');
      }
    } else {
      throw 'cannot build object: param object needs an elementId';
      return; 
    }

    this.canvasEl = document.createElement('canvas');
    this.parentEl.appendChild(this.canvasEl);

    if (params.cssClass) {
      this.setClass(params.cssClass);
    }

    this.g2d = this.canvasEl.getContext('2d');
    this.setSize(params.width, params.height);
    this.g2d.clearRect(0, 0, this.width, this.height);

    this.mouseIsDown = false;
    this.renderIsInQueue = false;
    this.registerListeners(this);
  }

  CanvasObject.prototype = {

    /**
     *  SET THE SIZE OF THE CANVAS ELEMENT
     **/
    setSize: function (width, height) {
      this.width = width;
      this.height = height;
      this.halfWidth = Math.round(width / 2);
      this.halfHeight = Math.round(height / 2);
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      this.g2d.width = this.canvasEl.width;
      this.g2d.height = this.canvasEl.height;
    },

    /**
     *  FUNCTION WRAPPER FOR REQUEST ANIMATION FRAME
     *  child objects must implement a render function and
     *  it must set renderIsInQueue to false when finished 
     **/
    requestRender: function () {
      if (!this.renderIsInQueue) {
        this.renderIsInQueue = true;
        var self = this;
        requestAnimationFrame(function () {
          self.render();
        });
      }
    },

    /**
     *  SET THE CSS CLASS OF THE CANVAS DOM ELEMENT
     **/
    setClass: function (className) {
      if (!className) {
        console.log('error: no class given');
        return; 
      }
      this.canvasEl.classList.add(className);
    },

    /**
     *  REGISTER MOUSE AND TOUCH LISTENERS
     *  common to all widgets that extend canvasObject
     *  mouse or touch locations are sent to processMouseTouch()
     **/
    registerListeners: function (self) {
      self.canvasEl.addEventListener('mousedown', function (e) {
        e.preventDefault();
        self.mouseIsDown = true;
        self.processMouseTouch(
          'mousedown',
          e.pageX - this.offsetLeft,
          e.pageY - this.offsetTop
        );
      }, false);
      self.canvasEl.addEventListener('mousemove', function (e) {
        e.preventDefault();
        if (self.mouseIsDown) {
          self.processMouseTouch(
            'mousedown',
            e.pageX - this.offsetLeft,
            e.pageY - this.offsetTop
          );
        }
      }, false);
      self.canvasEl.addEventListener('mouseout', function (e) {
        e.preventDefault();
        self.mouseIsDown = false;
      }, false);
      self.canvasEl.addEventListener('mouseup', function (e) {
        e.preventDefault();
        self.processMouseTouch(
          'mouseup',
          e.pageX - this.offsetLeft,
          e.pageY - this.offsetTop
        );
        self.mouseIsDown = false;
      }, false);

      self.canvasEl.addEventListener('touchstart', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].target === this) {
            self.processMouseTouch(
              'touchstart',
              e.touches[i].pageX - this.offsetLeft,
              e.touches[i].pageY - this.offsetTop
            );
          }
        }
      }, false);
      self.canvasEl.addEventListener('touchmove', function (e) {
        e.preventDefault();
        for (var i = 0; i < e.touches.length; i++) {
          if (e.touches[i].target === this) {
            self.processMouseTouch(
              'touchmove',
              e.touches[i].pageX - this.offsetLeft,
              e.touches[i].pageY - this.offsetTop
            );
          }
        }
      }, false);
      self.canvasEl.addEventListener('touchend', function (e) {
        e.preventDefault();
        self.processMouseTouch('touchend');
      }, false);
    },

    /**
     *  SUBCLASS MUST IMPLEMENT RENDER FUNCITON
     **/
    render: function () {},

    /**
     *  SUBCLASS MUST IMPLEMENT PROCESS MOUSE TOUCH
     **/
    processMouseTouch: function (action, x, y) {}

  };

  
  /**********************************
   *                                *
   *  Slider Extends Canvas Object  *
   *                                *
   **********************************/
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
  Slider.prototype = new CanvasObject;

  /**
   *  @Override
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
   *  SETS THE VALUE BASED ON A NORMALIZED DOMAIN [0 - 1]
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
   *  the domain of the regular value is
   *  [0 - this.height] or [0 - this.width]
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
   *  @Override
   *  COMMON RENDER VALUE PROCEDURES
   **/
  Slider.prototype.render = function () {
    if (!this.outputIsOverridden) {
      this.outputEl.textContent = this.getVal();  
    }
  }


  /***********************************************
   *            VERTICAL SLIDER                  *
   *            EXTENDS  SLIDER                  *
   ***********************************************/
  function VertSlider (params) {
    Slider.call(this, params);
  }
  VertSlider.prototype = new Slider;

  /**
   *  @Override
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
   *  @Override
   *  VERTICAL SPECIFIC RENDER
   **/
  VertSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(0, this.height - this.lastVal - 11, this.width, 22);
    this.g2d.fillRect(0, this.height - this.val - 10, this.width, 20);
    this.lastVal = this.val;
    this.renderIsInQueue = false;
  }

  /**
   *  @Override
   **/
  VertSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    this.setVal(this.height - y);
  }


  /***********************************************
   *            HORIZONTAL SLIDER                *
   *            EXTENDS    SLIDER                *
   ***********************************************/
  function HorizSlider (params) {
    Slider.call(this, params);
  }
  HorizSlider.prototype = new Slider;

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
   *  @Override
   *  HORIZONTAL SPECIFIC RENDER
   **/
  HorizSlider.prototype.render = function () {
    Slider.prototype.render.call(this);
    this.g2d.clearRect(this.lastVal - 11, 0, 22, this.height);
    this.g2d.fillRect(this.val - 10, 0, 20, this.height);
    this.lastVal = this.val;
    this.renderIsInQueue = false;
  }

  /**
   *  @Override
   **/
  HorizSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    this.setVal(x);
  }


  /***********************************************
   *           DISCRETE VERTICAL SLIDER          *
   *           EXTENDS  VERTICAL SLIDER          *
   ***********************************************/
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
  DiscreteVertSlider.prototype = new Slider;

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
   *  SET THE ACTIVE BIN INDEX
   **/
  DiscreteVertSlider.prototype.setBin = function (index) {
    if (index < 0 || index >= this.numBins) {
      throw 'indexOutOfBounds Exception';
      return;
    }
    this.currentBin = index;
    if (this.currentBin != this.lastBin) {
      var realVal = this.currentBin * this.height;
      Slider.prototype.setVal.call(this, realVal);
    }
  }

  /**
   *  RETURNS THE CURRENT BIN INDEX (STARTING AT 0)
   **/
  DiscreteVertSlider.prototype.getVal = function () {
    return this.currentBin;
  }

  /**
   *  @Override
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

  /**
   *  @Override
   **/
  DiscreteVertSlider.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    this.setVal(y);
  }


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
    if (action == 'touchend') return;
    this.setVal(x);
  }



  /************************************
   *  Slider2D Extends Canvas Object  *
   ************************************/
  function Slider2D (params) {
    if (!params) return;
    CanvasObject.call(this, params);
    
    if (!params.cssClass) {
      this.canvasEl.style.background = '#ffffff';
      this.canvasEl.style.border = '1px solid #333333';  
    }
    this.g2d.clearRect(0, 0, this.width, this.height);
    this.g2d.fillStyle = params.fillStyle;
    this.isMigrating = false;
    this.notify = params.notify;
    this.cvsPos = {
      thisX: 0,
      thisY: 0,
      prevX: 0,
      prevY: 0
    };
    this.normalVal = {x: 0, y: 0};
    if (params.radius == undefined) {
      this.cvsPos.radius = 20;
    }
    else {
      this.cvsPos.radius = params.radius;
    }
    this.cvsPos.radius2 = this.cvsPos.radius * 2;
    this.twoPi = 2 * Math.PI;
    this.setNormalPosition(0.5, 0.5);
  }
  Slider2D.prototype = new CanvasObject;
  /**
   *  @Override
   *  PROCESS MOUSE OR TOUCH COORDINATE DATA
   **/
  Slider2D.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    if (x < 0) x = 0;
    else if (x >= this.width) {
      x = this.width - 1;
    }
    if (y < 0) y = 0;
    else if (y >= this.height) {
      y = this.height - 1;
    }
    this.cvsPos.thisX = x;
    this.cvsPos.thisY = y;
    this.setRealPosition(x, y);
    this.requestRender();
  }

  /**
   *  @Override
   **/
  Slider2D.prototype.render = function () {
    //clear last pos
    this.g2d.clearRect(
      this.cvsPos.prevX - this.cvsPos.radius - 1, 
      this.cvsPos.prevY - this.cvsPos.radius - 1,
      this.cvsPos.radius2 + 2, this.cvsPos.radius2 + 2
    );
    //render this pos
    this.g2d.beginPath();
    this.g2d.arc(
      this.cvsPos.thisX, this.cvsPos.thisY, 
      this.cvsPos.radius, 0, this.twoPi
    );
    this.g2d.closePath();
    this.g2d.fill();
    this.cvsPos.prevX = this.cvsPos.thisX;
    this.cvsPos.prevY = this.cvsPos.thisY;
    if (this instanceof Joystick) return;
    this.renderIsInQueue = false;
  }

  /**
   *  SET VALUE ([0 - WIDTH], [0 - HEIGHT])
   **/
  Slider2D.prototype.setRealPosition = function (x, y) {
    this.normalVal.x = x / this.width;
    this.normalVal.y = (this.height - y) / this.height;
    if (this instanceof Joystick) return;
    this.notify({x: this.normalVal.x, y: this.normalVal.y});
  }

  /**
   *  SET NORMALIZED VALUE ([0 - 1], [0 - 1])
   **/
  Slider2D.prototype.setNormalPosition = function (x, y) {
    this.processMouseTouch('', x * this.width, this.height - y * this.height);
  }

  /**
   *  RETURN SLIDER POSITION VALUE [0 - WIDTH], [0 - HEIGHT]
   **/
  Slider2D.prototype.getRealVal = function () {
    return {x: this.cvsPos.thisX, y: this.cvsPos.thisY};
  }

  /**
   *  RETURN NORMALIZED VALUE [0 - 1], [0 - 1]
   **/
  Slider2D.prototype.getNormalVal = function () {
    return this.normalVal;
  }



  /*******************************
   *  Joystick Extends Slider2D  *
   *******************************/
  function Joystick (params) {
    if (!params) return;
    Slider2D.call(this, params);
    if (!params.crosshairStyle) this.crosshairStyle = '#333333'; 
    else this.crosshairStyle = params.crosshairStyle;
  }
  Joystick.prototype = new Slider2D;

  /**
   *  SET VALUE ([0 - WIDTH], [0 - HEIGHT])
   **/
  Joystick.prototype.setRealPosition = function (x, y) {
    Slider2D.prototype.setRealPosition.call(this, x, y);
    this.notify({
      x: this.normalVal.x - 0.5,
      y: this.normalVal.y - 0.5
    });
  }

  /**
   *  @Override
   *  PROCESS MOUSE OR TOUCH COORDINATE DATA
   **/
  Joystick.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'mouseout' || 
        action == 'mouseup'  ||
        action == 'touchend'  )
    {
      this.isMigrating = true;
      this.migrate();
    }
    else {
      Slider2D.prototype.processMouseTouch.call(this, action, x, y);
    }
  }

  /**
   *  @Override
   **/
  Joystick.prototype.render = function () {
    Slider2D.prototype.render.call(this);
    var oldStyle = this.g2d.fillStyle;
    this.g2d.fillStyle = this.crosshairStyle;
    this.g2d.beginPath();
    this.g2d.moveTo(this.halfWidth, 0);
    this.g2d.lineTo(this.halfWidth, this.height);
    this.g2d.moveTo(0, this.halfHeight);
    this.g2d.lineTo(this.width, this.halfHeight);
    this.g2d.stroke();
    this.g2d.fillStyle = oldStyle;
    this.renderIsInQueue = false; 
  }

  /**
   *  WHEN MOUSE/FINGER IS LIFTED, ANIMATE BACK TO CENTER
   **/
  Joystick.prototype.migrate = function () {
    var magnitude = 0.3;
    var deltaX = 0 - (this.normalVal.x - 0.5);
    var deltaY = 0 - (this.normalVal.y - 0.5);
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    //if distance is greater than threshold
    //calculate vector toward center and migrate
    if (distance > 0.05) {
      var x = this.normalVal.x + (magnitude * deltaX);
      var y = this.normalVal.y + (magnitude * deltaY);
      this.setNormalPosition(x, y);
      var self = this;
      requestAnimationFrame(function () {
        self.migrate();
      });
    }
    //otherwise set position in center and stop animating
    else {
      this.setNormalPosition(0.5, 0.5);
      this.isMigrating = false;
    }
  }



  /********************************
   *  Knob Extends Canvas Object  *
   ********************************/
  function Knob (params) {
    if (!params) return;
    CanvasObject.call(this, params);
    
    if (!params.cssClass) {
      this.canvasEl.style.background = '#ffffff';
      this.canvasEl.style.border = '1px solid #333333';  
    }
    if (!params.radius) this.radius = this.width / 3;
    else this.radius = params.radius;
    if (!params.outline) this.outline = '#cccccc';
    else this.outline = params.outline;
    if (!params.fillStyle) this.fillStyle = '#333333';
    else this.fillStyle = params.fillStyle;

    this.realVal;
    this.theta = 0;
    this.notify = params.notify;
    this.minAngle = 0.75 * Math.PI;
    this.maxAngle = 0.25 * Math.PI;
    this.range = 1.5 * Math.PI;
    this.fillstyle = params.fillstyle;
    this.setSize(params.width, params.height);
    this.render();
  }
  Knob.prototype = new CanvasObject;

  /**
   *  @Override
   **/
  Knob.prototype.render = function () {
    //outer ring
    this.g2d.strokeStyle = this.outline;
    this.g2d.lineWidth = this.radius;
    this.g2d.beginPath();
    this.g2d.arc(this.halfWidth, this.halfHeight, this.radius, 
      this.minAngle, this.maxAngle);
    this.g2d.stroke();
    //inner ring
    this.g2d.strokeStyle = this.fillStyle;
    this.g2d.lineWidth = this.radius - 10;
    this.g2d.beginPath();
    this.g2d.arc(this.halfWidth, this.halfHeight, this.radius, 
      this.minAngle, this.theta);
    this.g2d.stroke();
    this.renderIsInQueue = false;
  }

  /**
   *  @Override
   **/
  Knob.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    x = x - this.halfWidth;
    y = y - this.halfHeight;
    var realValue;
    var theta = Math.atan(y / x);
    if (x < 0) {
      theta += Math.PI;
      realValue = theta - this.minAngle;
    }
    else {
      if (y < 0) {
        theta += 2 * Math.PI;
        realValue = theta - this.minAngle;
      }
      else {
        realValue = theta - this.minAngle + 2 * Math.PI;
      }
    }
    if (theta > this.maxAngle && theta < this.minAngle) return;
    realValue /= this.range;
    this.realVal = realValue;
    this.notify(realValue);
    this.theta = theta;
    this.requestRender();
  }

  /**
   *  RETURNS THE NORMALIZED VALUE [0 - 1]
   **/
  Knob.prototype.getVal = function () {
    return this.realVal;
  }

  /**
   *  SETS THE NORMALIZED VALUE [0 - 1]
   **/
  Knob.prototype.setVal = function (val) {
    if (val < 0 || val > 1) {
      throw 'valueOutOfBounds Exception, takes [0 - 1]';
      return;
    }
    this.realVal = val;
    //calculate theta
    var t = val * this.range;
    this.theta = t + this.minAngle;
    this.notify(val);
    this.requestRender();
  }



  /***************************************
   *  SliderField Extends Canvas Object  *
   ***************************************/
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
  SliderField.prototype = new CanvasObject;

  /*
   *  Set one normalized value in the slider field
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
   *  Set all normalized values in the slider field
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
   *  Get one normalized value in the slider field
   */
  SliderField.prototype.getVal = function (index) {
    if (index < 0 || index >= this.numSliders) {
      throw 'SliderField.setVal - indexOutOfBounds Exception';
      return;
    }
    return this.realVals[index];
  }

  /*
   *  Get all normalized values in the slider field - realVals array
   */
  SliderField.prototype.getVal = function () {
    return this.realVals;
  }


  /******************************************
   *  SliderFieldHoriz Extends SliderField  *
   ******************************************/
  function SliderFieldHoriz (params) {
    SliderField.call(this, params);
    this.sliderHeight = Math.floor(this.height / this.numSliders);
    this.render();
  } 
  SliderFieldHoriz.prototype = new SliderField;
  
  /**
   *  @Override
   **/
  SliderFieldHoriz.prototype.processMouseTouch = function (action, x, y) {
    if (action == 'touchend') return;
    //get slider index
    var index;
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



  /*******************************
   *                             *
   *          BUTTON             *
   *   unlike other objects,     *
   *   buttons are not extended  *
   *   from CanvasObj            *
   *                             *
   *******************************/
  var Button = function (params) {
    if (!params) return;
    this.val;
    this.notify;
    this.element;
    this.on;
    this.off;
    
    if (params.elementId) {
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

    if (params.on) {
      this.on = params.on;
    } else {
      throw 'pram object needs on attributes';
    }

    if (params.off) {
      this.off = params.off;
    } else {
      throw 'pram object needs off attributes';
    }

    if (params.cssClassName) {
      this.setClass(params.cssClassName);
    }

    if (params.css) {
      for (var key in params.css) {
        this.element.style[key] = params.css[key];
      }
    } 
    this.createListeners(this);
  }

  Button.prototype = {
    
    /**
     *  Add listeners for button objects
     **/
    createListeners: function (self) {
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
    },

    /**
     *  RENDER FUNCITON FOR ALL SUBCLASSES
     **/  
    render: function (val) {
      if (val) {

        for (var key in this.on) {
          if (key == 'textContent') {
            this.element[key] = this.on[key];
          } else {
            this.element.style[key] = this.on[key];
          }
        }

      } 
      else {

        for (var key in this.off) {
          if (key == 'textContent') {
            this.element[key] = this.off[key];
          } else {
            this.element.style[key] = this.off[key];   
          }
        }

      }
    },

    /**
     *  SETS THE CSS CLASS OF THE BUTTON
     **/
    setClass: function (className) {
      if (className == null) {
        console.log('error: no class given');
        return; 
      }   
      this.element.classList.add(className);
    },

    /**
     *  SUBCLASS MUST IMPLEMENT PROCESS ACTION
     **/
    processAction: function () {}

  };

  

  /********************************************
  *       TOGGLE BUTTON EXTENDS BUTTON        *
  *********************************************/
  function ToggleButton (params) {
    Button.call(this, params);
    if (params.val) {
      this.setVal(params.val);
    } else {
      this.setVal(false);
    }
  } 
  ToggleButton.prototype = new Button;
  
  /**
   *  @Override
   **/
  ToggleButton.prototype.processAction = function () {
    this.val = !this.val;
    this.notify(this.val);
    this.render(this.val);
  }

  /**
   *  Set the value of the button, takes a boolean parameter
   **/
  ToggleButton.prototype.setVal = function (val) {
    this.val = val;
    this.notify(this.val);
    this.render(this.val);
  }

  /**
   *  Returns the value of the button - a boolean value
   **/
  ToggleButton.prototype.getVal = function () {
    return this.val;
  }


  /********************************************
  *      TRIGGER BUTTON EXTENDS BUTTON        *
  *********************************************/
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
  TriggerButton.prototype = new Button;
  
  /**
   *  TRIGGERS THE BUTTON
   **/
  TriggerButton.prototype.processAction = function () {
    this.notify();
    //turn on
    this.render(true);
    clearTimeout(this.timeout);
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
  TouchLib.Slider2D = Slider2D;
  TouchLib.Joystick = Joystick;
  TouchLib.Knob = Knob;
  TouchLib.SliderFieldHoriz = SliderFieldHoriz;
  TouchLib.SliderFieldVert = SliderFieldVert;
  window.TouchLib = TouchLib;

})(window);
