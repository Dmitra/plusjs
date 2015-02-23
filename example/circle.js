var Radial = require('../src/layout/Radial')
module.exports = function circleChart(config, _data) {
  var radialLayout = Radial(config)
  radialLayout(_data)
  var self = config.target.append('g').attr('id', 'circleGroup' + config.name)
      .selectAll('.circle' + config.name)
      .data(_data)
  self
    .enter()
    .append('circle')
    .attr('class', 'circle' + config.name)
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', config.circleSize)
    .style('fill', function (d) { return d.color })

  return self
}

