/**
 * Input data format
 * @position
 * @rayLength
 * @color
 */
Vis.Radial.Ray = function (options) {
    var self = this;

    self._defaults = {
        width: 400,
        height: 400,
        direction: 'out',
        rotate: 0,
        factor: 1,
        dashed: '10,5',
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
        rayLength: 0,
        radius: 50,
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 10,
    }
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

        var rays = self._g.selectAll('.ray')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'ray')
            //.attr('stroke', 'url(#grad1)')
            .attr('stroke-dasharray', self._config.dashed)
            .attr('d', self.ray)
            .attr('class', 'line')
            .style("stroke", function (d) {
                return self._config.color || self._color(d.color)
            })
            .style('stroke-width', self._config.strokeWidth + 'px');

    }

    self.ray = function (d) {
        var rayLength = d.rayLength || self._config.rayLength
        var start = self.getCoords(self.center, self._config.radius, d.position)
        var end = self.getCoords(self.center, self._config.radius + rayLength * self._config.factor, d.position)
        return 'M' + start[0] + ' ' + start[1] + 'L' + end[0] + ' ' + end[1]; 
    }

    self._config.factor = self._config.direction === 'in' ? -self._config.factor : self._config.factor;

}
