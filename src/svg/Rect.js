var Config = require('../core/Config')
module.exports = function() {
  // Default Settings
  //---------------------------------------------------------------------------------
  var options = options || {}
    , x0 = Number
    , y0 = Number
    , x = Number
    , y = Number
    , dx0 = 0
    , dy0 = 0
    , widthFn = 1
    , heightFn = 1

  //Unit values are in radians
  function self(data) {
    if (x && y) {
      pathFn = absolute

      var vx0 = x0(data)
        , vy0 = y0(data)
        , vx = x(data)
        , vy = y(data)
        , vxWidth = vx - vx0
        , vyWidth = vy - vy0
      vx0 = vx0 + vxWidth * dx0
      vy0 = vy0 + vyWidth * dy0

      if (widthFn !== 1) vx = vx0 + vxWidth * widthFn()
      if (heightFn !== 1) vy = vy0 + vyWidth * heightFn()
    } else {
      //TODO
    }

    return pathFn(vx0, vy0, vx, vy)
  }

  function absolute(x0, y0, x, y) {
    return 'M' + x0 + ' ' + y0 + ' H' + x + ' V' + y + ' H' + x0 + ' Z'; 
  }

  function relative(x0, y0, width, height) {
    return 'M' + x0 + ' ' + y0 + ' h' + width + ' V' + height + ' H' + x0 + ' Z'; 
  }

  // Public Variables
  //---------------------------------------------------------------------------------
  self.config = Config.configFn.bind(self);

  self._accessors = Object.create({}, {
    x0: {get: function(){return x0;}, set: function(v){ x0 = d3.functor(v) }}
  , y0: {get: function(){return y0;}, set: function(v){ y0 = d3.functor(v) }}
  , x: {get: function(){return x;}, set: function(v){ x = d3.functor(v) }}
  , y: {get: function(){return y;}, set: function(v){ y = d3.functor(v) }}
  , dx0: {get: function(){return dx0;}, set: function(v){ dx0 = v }}
  , dy0: {get: function(){return dy0;}, set: function(v){ dy0 = v }}
  , width: {get: function(){return widthFn;}, set: function(v){ widthFn = d3.functor(v) }}
  , height: {get: function(){return heightFn;}, set: function(v){ heightFn = d3.functor(v) }}
  })

  Config.setModuleAccessors(self);
  self.config(options);

  return self;
};
