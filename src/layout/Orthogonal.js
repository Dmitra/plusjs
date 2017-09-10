var Config = require('../core/Config')
module.exports = function() {
  // Default Settings
  //---------------------------------------------------------------------------------
  var options = options || {}
    , abscissa = Number
    , ordinate = Number
    , padder = options.padding || 0

  //Unit values are in radians
  function self(data) {
    var itemsQuantity = data.length
      , xCoords = data.map(function(d, i) { return +abscissa.call(self, d, i); })
      , yCoords = data.map(function(d, i) { return +ordinate.call(self, d, i); })
      , index = d3.range(itemsQuantity)
      , items = []

    // Compute the items! They are stored in the original data's order.
    index.forEach(function(i) {
      items[i] = {
        data: data[i]
      , x: xCoords[i]
      , y: yCoords[i]
      };
    });

    return items
  }

  // Public Variables
  //---------------------------------------------------------------------------------
  self.config = Config.configFn.bind(self);

  self._accessors = Object.create({}, {
    x: {get: function(){return abscissa;}, set: function(v){ abscissa = d3.functor(v) }}
  , y: {get: function(){return ordinate;}, set: function(v){ ordinate = d3.functor(v) }}
  })

  Config.setModuleAccessors(self);
  self.config(options);

  return self;
};
