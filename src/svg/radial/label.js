var Radial = require('../../layout/Radial')
var Label = require('../label')
module.exports = function radialLabel(config, data) {
  //Set defaults
  var radius = config.radius || 100

  var layout = Radial(config)
  layout(data)

  //svg path calculation to draw labels upon
  config.textPath = d3.svg.arc()
    .startAngle(function(d) { return d.rad })
    //length of arc is half of a circle
    .endAngle(function(d) { return d.rad + Math.PI})
    .outerRadius(radius)
  config.center = layout.center()

  Label(config, data)
}
