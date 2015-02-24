var Radial = require('../src/layout/Radial')
module.exports = function arcChart(config, _data) {
  //Set defaults
  var name = 'arc' + config.name || ''
    , innerRadius = config.innerRadius || 100
    , radius = config.radius || 110
    , color = config.color || ''

  var radialLayout = Radial(config)
  radialLayout(_data)
  var arc = d3.svg.arc()
      .startAngle(function(d) { return radialLayout.toRad(d) })
      .endAngle(function(d) {
        return d !== _.last(_data) ? radialLayout.toRad(_data[_data.indexOf(d) + 1]) : 2 * Math.PI
      })
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + radius)

  var self = config.target.append('g').attr('id', name + 'Group')
      //Move to center
      .attr('transform', 'translate(' + radialLayout.center()[0] + ',' + (radialLayout.center()[1]) + ')')
      .selectAll('.' + name)
      .data(_data)

  self
      .enter()
      .append('path')
      .attr('class', name)
      .attr('d', arc)
      .style('fill', color)
}

