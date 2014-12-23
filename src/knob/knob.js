

  /********************************
   *  Knob Extends Canvas Object  *
   ********************************/
  Knob.prototype = new CanvasObject();
  Knob.prototype.constructor = Knob;
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

  Knob.prototype.getVal = function () {
    return this.realVal;
  }

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

