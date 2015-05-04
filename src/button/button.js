

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
        if (!this.element) {
          throw 'cannot build button: param object needs an elementId';
        }
      } catch (err) {
        console.log('err getting element');
      }
    } else {
      throw 'cannot build button: param object needs an elementId';
    }

    if (typeof(params.notify) === 'function') {
      this.notify = params.notify;
    } else {
      throw 'button constructor needs an notify function to be useful';
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
        throw 'error creating mouse listener';
      }
      try {
        self.element.addEventListener('touchstart', function (e) {
          e.preventDefault();
          self.processAction();
        }, false);
      } catch (err) {
        throw 'error creating touch listener'; 
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
      if (className == null) throw 'Button error: no class given';  
      this.element.classList.add(className);
    },

    /**
     *  SUBCLASS MUST IMPLEMENT PROCESS ACTION
     **/
    processAction: function () {}

  };

  
