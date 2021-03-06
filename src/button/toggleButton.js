
  /********************************************
  *       TOGGLE BUTTON EXTENDS BUTTON        *
  *********************************************/
  function ToggleButton (params) {
    Button.call(this, params);
    params.val = params.val || false;
    this.setVal(params.val);
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

