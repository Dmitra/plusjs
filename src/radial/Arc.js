/**
 * Input data format
 * @position
 * @color
 */
Vis.Radial.Arc = function (options) {
    var self = this

    self._defaults = {
        name: "",
        width: 400,
        height: 400,
        startRadius: 30,
        radius: 10,
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 10,
        rotate: 0,
        factor: 1,
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
    }
    Vis.Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)

        var path = self._g.attr('id', 'arcGroup' + self._config.name)
            .selectAll('.arc' + self._config.name)
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'arc' + self._config.name)
            .attr('d', self.arc)
            .style('fill', function(d) { return self._color(d.color); })
    }

    self.arc = d3.svg.arc()
        .startAngle(function(d) {
            return self.toRad(d.position) + self._rotateRad
        })
        .endAngle(function(d) { return self.toRad(d.position + 1) + self._rotateRad })
        .innerRadius(self._config.innerRadius)
        .outerRadius(self._config.innerRadius + self._config.radius)

    //Move to center
    self._g.attr('transform', 'translate(' + self._config.width / 2 + ',' + (self._config.height / 2) + ')');

}
