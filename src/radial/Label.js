/**
 * Input data format
 * @position
 * @color
 * @size
 */
Vis.Radial.Label = function (options) {
    var self = this;

    self._defaults = {
        name: '',
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
        var text = self._g.selectAll('.label' + self._config.name)
            .data(data)
            .enter()
        
        text.append('text')       
            .attr('class', 'label' + self._config.name)
            .attr('transform', function(d) {
                var coords = self.getCoords(self.center, (d.radius || self._config.radius) * self._config.factor, d.position)
                return 'translate(' + coords[0] + ',' + coords[1] + ') rotate(' + self.toGrad(d.position) + ')'
            })
            .each(function (d) {
                var arr = d.label.split('\n')
                if (arr != undefined) {
                    for (i = 0; i < arr.length; i++) {
                        d3.select(this).append('tspan')
                            .text(arr[i])
                            .attr('dy', i ? '1.2em' : 0)
                            .attr('x', 0)
                            .attr('class', 'tspan' + i)
                    }
                }
            })
    }
}
