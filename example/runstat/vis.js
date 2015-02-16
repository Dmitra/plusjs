var TimeLib = require('../../lib/TimeLib')
var Bar = require('../../src/Radial/Bar')
var Circle = require('../../src/Radial/Circle')
var Label = require('../../src/Radial/Label')
var Arc = require('../../src/Radial/Arc')

var width = 800,
	height = 800;

var container = d3.select('chart')
var vis = d3.select('#chart>svg')
            .attr('width', width)
            .attr('height', height)

//Options for the chart, other than default
var config = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    positionMax: 365,
}
var configDistance = _.extend({}, config, {
    name: 'DISTANCE',
    factor: 14,
    direction: 'out',
    color: 'grey',
    radius: 240,
})
var configPace = _.extend({}, config, {
    name: 'PACE',
    factor: 400,
    direction: 'in',
    color: 'rgb(128,93,63)',
    radius: 230,
})
var configWeather = _.extend({}, config, {
    name: 'Weather',
    innerRadius: 100,
    radius: 40,
    colorCoding: [-14, 0, 26],
    colorRange: [d3.rgb(117, 179, 216), '#ffffff',  d3.rgb(244, 153, 21)],
})
var config30MinDistance = _.extend({}, config, {
    name: '30 MIN MARK',
    factor: 14,
    radius: 240,
    size: 3,
    color: 'rgb(128,93,63)',
})
var configMonthLabel = _.extend({}, config, {
    name: 'Months',
    radius: 160,
    total: 12,
    font: '1em',
    color: 'grey',
    positionMax: 12,
    radial: true,
})
var configLabel = _.extend({}, config, {
    name: 'Labels',
})
var configTest = {
    colorCoding: [-14, 0, 26],
    colorRange: [d3.rgb(117, 179, 216), '#ffffff',  d3.rgb(244, 153, 21)], //d3.rgb(191, 219, 243), d3.rgb(253,211,161),
      //colorRange: [
                    //d3.hsl(-100, 0.75, 0.35),
                    //d3.hsl(  80, 1.50, 0.80),
                    //d3.hsl( 260, 0.75, 0.35)
      //],
      length: 10
}

//Data
d3.csv('data/runstat.csv', function (data) {
    Data = data

    start = new Date(data[0].date)
    end = new Date(_.last(data).date);

    //Prepare data
    data = data.map(function(d) { d.distance = parseFloat(d.distance); return d})
    var distance = data.map(function (d) {
        var r = JSON.parse(JSON.stringify(d))
        r.position = TimeLib.daysPassed(start, new Date(d.date))
        r.length = d.distance
        return r
    })
    var pace = data.map(function (d) {
        var r = JSON.parse(JSON.stringify(d))
        r.position = TimeLib.daysPassed(start, new Date(d.date)),
        r.length = d.distance / TimeLib.decimalMinutes(d.time) - 0.142
        return r
    })
    format = d3.time.format('%d/%m/%Y')
    var halfHourDistance = data.map(function (d) {
        return {
            position: TimeLib.daysPassed(start, new Date(d.date)),
            radius: d.distance/TimeLib.decimalMinutes(d.time) * 30
        }
    })

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
    var rayChart = new Bar(configDistance)
    rayChart.draw(distance);
    var rayChart2 = new Bar(configPace)
    rayChart2.draw(pace);
    var circleChart = new Circle(config30MinDistance)
    circleChart.draw(halfHourDistance)
    //Draw months names on the circumference of specified radius according to the date
    var labels1 = new Label(configMonthLabel)
    labels1.draw(monthName)
    var labels2 = new Label(configLabel)
    labels2.draw(labels)

    d3.csv('data/weather.csv', function (data) {
        var tavg = data.map(function (d) {
            return { position: TimeLib.daysPassed(start, format.parse(d.date)), color: d.tave}
        })

        var arcChart = new Arc(configWeather)
        arcChart.draw(tavg)
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
