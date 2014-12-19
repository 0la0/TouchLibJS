
    //----------------------------------------//
   //    TRIGGER BUTTON EXTENDS BUTTON       //
  //----------------------------------------//
  TriggerButton.prototype = new Button();
  TriggerButton.prototype.constructor = TriggerButton;
  function TriggerButton (params) {
    Button.call(this, params);
    this.timeout;
    this.timeoutTime;
    if (!isNaN(params.triggerTimeout)) {
      this.timeoutTime = params.triggerTimeout;
    } else {
      throw 'constructor error: need a numeric timeout parameter';
      return;
    }
    this.render(false);
  } 

  TriggerButton.prototype.processAction = function () {
    this.notify();
    //turn on
    this.render(true);
    clearTimeout(this.timeout);
    var self = this;
    this.timeout = setTimeout(function () {
      //turn off
      self.render(false);
    }, self.timeoutTime);
  }
