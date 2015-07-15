module.exports = function graph(config, data) {
  //Set defaults
  var className = 'graph'
  , name = config.name || ''
  , tension = config.tension || 0.7
  , interpolate = config.interpolate || 'basis'

  var self = config.target.append('g')
    .classed(className + 'Group', true)
    .classed(name, true)

  var curve = d3.svg.line()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    .tension(tension)
    .interpolate(interpolate)

  self
    .append('path')
    .datum(data)
    .classed(className, true)
    .attr('d', curve)
}
