
    //----------------------------------------//
   //     TOGGLE BUTTON INHERITS BUTTON      //
  //----------------------------------------//
  ToggleButton.prototype = new Button();
  ToggleButton.prototype.constructor = ToggleButton;
  function ToggleButton (params) {
    Button.call(this, params);
    //this.otherMethodCalls();
    //this.registerListeners(this);
    if (params.val != undefined) {
      this.setVal(params.val);
    } else {
      this.setVal(false);
    }
  } 

  ToggleButton.prototype.processAction = function () {
    this.val = !this.val;
    this.notify(this.val);
    this.render(this.val);
  }

  ToggleButton.prototype.setVal = function (val) {
    this.val = val;
    this.notify(this.val);
    this.render(this.val);
  }

  ToggleButton.prototype.getVal = function () {
    return this.val;
  }

