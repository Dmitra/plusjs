var Radial = require('../src/layout/Radial')
module.exports = function barChart(config, data) {
  var radialLayout = Radial(config)
  radialLayout(data)

  //svg path calculation to draw labels upon
  var arc = d3.svg.arc()
    .startAngle(function(d) { return radialLayout.toRad(d) })
    //length of arc is half of a circle
    .endAngle(function(d) { return radialLayout.toRad(d) + Math.PI})
    .outerRadius(function (d) {
      return d.radius || config.radius
    })

  function generateId(d) {
    return 'ltp' + d.label.replace(' ', '').replace('\n', '')
  }
  var textPath = config.target.append('g').selectAll('.labelTextPath')
    .data(data)
    .enter()
    .append('defs')
    .append('path')
    .attr('id', generateId)
    .attr('class', 'labelTextPath')
    .attr('d', arc)

  var self = config.target.append('g')
    .attr('transform', 'translate(' + radialLayout.center()[0] + ',' + (radialLayout.center()[1]) + ')')
    .selectAll('.label' + config.name)
    .data(data)
  self
    .enter()
    .append('text')       
    .attr('class', 'label' + config.name)
    .append('textPath')
    .attr('xlink:href', function (d) { return '#' + generateId(d) })
    //render multiline labels
    .each(function (d) {
      var arr = d.label.split('\n')
      if (arr != undefined) {
        for (i = 0; i < arr.length; i++) {
          d3.select(this).append('tspan')
            .text(arr[i])
            .attr('text-anchor', 'start')
            .attr('dy', i ? '1.2em' : 0)
            .attr('x', 0)
            .attr('class', 'tspan' + i)
        }
      }
    })

}
