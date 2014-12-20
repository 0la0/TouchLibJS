

  /*******************************
   *  Joystick Extends Slider2D  *
   *******************************/
  Joystick.prototype = new Slider2D();
  Joystick.prototype.constructor = Joystick;
  function Joystick (params) {
    if (!params) return;
    Slider2D.call(this, params);
    if (!params.crosshairStyle) this.crosshairStyle = '#333333'; 
    else this.crosshairStyle = params.crosshairStyle;
  }

  /**
   *  SET VALUE [0 - WIDTH and HEIGHT]
   **/
  Joystick.prototype.setRealPosition = function (x, y) {
    Slider2D.prototype.setRealPosition.call(this, x, y);
    this.notify({
      x: this.normalVal.x - 0.5,
      y: this.normalVal.y - 0.5
    });
  }

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
   *  CALL SUPER AND THEN RENDER CROSSHAIRS
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

