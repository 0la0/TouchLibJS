
  /************************************************
   *  Parent object for all canvas based widgets  *
   ************************************************/
  function CanvasObject (params) {
    if (params == undefined) return;
    if (params.elementId != undefined) {
      try {
        this.parentEl = document.getElementById(params.elementId);
        if (this.parentEl == null) {
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

    this.canvasEl = document.createElement('canvas');
    this.parentEl.appendChild(this.canvasEl);

    this.g2d = this.canvasEl.getContext('2d');
    this.setSize(params.width, params.height);
    this.g2d.clearRect(0, 0, this.width, this.height);
  }

  /**
   *  SET THE SIZE OF THE CANVAS ELEMENT
   **/
  CanvasObject.prototype.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.halfWidth = Math.round(width / 2);
    this.halfHeight = Math.round(height / 2);
    this.canvasEl.width = width;
    this.canvasEl.height = height;
    this.g2d.width = this.canvasEl.width;
    this.g2d.height = this.canvasEl.height;
  }

