module.exports = function bar(config, data) {
  //Set defaults
  var name = 'bar' + config.name || ''
    , dashed = config.dashed || ''
    , color = config.color || ''
    , key = config.key || undefined

  var self = config.target.append('g').attr('id', name + 'Group')
    .selectAll('.' + name)
    .data(data, key)
  var enter = self.enter()
  enter.append('path')
    .attr('class', name)
    //.attr('stroke', 'url(#grad1)')
    .attr('stroke-dasharray', dashed)
    .attr('d', bar)
    .style('stroke', color)
  if (key) enter.attr(id, function (d) { return d.id })

  function bar(d) { return 'M' + d.x0 + ' ' + d.y0 + 'L' + d.x + ' ' + d.y; }
}
