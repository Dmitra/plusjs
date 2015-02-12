/**
 * Input data format
 * @position
 * @color
 * @size
 */
Vis.Radial.Label = function (options) {
    var self = this;

    self._defaults = {
        width: 400,
        height: 400,
        rotate: 0,
        factor: 1,
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
        radius: 50,
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 10,
        //Input data
        size: 10,
        color: 'grey'
    }
    Vis.Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)
        self._g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('transform', function(d) {
                var coords = self.getCoords(self.center, self._config.radius, d.position)
                return 'translate(' + coords[0] + ',' + coords[1] + ') rotate(' + self.toGrad(d.position) + ')'
            })
            .attr('dy', '.71em')
            .attr("text-anchor", 'middle')
            .text(function(d) { return d.label })
    }
}
