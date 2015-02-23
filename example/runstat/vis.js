var TimeLib = require('../../src/format/Time')
var rayChart = require('../bar')
var circleChart = require('../circle')
var arcChart = require('../arc')
var radialLabel = require('../label')

var width = 800,
	height = 800;

var container = d3.select('#chart>svg')
            .attr('width', width)
            .attr('height', height)

//Options for the chart, other than default
var config = {
    target: container,
    width: width,
    height: height,
    rotate: 0,
    range: [0, 365],
    size: [width, height],
}
var configDistance = _.extend({}, config, {
    name: 'DISTANCE',
    position: function (d) { return TimeLib.daysPassed(start, new Date(d.date)) },
    radius: 240,
    radius2: function (d) { return 240 + d.distance * 14 },
    dashed: '10,5',
})
var configPace = _.extend({}, config, {
    name: 'PACE',
    position: function (d) { return TimeLib.daysPassed(start, new Date(d.date)) },
    radius: 230,
    radius2: function (d) {
      //baseRadius + (run velocity - baseLine) * factor
      return 230 + (d.distance / TimeLib.decimalMinutes(d.time) - 0.142) * -400
    },
})
var weatherTimeFormatter = d3.time.format('%d/%m/%Y')
//Color settings
var weatherTempPainter = d3.scale.linear()
    .domain([-14, 0, 26])
    .range([d3.rgb(117, 179, 216), '#ffffff',  d3.rgb(244, 153, 21)])
var configWeather = _.extend({}, config, {
    name: 'Weather',
    position: function (d) {
      return TimeLib.daysPassed(start, weatherTimeFormatter.parse(d.date))
    },
    innerRadius: 100,
    radius: 40,
    color: function (d) { return weatherTempPainter(d.tave) },
})
var config30MinDistance = _.extend({}, config, {
    name: '30_MIN_MARK',
    position: function (d) {
      return TimeLib.daysPassed(start, new Date(d.date))
    },
    radius: function (d) {
      return 240 + d.distance/TimeLib.decimalMinutes(d.time) * 30 * 14
    },
    circleSize: 3,
})
var configMonthLabel = _.extend({}, config, {
    name: 'Months',
    rotate: 3,
    radius: 160,
    color: 'grey',
    range: [0, 12],
    position: function (d) { return d.position },
})
var configLabel = _.extend({}, config, {
    name: 'Labels',
    position: function (d) { return d.position },
})

//Data
d3.csv('data/runstat.csv', function (data) {
  Data = data

  start = new Date(data[0].date)
  end = new Date(_.last(data).date);

  //Prepare data
  //---------------------------------------------------------------------------------
  var dates = data.map(function(d) {
    return d3.time.format('%d %b %Y').parse(d.date);
  });
  var t = d3.time.scale()
      .domain(d3.extent(dates))
  var ticks = t.ticks(d3.time.months, 1)
  var monthName = ticks.map(function (d, i) {
    return { position: i, label: d3.time.format('%b %y')(d) }
  })
  var labels = [
    {
      position: 104,
      radius: 350,
      label: 'INJURY\n LVIV',
    },
    {
      position: 231,
      radius: 410,
      label: 'HALFMARATHON 21.1 KM\n 01:38:35\n PARIS FRANCE',
    },
  ]


  // Create charts
  //---------------------------------------------------------------------------------
  rayChart(configDistance, data)
  rayChart(configPace, data)
  circleChart(config30MinDistance, data)
  ////Draw months names on the circumference of specified radius according to the date
  radialLabel(configMonthLabel, monthName)
  radialLabel(configLabel, labels)
  

  d3.csv('data/weather.csv', function (_data) {
      arcChart(configWeather, _data)
  })

  interactive()
})

function interactive () {
  function showLegend(d) {
    $('#legend>#distance').html(d.distance + ' km')
    $('#legend>#pace').html((TimeLib.decimalMinutes(d.time) / d.distance).toFixed(2) + ' min/km')
    $('#legend>#date').html(d.date)
  }
  $('#barGroupDISTANCE').on('mouseover', function (e) {
    showLegend(e.target.__data__)
  })
  $('#barGroupPACE').on('mouseover', function (e) {
    showLegend(e.target.__data__)
  })
}
