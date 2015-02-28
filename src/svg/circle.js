module.exports = function circle(config, data) {
  //Set defaults
  var name = 'circle' + config.name || ''

  var self = config.target.append('g').attr('id', name + 'Group')
    .selectAll('.' + name)
    .data(data)
  self
    .enter()
    .append('circle')
    .attr('class', name)
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
    .attr('r', config.size)
    .style('fill', function (d) { return d.color })
}
