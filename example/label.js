var Util = require('../src/core/Util')
var Radial = require('../src/layout/Radial')
module.exports = function barChart(config, data) {
  //Set defaults
  var name = 'label' + config.name || ''
    , radius = config.radius || 110
    , color = config.color || ''

  var radialLayout = Radial(config)
  radialLayout(data)

  //svg path calculation to draw labels upon
  var arc = d3.svg.arc()
    .startAngle(function(d) { return radialLayout.toRad(d) })
    //length of arc is half of a circle
    .endAngle(function(d) { return radialLayout.toRad(d) + Math.PI})
    .outerRadius(radius)

  var textPath = config.target.append('g')
    .selectAll('.labelTextPath')
    .data(data)
    .enter()
    .append('defs')
    .append('path')
    .attr('id', function (d) { d.id = Util.GUID(); return d.id })
    .attr('class', 'labelTextPath')
    .attr('d', arc)

  var self = config.target.append('g')
    .attr('transform', 'translate(' + radialLayout.center()[0] + ',' + (radialLayout.center()[1]) + ')')
    .selectAll('.' + name)
    .data(data)
  self
    .enter()
    .append('text')       
    .attr('class', name)
    .append('textPath')
    .attr('xlink:href', function (d) { return '#' + d.id })
    //render multiline labels
    .each(function (d) {
      var arr = d.label.split('\n')
      if (arr != undefined) {
        for (i = 0; i < arr.length; i++) {
          d3.select(this)
            .append('tspan')
            .text(arr[i])
            .attr('dy', i ? '1.2em' : 0)
            .attr('x', 0)
            .attr('class', 'tspan' + i)
        }
      }
    })

}
