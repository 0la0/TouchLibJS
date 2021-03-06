
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
        }
      } catch (err) {
        throw 'err creating canvas element';
      }
    } else {
      throw 'cannot build object: param object needs an elementId';
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

  