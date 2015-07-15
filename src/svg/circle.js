module.exports = function circle(config, data) {
  //Set defaults
  var className = 'circle'
  , name = config.name || ''

  var self = config.target.append('g')
    .classed(className + 'Group', true)
    .classed(name, true)
    .selectAll('.' + className)
    .data(data)

  self
    .enter()
    .append('circle')
    .classed(className, true)
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', config.size)
    .style('fill', function (d) { return d.color })
}
