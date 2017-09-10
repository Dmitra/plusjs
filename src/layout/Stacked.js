var Config = require('../core/Config')
module.exports = function stacked(options) {
  // Default Settings
  //---------------------------------------------------------------------------------
  var options = options || {}
    , valuer = Number
    , sort = {}
    , starter = options.start || 0
    , ender = options.end || 2 * Math.PI
    , padder = options.padding || 0

  //Unit values are in radians
  function self(data) {
    var itemsQuantity = data.length
      , values = data.map(function(d, i) { return +valuer.call(self, d, i); })
      , currentUnit = +(typeof starter === "function" ? starter.apply(this, arguments) : starter)
      , layoutSize = (typeof ender === "function" ? ender.apply(this, arguments) : ender) - currentUnit
      , absolutePaddingUnit = Math.min(Math.abs(layoutSize) / itemsQuantity, +(typeof padder === "function" ? padder.apply(this, arguments) : padder))
      , padder = absolutePaddingUnit * (layoutSize < 0 ? -1 : 1)
      , unitsPerValue = (layoutSize - itemsQuantity * padder) / d3.sum(values)
      , index = d3.range(itemsQuantity)
      , items = []
      , currentValue

    // Compute the items! They are stored in the original data's order.
    index.forEach(function(i) {
      items[i] = {
        data: data[i],
        value: currentValue = values[i],
        start: currentUnit,
        end: currentUnit += currentValue * unitsPerValue + padder,
        padding: absolutePaddingUnit
      };
    });

    return items;
  }

  // Public Variables
  //---------------------------------------------------------------------------------
  self.config = Config.configFn.bind(self);

  self._accessors = Object.create({}, {
    value: {get: function(){return valuer;}, set: function(v){valuer = d3.functor(v);}},
    sort: {get: function(){return sort;}, set: function(v){sort = d3.functor(v);}},
    start: {get: function(){return start;}, set: function(v){ start = v }},
    end: {get: function(){return ender;}, set: function(v) { ender = v }},
    padding: {get: function(){return padding;}, set: function(v) { padding = v }},
  })

  Config.setModuleAccessors(self);
  self.config(options);

  return self;
};
