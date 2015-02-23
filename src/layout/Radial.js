var Config = require('../core/Config')
module.exports = function (options) {

  // Default Settings
  //---------------------------------------------------------------------------------
  var rotate = 0
    , positioner = Number
    , radiuser = function (d) { return d.radius }
    , size = [1,1]
    , range = undefined

  function getCenter() { return [size[0] / 2, size[1] / 2] };
  function setCenter(point) { size = [point[0] * 2, point[1] * 2] }
  function setRange(range) { 
    self._radScaler.domain(range)
    self._gradScaler.domain(range)
  }

  var self = function (data) {
    data.map(function (d) {
      d.x = getCenter()[0] + (radiuser(d) * Math.sin(self.toRad(d)));
      d.y = getCenter()[1] - (radiuser(d) * Math.cos(self.toRad(d)));
    })
    return data
  }

  self._rotateRad = function () { return 2 * Math.PI / 180 * rotate }

  self._radScaler = d3.scale.linear()
      .range([0, 2 * Math.PI])
  self._gradScaler = d3.scale.linear()
      .range([0, 360])

  self.toRad = function (d) {
    return self._radScaler(positioner(d)) + self._rotateRad()
  }

  self.toGrad = function (d) {
    return self._gradScaler(positioner(d)) + self._rotate
  }

  // Public Variables
  //---------------------------------------------------------------------------------
  self.config = Config.configFn.bind(self);

  self._accessors = Object.create({}, {
    rotate: {get: function(){return rotate;}, set: function(v){rotate=v;}},
    //Fixed radius or radius accessor function
    radius: {get: function(){return radiuser;}, set: function(v){radiuser = d3.functor(v);}},
    center: {get: getCenter, set: setCenter},
    range: {get: function(){return range;}, set: setRange},
    //position accessor
    position: {get: function(){return positioner;}, set: function(v){positioner=v;}},
    size: {get: function(){return size;}, set: function(v){size=v;}},
  })

  Config.setModuleAccessors(self);
  self.config(options);
  
  return self
}
