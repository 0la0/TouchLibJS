#TouchLibJS
UI toolkit for mouse and touch.
___
####Dependencies
HTML5 browser

___

#TouchLib Objects and Usage
###Vertical Slider (TouchLib.VertSlider)

![alt tag](readmeImages/verticalSlider.jpg)

Instantiation:
```javascript
var vertSlider = new TouchLib.VertSlider({
  //DOM element in which the slider will be created (required)
  elementId: 'vSliderDOMelement',
  //Text label for the slider (optional)
  label: 'Label',
  //Color of the active slider region, CSS formatted (optional)
  fillstyle: '#3366dd',
  //Width of the slider in pixels (optional)
  width: 40,
  //Height of the slider in pixels (optional)
  height: 200,
  //Initial value of the slider [0 - 1], (optional)
  initVal: 0.0,
  //Boolean value, a truthy value allows developer to map a 
  //different range to output text (optional)
  outputIsOverridden: false,
  //Slider CSS attributes (optional)
  sliderCss: {
    background: '#444477',
    border: '2px solid #0033cc',
    borderRadius: '4px',
  },
  //Notifiy funtion gets called when value changes (required)
  //parameter 'val' is a normalized value [0 - 1]
  notify: function (val) {
    console.log('vertSlider1 val:', val);
  }
});
```
VertSlider Methods:
```javascript
vertSlider.getVal(); //returns the normalized value [0 - 1]
vertSlider.setValue(Number); //accepts a normalized value [0 - 1]
vertSlider.setClass(String); //sets the css class of the slider elements
```
[Vertical Slider Usage example](demo/verticalSliderDemo.html)
___

###Horizontal Slider (TouchLib.HorizSlider)

![alt tag](readmeImages/horizontalSlider.jpg)

Instantiation:
```javascript
var horizSlider = new TouchLib.HorizSlider({
  //DOM element in which the slider will be created (required)
  elementId: 'hSlider3',
  //Text label for the slider (optional)
  label: 'Label',
  //Color of the active slider region, CSS formatted (optional)
  fillstyle: '#3366dd',
  //Width of the slider in pixels (optional)
  width: 200,
  //Height of the slider in pixels (optional)
  height: 40,
  //Initial value of the slider [0 - 1], (optional)
  initVal: 1.0,
  //Boolean value, a truthy value allows developer to map a 
  //different range to output text (optional)
  outputIsOverridden: false,
  //CSS class name of slider elements (optional)
  cssClass: 'horizSliderClass',
  //Slider CSS attributes (optional)
  sliderCss: {
    background: '#444477',
    border: '2px solid #0033cc',
    borderRadius: '4px',
  },
  //Notifiy funtion gets called when value changes (required)
  //parameter 'val' is a normalized value [0 - 1]
  notify: function (val) {
    console.log('hSlider3 val:', val);
  }
});
```
HorizSlider Methods:
```javascript
horizSlider.getVal(); //returns the normalized value [0 - 1]
horizSlider.setValue(Number); //accepts a normalized value [0 - 1]
horizSlider.setClass(String); //sets the css class of the slider elements
```
[Horizontal Slider Usage example](demo/horizontalSliderDemo.html)
___
###Discrete Vertical Slider (TouchLib.DiscreteVertSlider)

![alt tag](readmeImages/verticalDiscreteSlider.jpg)

The constructor JSON parameter is very similar to TouchLib.VertSlider.  Therefore only unique parameters are commented here.
Instantiation:
```javascript
var dvSlider = new TouchLib.DiscreteVertSlider({
  elementId: 'parentElementID',
  label: 'Label',
  fillstyle: '#3366dd',
  width: 40,
  height: 200,
  //CSS formated color for the lines between bins
  binBorderColor: '#2222cc',
  //the number of bins the discrete slider will have
  numBins: 6,
  //note outputIsOverriden has a truthy value,
  //and is directly related to the innerHTML
  //statement in the notification function
  outputIsOverridden: true,
  initVal: 0,
  sliderCss: {
    background: '#444477',
    border: '2px solid #0033cc',
    borderRadius: '4px',
  },
  //returns the bin index
  //gets called when the bin index changes
  notify: function (val) {
    this.outputEl.innerHTML = val;
    console.log('dvSlider1 val: ', val);
  }
});
```
DiscreteVertSlider Methods:
```javascript
dvSlider.getVal() //return the active bin index
dvSlider.setBin() //set the active bin index
dvSlider.setClass(String); //sets the css class of the slider elements
```
[Discrete Vertical Slider Usage example](demo/discreteVerticalSliderDemo.html)
___

###Discrete Horizontal Slider (TouchLib.DiscreteHorizSlider)

![alt tag](readmeImages/horizontalDiscreteSlider.jpg)

The constructor JSON parameter is very similar to TouchLib.VertSlider.  Therefore only unique parameters are commented here.
Instantiation:
```javascript
var dhSlider = new TouchLib.DiscreteHorizSlider({
  elementId: 'parentElementID',
  label: 'Label',
  fillstyle: '#3366dd',
  width: 200,
  height: 40,
  //CSS formated color for the lines between bins
  binBorderColor: '#2222cc',
  //the number of bins the discrete slider will have
  numBins: 6,
  outputIsOverridden: true,
  initVal: 0,
  cssClass: 'horizSliderClass',
  sliderCss: {
    background: '#444477',
    border: '2px solid #0033cc',
    borderRadius: '4px',
  },
  //returns the bin index
  //gets called when the bin index changes
  notify: function (val) {
    this.outputEl.innerHTML = val;
    console.log('hvSlider1 val: ', val);
  }
});
```
DiscreteHorizSlider Methods:
```javascript
dhSlider.getVal() //return the active bin index
dhSlider.setBin() //set the active bin index
dhSlider.setClass(String); //sets the css class of the slider elements
```
[Discrete Horizontal Slider Usage example](demo/discreteHorizontalSliderDemo.html)
___

###Slider2D
![alt tag](readmeImages/slider2d.jpg)
[Usage example](demo/slider2dDemo.html)

___

###Joystick
![alt tag](readmeImages/joystick.jpg)
[Usage example](demo/joystickDemo.html)

___

###Knob
![alt tag](readmeImages/knob.jpg)
[Usage example](demo/knobDemo.html)

___

###Vertical Slider Field
![alt tag](readmeImages/verticalSliderField.jpg)
[Usage example](demo/sliderFieldDemo.html)

___

###Horizontal Slider Field
![alt tag](readmeImages/horizontalSliderField.jpg)
[Usage example](demo/sliderFieldDemo.html)

___

###Toggle Button
![alt tag](readmeImages/toggleButton.jpg)
[Usage example](demo/toggleButtonDemo.html)

___

###Trigger Button
[Usage example](demo/triggerButtonDemo.html)