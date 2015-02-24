var Radial = require('../src/layout/Radial')
module.exports = function barChart(config, _data) {
  //Set defaults
  var name = 'bar' + config.name || ''
    , dashed = config.dashed || ''
    , color = config.color || ''

  var radialLayout = Radial(config)
  radialLayout(_data)
  _.each(_data, function (d) { d.x0 = d.x; d.y0 = d.y })
  radialLayout.radius(config.radius2)
  radialLayout(_data)

  var self = config.target.append('g').attr('id', name + 'Group')
      .selectAll('.' + name)
      .data(_data)
  self
    .enter()
    .append('path')
    .attr('class', name)
    //.attr('stroke', 'url(#grad1)')
    .attr('stroke-dasharray', dashed)
    .attr('d', bar)
    .style('stroke', color)

  function bar(d) { return 'M' + d.x0 + ' ' + d.y0 + 'L' + d.x + ' ' + d.y; }
}
