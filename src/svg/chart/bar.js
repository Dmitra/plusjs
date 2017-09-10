module.exports = function (config) {
  // Default Settings
  //---------------------------------------------------------------------------------
  var selection = config.container
  , width = config.width || 100
  , height = config.height || 100
  , identifier = config.id || function (d) { return d.id }
  , namer = config.name || function (d) { return d.name }
  , nameFormatter = config.nameFormat || function (d) { return d }
  , valuer = config.value || function (d) { return d.value }
  , valueFormatter = config.valueFormatter || d3.format('0,000')
  , duration = config.duration || 500 
var bar = function (x0, y0, x, y) {
    return 'M' + x0 + ' ' + y0 + ' H' + x + ' V' + y + ' H' + x0 + ' Z'; 
  }

  var self = {}

  var margin = {top: 50, right: 50, bottom: 50, left: 80}
  , containerSize = [width, height]
    width = width - margin.left - margin.right
    height = height - margin.top - margin.bottom

  var x = d3.time.scale()
    .range([0, width])
      //.rangeRoundBands([0, width], .1)

  var y = d3.scale.linear()
      .range([height, 0])

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat('')
      //.tickSize(-height)

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .ticks(5)
      .tickSize(width)
      .tickFormat(valueFormatter)
      .tickPadding(5)

  var svg = selection.append("svg")
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox','0 0 ' + containerSize[0] + ' '+ containerSize[1])
      .attr('preserveAspectRatio','xMinYMin')
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //xAxis
      //.tickFormat(nameFormatter)
    var gx = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    svg.append("g")
      .attr('transform', "translate(0,0)")
      .classed('first', true)
      .append('line')
      .attr('y2', height)

  function drawLabels(data) {
    svg.selectAll('.barLabel').remove()
    svg.selectAll('.barLabel')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'barLabel')
      .attr('text-anchor', 'middle')
      .text(function (d) { return nameFormatter(namer(d)) })
      .attr('x', function (d) {
        var start = d.values.interval[0]
        var end = d.values.interval[1]
        var middle = +start + (end - start)/2
        return x(new Date(middle))
      })
      .attr('y', height+12)
  }
  function redrawYAxisElements() {
    svg.selectAll('.y.axis').remove()
    var gy = svg.insert("g", '.bar')
      .attr("class", "y axis")
      .call(yAxis)

    gy.selectAll("g").filter(function(d) { return d })
      .classed("minor", true)

    gy.selectAll("text")
      .attr("x", -5)
      .style("text-anchor", "end")
  }

  self.update = function(data, options) {
    x.domain([data[0].values.interval[0], _.last(data).values.interval[1]])
    y.domain([0, d3.max(data, valuer)])
    
    //xAxis.ticks(data.length)

    var barElements = svg.selectAll(".bar")
    var bars = barElements.data(data, identifier)

    bars
      .transition()
      .duration(duration)
        .attr('d', function (d) {
          return bar(x(d.values.interval[0])
                     , y(0)
                     , x(d.values.interval[1])
                     , y(valuer(d))
         )})

    var enter = bars.enter()
    enter
      .append("path")
        .attr("class", "bar")
        .attr('opacity', '1')
        .attr('d', function (d) {
          return bar(x(d.values.interval[0])
                     , y(0)
                     , x(d.values.interval[1])
                     , y(0)
         )})
        .transition()
        .duration(duration)
        .attr('d', function (d) {
          return bar(x(d.values.interval[0])
                     , y(0)
                     , x(d.values.interval[1])
                     , y(valuer(d))
         )})

    drawLabels(data)
    var removeTransition = bars.exit()
      .transition()
      .duration(duration)
      .attr('d', function (d) {
        return bar(x(d.values.interval[0])
                   , y(0)
                   , x(d.values.interval[1])
                   , y(valuer(d))
       )})
       .attr('opacity', '1e-6')

    removeTransition.remove()

    redrawYAxisElements()
    var transition = svg.transition().duration(duration)
    transition.selectAll('.x.axis')
      .call(xAxis)
  }

  return self
}
