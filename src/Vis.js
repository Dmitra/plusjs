var Vis = function (options) {
    var self = this;

    var defaults = {
        name: '',
        width: 400,
        height: 400,
    }

    self._config = _.extend(self._defaults, defaults, options)

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
