var Radial = require('../src/layout/Radial')
module.exports = function barChart(config, _data) {
  var radialLayout = Radial(config)
  radialLayout(_data)
  _.each(_data, function (d) { d.x0 = d.x; d.y0 = d.y })
  radialLayout.radius(config.radius2)
  radialLayout(_data)
  var self = config.target.append('g').attr('id', 'barGroup' + config.name)
      .selectAll('.bar' + config.name)
      .data(_data)
  self
    .enter()
    .append('path')
    .attr('class', 'bar' + config.name)
    //.attr('stroke', 'url(#grad1)')
    .attr('stroke-dasharray', config.dashed)
    .attr('d', bar)
    .style('stroke', function (d) { return d.color})

  function bar(d) { return 'M' + d.x0 + ' ' + d.y0 + 'L' + d.x + ' ' + d.y; }
}
