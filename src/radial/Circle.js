/**
 * Input data format
 * @position
 * @color
 * @size
 */
var Radial = require('./Radial')
module.exports = function (options) {
    var self = this;

    var defaults = {
        factor: 1,
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 0,
        //Input data
        size: 0,
        color: 'grey'
    }
    self._defaults = _.extend(defaults, self._defaults)
    Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)

        self._g.attr('id', 'circleGroup' + self._config.name)
            .selectAll('.circle' + self._config.name)
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'circle' + self._config.name)
            .attr('cx', function (d) {
                return self.getCoords(self.center, self._config.radius + d.radius * self._config.factor, d.position)[0]
            })
            .attr('cy', function (d) {
                return self.getCoords(self.center, self._config.radius + d.radius * self._config.factor, d.position)[1]
            })
            .attr('r', function (d) { return d.size || self._config.size})
            .style('fill', function(d) { return d.color ? self._color(d.color) : self._config.color })

    }
}
