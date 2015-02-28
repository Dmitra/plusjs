require('../../node_modules/d3-transform/src/d3-transform')
var rayDraw = require('../../src/svg/radial/ray')
var gridLine = require('../../src/svg/radial/gridLine')
var cubehelix = require('../../lib/cubehelix')

var width = 800, height = 800;
var container = d3.select('chart')
var vis = d3.select('#chart>svg')
  .attr('width', width)
  .attr('height', height)

//Data
d3.csv('data/2014_USW00023234.csv', function (data) {
  Data = data

  //TODO use crossfilter for RAW data
  //Transform ghcn data excerpt
  //w = {}
  //data.map(function (d) {
  //w[d.date] = w[d.date] || {}
  //w[d.date].date = d.date
  //w[d.date][d.attr] = parseInt(d.value)
  //})
  //var a = d3.csv.format(_.toArray(w))

  var dateFormatter = d3.time.format('%Y%m%d')
  //Options for the chart, other than default
  var config = {
    target: vis,
    size: [width, height],
  }
  var positionScaler = d3.time.scale()
    .domain([dateFormatter.parse(data[0].DATE), dateFormatter.parse(_.last(data).DATE)])
    .range([0,365])
  //TODO set individual temperature color scale (pick color for range
  //[cruel cold, ?, frosty, cold, cool, comfort, hot, super hot]
  //[-26--18, -18--10, -10--2, 2-10, 10-18, 18-26, 26-34, 34-42
  var scaleTemp2Hue = d3.scale.linear()
    .domain([-20, 35])
    .range([250,0])//[d3.rgb(0, 48, 112), d3.rgb(201, 28, 13)])
  var tempPainter = function (d) {
    return d3.hsl(scaleTemp2Hue(d), 1, .45).rgb().toString()
    //return d3.hcl(scaleTemp2Hue(d), 150, 75).rgb().toString()
  }
  //var tempPainter = cubehelix()
      //.domain([5, 20, 40])
      //.range([
        //d3.hsl( 260, 0.75, 0.35),
        //d3.hsl(  80, 1.50, 0.80),
        //d3.hsl(-100, 0.75, 0.35),
      //])
      //.domain([-0, 15, 30])
      //.range([
        //d3.hsl( 260, 0.75, 0.35),
        //d3.hsl( 110, 1, 0.80),
        //d3.hsl(   0, 1.00, 0.35),
      //])

  var configTemp = _.extend({}, config, {
    name: 'Temperature',
    positionRange: [0, 365],
    position: function (d) { return positionScaler(dateFormatter.parse(d.DATE)) },
    value: {
      start: function (d) { return +d.TMIN/10 },
      end: function (d) { return +d.TMAX/10 },
    },
    domain: [-40, 40],
    range: [0, width/2*.8],
    color: function (d) { return tempPainter((+d.TMIN + +d.TMAX)/2/10) },
  })
  var configGrid = _.extend({}, config, {
    name: 'TempGrid',
    center: [width/2, height/2],
    domain: [-40, 40],
    range: [0, width/2*.8],
    step: 10,
    sectors: 12,
    sectorSize: 0.9,
  })

  // Create charts
  gridLine(configGrid)
  rayDraw(configTemp, data)

  interactive()

  //TODO draw axis labels
  var scale = d3.scale.identity().domain(config.range)

  var ticks = d3.scale.identity()
    .domain(config.range)
    .ticks(config.range[1]/config.step)

  var axis = d3.svg.axis()
    .scale(scale)
    .orient('right')
    .tickFormat(function (d) { return d + ' C' })

  config.target.append('g').attr('transform', d3.svg.transform().translate(self.center))
    .call(axis)
    .transition()
    .duration(750)

  //self._g.append('g').attr('transform', d3.svg.transform().translate(self.center))
    //.selectAll('.axisTick' + name)
    //.data(ticks)
    //.enter()
    //.append('text')
    //.attr('text-anchor', 'middle')
    //.attr('class', '.axisTick' + name)
    //.attr('x', 0)
    //.attr('y', function (d) { return d * config.factor})
    //.text(function (d) { return d})

  function interactive () {
    function showLegend(d) {
      $('#legend>#tmax').html(configTemp.value.start(d) + ' C')
      $('#legend>#tmin').html(configTemp.value.end(d) + ' C')
      $('#legend>#tave').html((+d.TMIN + +d.TMAX)/2/10)
    }
    $('#barTemperatureGroup').on('mouseover', function (e) {
      showLegend(e.target.__data__)
    })
  }
})
