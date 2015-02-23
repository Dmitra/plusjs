var Radial = require('../src/layout/Radial')
module.exports = function arcChart(config, _data) {
  var radialLayout = Radial(config)
  radialLayout(_data)
  var arc = d3.svg.arc()
      .startAngle(function(d) { return radialLayout.toRad(d) })
      .endAngle(function(d) {
        return d !== _.last(_data) ? radialLayout.toRad(_data[_data.indexOf(d) + 1]) : 2 * Math.PI
      })
      .innerRadius(config.innerRadius)
      .outerRadius(config.innerRadius + config.radius)

  var self = config.target.append('g').attr('id', 'arcGroup' + config.name)
      //Move to center
      .attr('transform', 'translate(' + radialLayout.center()[0] + ',' + (radialLayout.center()[1]) + ')')
      .selectAll('.arc' + config.name)
      .data(_data)
  self
      .enter()
      .append('path')
      .attr('class', 'arc' + config.name)
      .attr('d', arc)
      .style('fill', function(d) { return config.color(d) })

  return self
}

