

  /************************************
   *  Slider2D Extends Canvas Object  *
   ************************************/
  Slider2D.prototype = new CanvasObject();
  Slider2D.prototype.constructor = Slider2D;
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

