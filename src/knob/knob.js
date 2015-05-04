

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
    
    params.radius = params.radius || this.width / 3;
    this.radius = params.radius;
    
    params.outline = params.outline || '#cccccc';
    this.outline = params.outline;
    
    params.fillStyle = params.fillStyle || '#333333';
    this.fillStyle = params.fillStyle;
    
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
    if (action === 'touchend') return;
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
    }
    this.realVal = val;
    //calculate theta
    var t = val * this.range;
    this.theta = t + this.minAngle;
    this.notify(val);
    this.requestRender();
  }

