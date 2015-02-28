module.exports = function radialGridLine(config) {
  //Set defaults
  var name = 'gridLine' + config.name || ''
    , sectorSize = config.sectorSize || 0
    , domain = config.domain || [0,0]
    , range = config.range || [0,0]
    , center = config.center || [200,200]

  var pixelScale = d3.scale.linear()
    .domain(domain)
    .range(range)

  var ticks = pixelScale
    .ticks(config.domain[1]/config.step)
    .map(function (d) { return pixelScale(d) })
    

  config.target.append('g').selectAll('.' + name)
    .data(ticks)
    .enter()
    .append('circle')
    .attr('class', name)
    .attr('r', function (d) { return d })
    .attr('cx', center[0])
    .attr('cy', center[1])
    .attr('stroke-dasharray', function (d) {
      var arcLength = 2 * Math.PI * d / config.sectors
      return [arcLength * sectorSize, arcLength * (1 - sectorSize)].toString()
    })
}
