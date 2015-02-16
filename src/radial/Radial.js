var Vis = require('../Vis')
module.exports = function (options) {
    var self = this;

    var defaults = {
        rotate: 0,
        radius: 0,
    }
    self._defaults = _.extend(defaults, self._defaults)
    Vis.call(this, options);

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
