module.exports = function graph(config, data) {
  //Set defaults
  var name = 'graph' + config.name || ''
  , tension = config.tension || 0.7
  , interpolate = config.interpolate || 'basis'

  var self = config.target.append('g').attr('id', name + 'Group')

  var curve = d3.svg.line()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    .tension(tension)
    .interpolate(interpolate)

  self
    .append('path')
    .datum(data)
    .attr('class', name)
    .attr('d', curve)
}
