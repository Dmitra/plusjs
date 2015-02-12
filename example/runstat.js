var width = 1000,
	height = 1000;

var container = d3.select('chart')
var vis = d3.select('#chart>svg')
            .attr('width', width)
            .attr('height', height)

//Options for the chart, other than default
var configDistance = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    factor: 14,
    direction: 'out',
    color: 'grey',
    strokeWidth: 2,
    radius: 300,
    dashed: '10,2',
    positionMax: 365,
}
var configPace = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    factor: 400,
    direction: 'in',
    color: 'rgb(128,93,63)',
    strokeWidth: 2,
    radius: 280,
    dashed: '10,0',
    positionMax: 365,
}
var configWeather = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    innerRadius: 110,
    radius: 40,
    colorCoding: [-14, 0, 26],
    colorRange: [d3.rgb(117, 179, 216), '#ffffff',  d3.rgb(244, 153, 21)],
    positionMax: 365,
}
var config30MinDistance = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    factor: 14,
    strokeWidth: 1,
    radius: 300,
    size: 3,
    color: 'rgb(128,93,63)',
    positionMax: 365,
}
var configText = {
    target: vis,
    width: width,
    height: height,
    rotate: 0,
    radius: 200,
    total: 12,
    format: d3.time.format('%b'),
    font: '1em',
    color: 'grey',
    positionMax: 12,
}
var configTest = {
    colorCoding: [-14, 0, 26],
    colorRange: [d3.rgb(117, 179, 216), '#ffffff',  d3.rgb(244, 153, 21)], //d3.rgb(191, 219, 243), d3.rgb(253,211,161),
      //colorRange: [
                    //d3.hsl(-100, 0.75, 0.35),
                    //d3.hsl(  80, 1.50, 0.80),
                    //d3.hsl( 260, 0.75, 0.35)
      //],
      rayLength: 10
}

//Data
d3.csv('data/runstat.csv', function (data) {
    Data = data

    start = new Date(data[0].date)
    end = new Date(_.last(data).date);

    //Prepare data
    var distance = data.map(function (d) {
        return { position: TimeLib.daysPassed(start, new Date(d.date)), rayLength: d.distance}
    })
    function decimalMinutes (date) {
        var format = d3.time.format("%H:%M:%S")
        return (format.parse(date) - format.parse("0:0:0"))/60000

    }
    var pace = data.map(function (d) {
        return { position: TimeLib.daysPassed(start, new Date(d.date)), rayLength: d.distance / decimalMinutes(d.time) - 0.142}
    })
    format = d3.time.format('%d/%m/%Y')
    var halfHourDistance = data.map(function (d) {
        return { position: TimeLib.daysPassed(start, new Date(d.date)), distance: d.distance/decimalMinutes(d.time) * 30}
    })

    var dates = data.map(function(d) {
        return d3.time.format('%d %b %Y').parse(d.date);
    });
    var t = d3.time.scale()
        .domain(d3.extent(dates))
    var ticks = t.ticks(d3.time.months, 1)
    var labelText = ticks.map(function (d, i) {
        return { position: i, label: d3.time.format('%b %y')(d) }
    })

    // create charts
    var rayChart = new Vis.Radial.Ray(configDistance)
    rayChart.draw(distance);
    var rayChart2 = new Vis.Radial.Ray(configPace)
    rayChart2.draw(pace);
    var circleChart = new Vis.Radial.Circle(config30MinDistance)
    circleChart.draw(halfHourDistance)
    //Draw months names on the circumference of specified radius according to the date
    var labels = new Vis.Radial.Label(configText)
    labels.draw(labelText)

})
d3.csv('data/weather.csv', function (data) {
    var tavg = data.map(function (d) {
        return { position: TimeLib.daysPassed(start, format.parse(d.date)), color: d.tave}
    })

    var arcChart = new Vis.Radial.Arc(configWeather)
    arcChart.draw(tavg)
})
