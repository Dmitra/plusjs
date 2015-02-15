/**
 * Input data format
 * @position
 * @color
 * @size
 */
Vis.Radial.Label = function (options) {
    var self = this;

    var defaults = {
        factor: 1,
        colorCodingMin: undefined,
        colorCodingMax: undefined,
        colorRange: ['violet', 'red'],
        //position Number of total positions
        //if not set [min, max] values are used from data
        //positionMax: 10,
        //Input data
        size: 10,
        color: 'grey'
    }
    self._defaults = _.extend(defaults, self._defaults)
    Vis.Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)

        //svg path calculation to draw labels upon
        var arc = d3.svg.arc()
            .startAngle(function(d) {
                return self.toRad(d.position) + self._rotateRad
            })
            //length of arc is half of a circle
            .endAngle(function(d) { return self.toRad(d.position) + Math.PI})
            .outerRadius(function (d) {
                return d.radius || self._config.radius
            })

        function generateId(d) {
            return 'ltp' + d.label.replace(' ', '').replace('\n', '')
        }
        var textPath = self._g.selectAll('.labelTextPath')
            .data(data)
            .enter()
            .append('defs')
            .append('path')
            .attr('id', generateId)
            .attr('class', 'labelTextPath')
            .attr('d', arc)

        self._g.selectAll('.label' + self._config.name)
            .data(data)
            .enter()
            .append('text')       
            .attr('class', 'label' + self._config.name)
            .append('textPath')
            .attr('xlink:href', function (d) { return '#' + generateId(d) })

            //render multiline labels
            .each(function (d) {
                var arr = d.label.split('\n')
                if (arr != undefined) {
                    for (i = 0; i < arr.length; i++) {
                        d3.select(this).append('tspan')
                            .text(arr[i])
                            .attr('text-anchor', 'start')
                            .attr('dy', i ? '1.2em' : 0)
                            .attr('x', 0)
                            .attr('class', 'tspan' + i)
                    }
                }
            })

            self._g.attr('transform', 'translate(' + self._config.width / 2 + ',' + (self._config.height / 2) + ')');
    }
}
