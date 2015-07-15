module.exports = function bar(config, data) {
  //Set defaults
  var className = 'bar'
    , name = config.name || ''
    , dashed = config.dashed || ''
    , color = config.color || ''
    , key = config.key || undefined

  var self = config.target.append('g')
    .classed(className + 'Group', true)
    .classed(name, true)
    .selectAll('.' + className)
    .data(data, key)

  var enter = self.enter()
  enter.append('path')
    .attr('class', className)
    //.attr('stroke', 'url(#grad1)')
    .attr('stroke-dasharray', dashed)
    .attr('d', bar)
    .style('stroke', color)
  if (key) enter.attr(id, function (d) { return d.id })

  function bar(d) { return 'M' + d.x0 + ' ' + d.y0 + 'L' + d.x + ' ' + d.y; }
}
