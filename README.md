#TouchLibJS
UI toolkit for mouse and touch.

####Dependencies
HTML5 browser

#TouchLib Objects and Usage

###Vertical Slider
TouchLib.VertSlider

![alt tag](readmeImages/verticalSlider.jpg)

Instantiation:
```javascript
var vertSlider = TouchLib.VertSlider({
  //DOM element the slider will be created in (required)
  elementId: 'vSliderDOMelement',
  //Text label for the slider (optional)
  label: 'aLabel',
  //Color of the active slider region, CSS formatted (optional)
  fillstyle: '#3366dd',
  //Width of the slider in pixels (optional)
  width: 40,
  //Height of the slider in pixels (optional)
  height: 200,
  //Initial value of the slider \[0 - 1\] (optional)
  initVal: 0.0,
  //Boolean value, true allows developer to map a different
  //range to output text (optional)
  outputIsOverridden: false,
  //Slider CSS attributes (optional)
  sliderCss: {
    background: '#444477',
    border: '2px solid #0033cc',
    borderRadius: '4px',
  },
  //Notifiy funtion gets called when value changes (required)
  //parameter 'val' is a normalized value \[0 - 1\]
  notify: function (val) {
    console.log('vertSlider1 val:', val);
  }
});
```
VertSlider Methods:
```javascript
vertSlider.getVal(); //returns the normalized value \[0 - 1\]
vertSlider.setValue(Number); //accepts a normalized value \[0 - 1\]
vertSlider.setClass(String); //sets the css class of the slider elements
```
[Usage example](demo/verticalSliderDemo.html)

###Horizontal Slider
![alt tag](readmeImages/horizontalSlider.jpg)
[Usage example](demo/horizontalSliderDemo.html)

###Discrete Vertical Slider
![alt tag](readmeImages/verticalDiscreteSlider.jpg)
[Usage example](demo/discreteVerticalSliderDemo.html)

###Discrete Horizontal Slider
![alt tag](readmeImages/horizontalDiscreteSlider.jpg)
[Usage example](demo/discreteHorizontalSliderDemo.html)

###Slider2D
![alt tag](readmeImages/slider2d.jpg)
[Usage example](demo/slider2dDemo.html)

###Joystick
![alt tag](readmeImages/joystick.jpg)
[Usage example](demo/joystickDemo.html)

###Knob
![alt tag](readmeImages/knob.jpg)
[Usage example](demo/knobDemo.html)

###Vertical Slider Field
![alt tag](readmeImages/verticalSliderField.jpg)
[Usage example](demo/sliderFieldDemo.html)

###Horizontal Slider Field
![alt tag](readmeImages/horizontalSliderField.jpg)
[Usage example](demo/sliderFieldDemo.html)

###Toggle Button
![alt tag](readmeImages/toggleButton.jpg)
[Usage example](demo/toggleButtonDemo.html)

###Trigger Button
[Usage example](demo/triggerButtonDemo.html)