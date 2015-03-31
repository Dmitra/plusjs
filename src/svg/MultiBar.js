var Rect = require('../../lib/vis/svg/Rect')
var Config = require('../../lib/vis/core/Config')
module.exports = function (options) {
  // Default Settings
  //---------------------------------------------------------------------------------
  var values, x0, y0, x, y
  , dx0 = 0
  , dy0
  , width = 1
  , height

  function self(selection) {
    selection.each(function(data) {
      var g = d3.select(this);

      var yValues = values(data)
      , keys = _.keys(yValues)
      var paths = _.map(keys, function (key, i) {
        var rect = Rect().x0(x0).y0(y0).x(x)
        , barY = function (d) {
          return y(values(d)[key]) }
        rect.y(barY)
        rect.dx0(dx0 + i/keys.length)
        rect.width(width/keys.length)
        
        g.append('path')
          .classed('bar', true)
          .classed(key, true)
          .attr('d', rect(data))
      })

      paths.forEach(function (path) {
      })
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
  })

  Config.setModuleAccessors(self);
  self.config(options);

  return self;
};
