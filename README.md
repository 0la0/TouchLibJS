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
var vertSlider = TouchLib.VertSlider({
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
[Usage example](demo/verticalSliderDemo.html)
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
[Usage example](demo/horizontalSliderDemo.html)
___
###Discrete Vertical Slider
![alt tag](readmeImages/verticalDiscreteSlider.jpg)
[Usage example](demo/discreteVerticalSliderDemo.html)

___

###Discrete Horizontal Slider
![alt tag](readmeImages/horizontalDiscreteSlider.jpg)
[Usage example](demo/discreteHorizontalSliderDemo.html)

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