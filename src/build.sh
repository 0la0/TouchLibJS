#!/bin/bash

files=" meta/header.js"
files+=" meta/canvasObj.js"
files+=" slider/slider.js"
files+=" slider/verticalSlider.js"
files+=" slider/horizontalSlider.js"
files+=" slider/discreteVerticalSlider.js"
files+=" slider/discreteHorizontalSlider.js"
files+=" slider2d/slider2d.js"
files+=" slider2d/joystick.js"
files+=" knob/knob.js"
files+=" sliderField/sliderField.js"
files+=" sliderField/sliderFieldHorizontal.js"
files+=" sliderField/sliderFieldVertical.js"
files+=" button/button.js"
files+=" button/toggleButton.js"
files+=" button/triggerButton.js"
files+=" meta/footer.js"

cat $files > ../touchLib.js

uglifyjs ../touchLib.js -o ../touchLib.min.js -c -m