var Radial = require('../../layout/Radial')
var Bar = require('../bar')

module.exports = function ray(config, data) {
  //Set defaults
  var domain = config.domain || [0,0]
    , range = config.range || [0,0] //pixels from center
    , dashed = config.dashed || 1 //unbroken line
    , startValuer
    , endValuer
  
  var pixelScaler = d3.scale.linear()
    .domain(domain)
    .range(range)

  if (_.isFunction(config.value)) {
    startValuer = d3.functor(domain[0] || 0)
    endValuer = d3.functor(config.value || 0)
  } else {
    startValuer = d3.functor(config.value.start || 0)
    endValuer = d3.functor(config.value.end || 0)
  }

  var radiuser1 = function (d) { return pixelScaler(startValuer(d)) }
  var radiuser2 = function (d) { return pixelScaler(endValuer(d)) }

  var layoutConfig = _.extend({}, config, {
    range: config.positionRange,
    radius: radiuser1,
  })

  var pixelPerDomainUnit = (range[1]-range[0])/(domain[1]-domain[0])
  config.dashed = [pixelPerDomainUnit * dashed, pixelPerDomainUnit * (1 -dashed)]

  var radialLayout = Radial(layoutConfig)
  radialLayout(data)
  _.each(data, function (d) { d.x0 = d.x; d.y0 = d.y })

  radialLayout.radius(radiuser2)
  radialLayout(data)

  Bar(config, data)
}
