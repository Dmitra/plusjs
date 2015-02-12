var Vis = function (options) {
    var self = this;

    self._config = self._defaults

    if('undefined' !== typeof options){
        for(var i in options){
            if('undefined' !== typeof options[i]){
                self._config[i] = options[i];
            }
        }
    }

    self._vis = self._config.target
    self._g = self._vis.append('g')

    //Color settings
    self._setColors = function (data) {
        var colorCodingValues = data.map(function(d) { return d.color })
        self._config.colorCodingMin = self._config.colorCodingMin || d3.min(colorCodingValues)
        self._config.colorCodingMax = self._config.colorCodingMax || d3.max(colorCodingValues)
        self._color = d3.scale.linear()
            .domain(self._config.colorCoding || [self._config.colorCodingMin, self._config.colorCodingMax])
            .range(self._config.colorRange)
    }
        
}

Vis.Radial = function (options) {
    Vis.call(this, options);
    var self = this;

    self._rotateRad = 2 * Math.PI / 180 * self._config.rotate

    self.toRad = d3.scale.linear()
        .range([0, 2 * Math.PI])

    self.toGrad = d3.scale.linear()
        .range([0, 360])

    self.center = [self._config.width / 2, self._config.height / 2];

    self.getCoords = function (center, radius, position) {
        position = position || 0
        var positionRad = self.toRad(position) + self._rotateRad
        var x = center[0] + (radius * Math.sin(positionRad));
        var y = center[1] - (radius * Math.cos(positionRad));
        return [x,y]
    }

    self.draw = function (data) {
        var minMax = self._config.positionMax ? [0, self._config.positionMax] : d3.extent(_.pluck(data, 'position'))
        self.toRad.domain(minMax)
        self.toGrad.domain(minMax)
        self._setColors(data)
    }

}

/**
 * Input data format
 * @position
 * @color
 */
Vis.Radial.Arc = function (options) {
    var self = this

    self._defaults = {
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

        var path = self._g.selectAll('.arc')
            .data(data)
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('class', 'arc')
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

/**
 * Input data format
 * @position
 * @color
 * @size
 */
Vis.Radial.Circle = function (options) {
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
        //positionMax: 0,
        //Input data
        size: 0,
        color: 'grey'
    }
    Vis.Radial.call(this, options);

    self._draw = self.draw
    self.draw = function (data) {
        self._draw(data)

        self._g.selectAll('.circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'circle')
        
            .attr('cx', function (d) {
                return self.getCoords(self.center, self._config.radius + d.distance * self._config.factor, d.position)[0]
            })
            .attr('cy', function (d) {
                return self.getCoords(self.center, self._config.radius + d.distance * self._config.factor, d.position)[1]
            })
            .attr('r', function (d) { return d.size || self._config.size})
            .style('fill', function(d) { return d.color ? self._color(d.color) : self._config.color })

    }
}

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
