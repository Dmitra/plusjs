/**
 * Input data format
 * @position
 * @length
 * @color
 */
Vis.Radial.Bar = function (options) {
    var self = this;

    var defaults = {
        direction: 'out',
        factor: 1,
        dashed: '10,5',
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
        length: 0,
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 10,
    }
    self._defaults = _.extend(defaults, self._defaults)
    Vis.Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)

        var gradient = self._vis
                .append('defs')
                .append('linearGradient')
                .attr('id', 'grad1')
            gradient
                    .append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', 'red')
            gradient
                    .append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', 'red')
                    .attr('stop-opacity', 0)

        var bars = self._g.attr('id', 'barGroup' + self._config.name)
            .selectAll('.bar' + self._config.name)
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'bar' + self._config.name)
            //.attr('stroke', 'url(#grad1)')
            .attr('stroke-dasharray', self._config.dashed)
            .attr('d', self.bar)
            .style('stroke', function (d) {
                return self._config.color || self._color(d.color)
            })
            .style('stroke-width', self._config.strokeWidth + 'px');

    }

    self.bar = function (d) {
        var length = d.length || self._config.length
        var start = self.getCoords(self.center, self._config.radius, d.position)
        var end = self.getCoords(self.center, self._config.radius + length * self._config.factor, d.position)
        return 'M' + start[0] + ' ' + start[1] + 'L' + end[0] + ' ' + end[1]; 
    }

    self._config.factor = self._config.direction === 'in' ? -self._config.factor : self._config.factor;

}
