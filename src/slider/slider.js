
  /**********************************
   *                                *
   *  Slider Extends Canvas Object  *
   *                                *
   **********************************/
  function Slider (params) {
    if (!params) return;
    
    if (typeof(params.notify) === 'function') {
      this.notify = params.notify;
    } else {
      throw 'constructor needs a notify function to be useful';
      return;
    }
    
    params.label = params.label || '';
    params.fillstyle = params.fillstyle || '#666666'; 

    if (!params.width) {
      this instanceof VertSlider ? params.width = 20 : params.height = 100;
    }
    if (!params.height) {
      this instanceof VertSlider ? params.height = 100 : params.height = 20;
    }
    if (params.noOutput) {
      params.outputIsOverridden = true;
      this.noOutput = true;
    }
    if (params.outputIsOverridden) {
      this.outputIsOverridden = params.outputIsOverridden;
    } else {
      this.outputIsOverridden = false;
    }
    if (params.label) {
      this.labelEl = document.createElement('div');
    }
    if (!params.noOutput) {
      this.outputEl = document.createElement('div');
    }

    CanvasObject.call(this, params);

    if (params.label) {
      this.labelEl.appendChild(document.createTextNode(params.label));
      this.parentEl.insertBefore(this.labelEl, this.canvasEl);
    }

    if (!params.noOutput) {
      this.parentEl.appendChild(this.outputEl);
    }
    
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
    
    if (params.cssClass) {
      this.setClass(params.cssClass);
    }

    params.initVal = params.initVal || 0;
    this.setValue(params.initVal);
  }
  Slider.prototype = new CanvasObject;

  /**
   *  @Override
   *  SETS THE CSS CLASS OF THE SLIDER ELEMENTS
   **/
  Slider.prototype.setClass = function (className) {
    if (!className) {
      throw 'slider set class error: no class given';
      return; 
    }
    CanvasObject.prototype.setClass.call(this, className);
    
    if (this.labelEl) this.labelEl.classList.add(className);
    if (!this.noOutput) this.outputEl.classList.add(className);
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

