var Rect = require('./Rect')
var Config = require('../core/Config')
module.exports = function (options) {
  // Default Settings
  //---------------------------------------------------------------------------------
  var values
  , x0, y0, x, y
  , dx0 = 0
  , dy0
  , width = 1
  , innerBarWidth = 1

  function self(selection) {
    selection.each(function(data) {
      var g = d3.select(this)
      , yValues = values(data)
      , barData = d3.entries(yValues)
      , vx0 = x0(data)
      , vy0 = y0(data)
      , vx = x(data)
      , vy = y(data)
      , vxWidth = vx - vx0
      , vyWidth = vy - vy0

      vx0 = vx0 + vxWidth * dx0

      if (width !== 1) var relWidth = vxWidth * width

      var rectBuilders = _.map(barData, function (barDatum, i) {
        return Rect()
          .x0(i/barData.length * relWidth)
          .y0(function (d) { return y0(values(d)[barDatum.key]) })
          .x((i+1)/barData.length * relWidth)
          .y(function (d) { return y(values(d)[barDatum.key]) })
          .width(innerBarWidth)
      })
      function buildPath(key, i) { return rectBuilders[i](data) }

      var update = d3.transition(g)
        .attr('transform', 'translate('+ vx0 +',0)')

      var bars = g.selectAll('.bar').data(barData)

      d3.transition(bars.enter().append('path'))
        .attr('class', function (d) { return 'bar ' + d.key })

      //bars update
      d3.transition(bars)
        .attr('d', buildPath)

      bars.exit().remove()

    })
  }

  // Public Variables
  //---------------------------------------------------------------------------------
  self.config = Config.configFn.bind(self);

  self._accessors = Object.create({}, {
    values: {get: function(){return values;}, set: function(v){ values = v }}
  , x0: {get: function(){return x0;}, set: function(v){ x0 = v }}
  , y0: {get: function(){return y0;}, set: function(v){ y0 = v }}
  , x: {get: function(){return x;}, set: function(v){ x = v }}
  , y: {get: function(){return y;}, set: function(v){ y = v }}
  , dx0: {get: function(){return dx0;}, set: function(v){ dx0 = v }}
  , width: {get: function(){return width}, set: function(v){ width = v }}
  , innerBarWidth: {get: function(){return innerBarWidth}, set: function(v){ innerBarWidth = v }}
  })

  Config.setModuleAccessors(self);
  self.config(options);

  return self;
};
