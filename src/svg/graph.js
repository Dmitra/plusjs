var Radial = require('../src/layout/Radial')
module.exports = function graph(config, _data) {
  var radialLayout = Radial(config)
  radialLayout(_data)
  var self = config.target.append('g').attr('id', 'graphGroup' + config.name)

  var curve = d3.svg.line()
    .x(function (d) { return d.x})
    .y(function (d) { return d.y})
    .tension(config.tension)
    .interpolate(config.interpolate)

  self
    .append('path')
    .datum(_data)
    .attr('class', 'graph' + config.name)
    .attr('d', curve)
}
