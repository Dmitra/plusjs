!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Vis=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var self = {};
/*
   This function enables module bulk configuring like:
   module.config({
    labels: true,
    size: [100,100],
  });

  Usage inside module:
  module.config = Vis.Core.Config.configFn.bind(module);
*/
self.configFn = function(args) {
  var module = this;
  if (args) {
    _.each(args, function(value, setAccessor) {
      //Check if module has setAccessor
      if (typeof module[setAccessor] === "function") {
        module[setAccessor](value);
      }
    });
  }
  return this;
};
/*
   Add a particular accessor from an accessors object onto module
   Options exposed on a module are a getter/setter function that returns module itself
   in order to comply with d3 reusable interface: accessor chaining,
   e.g. module.accessor('a').accessor('b');

   Accessor objects should be generated via Object.create() to provide
   the accessor of manipulating data via get/set functions.
*/
self.setModuleAccessor = function(module, name) {
  module[name] = function (value) {
    if (!arguments.length) return module._accessors[name];
    module._accessors[name] = value;
    return module;
  }
};
/*
   Add all accessors to the module
*/
self.setModuleAccessors = function(module) {
  var ops = Object.getOwnPropertyNames(module._accessors || {});
  for (var i in ops) {
    self.setModuleAccessor(module, ops[i]);
  }
};
module.exports = self;

},{}],2:[function(require,module,exports){
var self = {};
self.GUID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
module.exports = self

},{}],3:[function(require,module,exports){
module.exports = {
  Time: require('./Time'),
}

},{"./Time":4}],4:[function(require,module,exports){
module.exports = {
    daysPassed: function (start, end) {
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor((end - start) / oneDay);
    },

    decimalMinutes: function (date) {
        var format = d3.time.format('%H:%M:%S')
        return (format.parse(date) - format.parse('0:0:0'))/60000
    }

}

},{}],5:[function(require,module,exports){
module.exports = {
  Util: require('../src/core/Util'),
  Format: require('../src/format/Format'),
  Layout: require('../src/layout/Layout'),
  //Svg: require('../src/svg/Svg')
}

},{"../src/core/Util":2,"../src/format/Format":3,"../src/layout/Layout":6}],6:[function(require,module,exports){
module.exports = {
  Radial: require('./Radial'),
}

},{"./Radial":7}],7:[function(require,module,exports){
var Config = require('../core/Config')
module.exports = function (options) {

  // Default Settings
  //---------------------------------------------------------------------------------
  var rotate = 0
    , positioner = Number
    , radiuser = function (d) { return +d.radius }
    , size = [1,1]
    , range = undefined
    , coordinateSystem = 'cartesian'

  function getCenter() { return [size[0] / 2, size[1] / 2] };
  function setCenter(point) { size = [point[0] * 2, point[1] * 2] }
  function setRange(value) { 
    if (!value) return
    range = value
    self._radScaler.domain(range)
    self._gradScaler.domain(range)
  }

  var self = function (data) {
    if (!range) setRange([0, data.length])
    switch (coordinateSystem) {
      case 'cartesian': 
        data.map(function (d) {
          d.x = getCenter()[0] + (radiuser(d) * Math.sin(self.toRad(d)))
          d.y = getCenter()[1] - (radiuser(d) * Math.cos(self.toRad(d)))
        })
      break;
      case 'polar':
        data.map(function (d) {
          d.rad = self.toRad(d)
          d.radius = radiuser(d)
        })
      break;
    }
    return data
  }

  self._rotateRad = function () { return Math.PI / 180 * rotate }

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
    coordinateSystem: {get: function(){return coordinateSystem;}, set: function(v){coordinateSystem=v;}},
  })

  Config.setModuleAccessors(self);
  self.config(options);
  
  return self
}

},{"../core/Config":1}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic3JjL2NvcmUvQ29uZmlnLmpzIiwic3JjL2NvcmUvVXRpbC5qcyIsInNyYy9mb3JtYXQvRm9ybWF0LmpzIiwic3JjL2Zvcm1hdC9UaW1lLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL2xheW91dC9MYXlvdXQuanMiLCJzcmMvbGF5b3V0L1JhZGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBzZWxmID0ge307XHJcbi8qXHJcbiAgIFRoaXMgZnVuY3Rpb24gZW5hYmxlcyBtb2R1bGUgYnVsayBjb25maWd1cmluZyBsaWtlOlxyXG4gICBtb2R1bGUuY29uZmlnKHtcclxuICAgIGxhYmVsczogdHJ1ZSxcclxuICAgIHNpemU6IFsxMDAsMTAwXSxcclxuICB9KTtcclxuXHJcbiAgVXNhZ2UgaW5zaWRlIG1vZHVsZTpcclxuICBtb2R1bGUuY29uZmlnID0gVmlzLkNvcmUuQ29uZmlnLmNvbmZpZ0ZuLmJpbmQobW9kdWxlKTtcclxuKi9cclxuc2VsZi5jb25maWdGbiA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuICB2YXIgbW9kdWxlID0gdGhpcztcclxuICBpZiAoYXJncykge1xyXG4gICAgXy5lYWNoKGFyZ3MsIGZ1bmN0aW9uKHZhbHVlLCBzZXRBY2Nlc3Nvcikge1xyXG4gICAgICAvL0NoZWNrIGlmIG1vZHVsZSBoYXMgc2V0QWNjZXNzb3JcclxuICAgICAgaWYgKHR5cGVvZiBtb2R1bGVbc2V0QWNjZXNzb3JdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICBtb2R1bGVbc2V0QWNjZXNzb3JdKHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG4vKlxyXG4gICBBZGQgYSBwYXJ0aWN1bGFyIGFjY2Vzc29yIGZyb20gYW4gYWNjZXNzb3JzIG9iamVjdCBvbnRvIG1vZHVsZVxyXG4gICBPcHRpb25zIGV4cG9zZWQgb24gYSBtb2R1bGUgYXJlIGEgZ2V0dGVyL3NldHRlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgbW9kdWxlIGl0c2VsZlxyXG4gICBpbiBvcmRlciB0byBjb21wbHkgd2l0aCBkMyByZXVzYWJsZSBpbnRlcmZhY2U6IGFjY2Vzc29yIGNoYWluaW5nLFxyXG4gICBlLmcuIG1vZHVsZS5hY2Nlc3NvcignYScpLmFjY2Vzc29yKCdiJyk7XHJcblxyXG4gICBBY2Nlc3NvciBvYmplY3RzIHNob3VsZCBiZSBnZW5lcmF0ZWQgdmlhIE9iamVjdC5jcmVhdGUoKSB0byBwcm92aWRlXHJcbiAgIHRoZSBhY2Nlc3NvciBvZiBtYW5pcHVsYXRpbmcgZGF0YSB2aWEgZ2V0L3NldCBmdW5jdGlvbnMuXHJcbiovXHJcbnNlbGYuc2V0TW9kdWxlQWNjZXNzb3IgPSBmdW5jdGlvbihtb2R1bGUsIG5hbWUpIHtcclxuICBtb2R1bGVbbmFtZV0gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIG1vZHVsZS5fYWNjZXNzb3JzW25hbWVdO1xyXG4gICAgbW9kdWxlLl9hY2Nlc3NvcnNbbmFtZV0gPSB2YWx1ZTtcclxuICAgIHJldHVybiBtb2R1bGU7XHJcbiAgfVxyXG59O1xyXG4vKlxyXG4gICBBZGQgYWxsIGFjY2Vzc29ycyB0byB0aGUgbW9kdWxlXHJcbiovXHJcbnNlbGYuc2V0TW9kdWxlQWNjZXNzb3JzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcbiAgdmFyIG9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1vZHVsZS5fYWNjZXNzb3JzIHx8IHt9KTtcclxuICBmb3IgKHZhciBpIGluIG9wcykge1xyXG4gICAgc2VsZi5zZXRNb2R1bGVBY2Nlc3Nvcihtb2R1bGUsIG9wc1tpXSk7XHJcbiAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbGY7XHJcbiIsInZhciBzZWxmID0ge307XHJcbnNlbGYuR1VJRCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XHJcbiAgICB2YXIgciA9IE1hdGgucmFuZG9tKCkqMTZ8MCwgdiA9IGMgPT0gJ3gnID8gciA6IChyJjB4M3wweDgpO1xyXG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG4gIH0pO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZlxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBUaW1lOiByZXF1aXJlKCcuL1RpbWUnKSxcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGRheXNQYXNzZWQ6IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdmFyIG9uZURheSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKGVuZCAtIHN0YXJ0KSAvIG9uZURheSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRlY2ltYWxNaW51dGVzOiBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgIHZhciBmb3JtYXQgPSBkMy50aW1lLmZvcm1hdCgnJUg6JU06JVMnKVxyXG4gICAgICAgIHJldHVybiAoZm9ybWF0LnBhcnNlKGRhdGUpIC0gZm9ybWF0LnBhcnNlKCcwOjA6MCcpKS82MDAwMFxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBVdGlsOiByZXF1aXJlKCcuLi9zcmMvY29yZS9VdGlsJyksXHJcbiAgRm9ybWF0OiByZXF1aXJlKCcuLi9zcmMvZm9ybWF0L0Zvcm1hdCcpLFxyXG4gIExheW91dDogcmVxdWlyZSgnLi4vc3JjL2xheW91dC9MYXlvdXQnKSxcclxuICAvL1N2ZzogcmVxdWlyZSgnLi4vc3JjL3N2Zy9TdmcnKVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIFJhZGlhbDogcmVxdWlyZSgnLi9SYWRpYWwnKSxcclxufVxyXG4iLCJ2YXIgQ29uZmlnID0gcmVxdWlyZSgnLi4vY29yZS9Db25maWcnKVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gIC8vIERlZmF1bHQgU2V0dGluZ3NcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIHZhciByb3RhdGUgPSAwXHJcbiAgICAsIHBvc2l0aW9uZXIgPSBOdW1iZXJcclxuICAgICwgcmFkaXVzZXIgPSBmdW5jdGlvbiAoZCkgeyByZXR1cm4gK2QucmFkaXVzIH1cclxuICAgICwgc2l6ZSA9IFsxLDFdXHJcbiAgICAsIHJhbmdlID0gdW5kZWZpbmVkXHJcbiAgICAsIGNvb3JkaW5hdGVTeXN0ZW0gPSAnY2FydGVzaWFuJ1xyXG5cclxuICBmdW5jdGlvbiBnZXRDZW50ZXIoKSB7IHJldHVybiBbc2l6ZVswXSAvIDIsIHNpemVbMV0gLyAyXSB9O1xyXG4gIGZ1bmN0aW9uIHNldENlbnRlcihwb2ludCkgeyBzaXplID0gW3BvaW50WzBdICogMiwgcG9pbnRbMV0gKiAyXSB9XHJcbiAgZnVuY3Rpb24gc2V0UmFuZ2UodmFsdWUpIHsgXHJcbiAgICBpZiAoIXZhbHVlKSByZXR1cm5cclxuICAgIHJhbmdlID0gdmFsdWVcclxuICAgIHNlbGYuX3JhZFNjYWxlci5kb21haW4ocmFuZ2UpXHJcbiAgICBzZWxmLl9ncmFkU2NhbGVyLmRvbWFpbihyYW5nZSlcclxuICB9XHJcblxyXG4gIHZhciBzZWxmID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGlmICghcmFuZ2UpIHNldFJhbmdlKFswLCBkYXRhLmxlbmd0aF0pXHJcbiAgICBzd2l0Y2ggKGNvb3JkaW5hdGVTeXN0ZW0pIHtcclxuICAgICAgY2FzZSAnY2FydGVzaWFuJzogXHJcbiAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgIGQueCA9IGdldENlbnRlcigpWzBdICsgKHJhZGl1c2VyKGQpICogTWF0aC5zaW4oc2VsZi50b1JhZChkKSkpXHJcbiAgICAgICAgICBkLnkgPSBnZXRDZW50ZXIoKVsxXSAtIChyYWRpdXNlcihkKSAqIE1hdGguY29zKHNlbGYudG9SYWQoZCkpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdwb2xhcic6XHJcbiAgICAgICAgZGF0YS5tYXAoZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgIGQucmFkID0gc2VsZi50b1JhZChkKVxyXG4gICAgICAgICAgZC5yYWRpdXMgPSByYWRpdXNlcihkKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGFcclxuICB9XHJcblxyXG4gIHNlbGYuX3JvdGF0ZVJhZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1hdGguUEkgLyAxODAgKiByb3RhdGUgfVxyXG5cclxuICBzZWxmLl9yYWRTY2FsZXIgPSBkMy5zY2FsZS5saW5lYXIoKVxyXG4gICAgICAucmFuZ2UoWzAsIDIgKiBNYXRoLlBJXSlcclxuICBzZWxmLl9ncmFkU2NhbGVyID0gZDMuc2NhbGUubGluZWFyKClcclxuICAgICAgLnJhbmdlKFswLCAzNjBdKVxyXG5cclxuICBzZWxmLnRvUmFkID0gZnVuY3Rpb24gKGQpIHtcclxuICAgIHJldHVybiBzZWxmLl9yYWRTY2FsZXIocG9zaXRpb25lcihkKSkgKyBzZWxmLl9yb3RhdGVSYWQoKVxyXG4gIH1cclxuXHJcbiAgc2VsZi50b0dyYWQgPSBmdW5jdGlvbiAoZCkge1xyXG4gICAgcmV0dXJuIHNlbGYuX2dyYWRTY2FsZXIocG9zaXRpb25lcihkKSkgKyBzZWxmLl9yb3RhdGVcclxuICB9XHJcblxyXG4gIC8vIFB1YmxpYyBWYXJpYWJsZXNcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIHNlbGYuY29uZmlnID0gQ29uZmlnLmNvbmZpZ0ZuLmJpbmQoc2VsZik7XHJcblxyXG4gIHNlbGYuX2FjY2Vzc29ycyA9IE9iamVjdC5jcmVhdGUoe30sIHtcclxuICAgIHJvdGF0ZToge2dldDogZnVuY3Rpb24oKXtyZXR1cm4gcm90YXRlO30sIHNldDogZnVuY3Rpb24odil7cm90YXRlPXY7fX0sXHJcbiAgICAvL0ZpeGVkIHJhZGl1cyBvciByYWRpdXMgYWNjZXNzb3IgZnVuY3Rpb25cclxuICAgIHJhZGl1czoge2dldDogZnVuY3Rpb24oKXtyZXR1cm4gcmFkaXVzZXI7fSwgc2V0OiBmdW5jdGlvbih2KXtyYWRpdXNlciA9IGQzLmZ1bmN0b3Iodik7fX0sXHJcbiAgICBjZW50ZXI6IHtnZXQ6IGdldENlbnRlciwgc2V0OiBzZXRDZW50ZXJ9LFxyXG4gICAgcmFuZ2U6IHtnZXQ6IGZ1bmN0aW9uKCl7cmV0dXJuIHJhbmdlO30sIHNldDogc2V0UmFuZ2V9LFxyXG4gICAgLy9wb3NpdGlvbiBhY2Nlc3NvclxyXG4gICAgcG9zaXRpb246IHtnZXQ6IGZ1bmN0aW9uKCl7cmV0dXJuIHBvc2l0aW9uZXI7fSwgc2V0OiBmdW5jdGlvbih2KXtwb3NpdGlvbmVyPXY7fX0sXHJcbiAgICBzaXplOiB7Z2V0OiBmdW5jdGlvbigpe3JldHVybiBzaXplO30sIHNldDogZnVuY3Rpb24odil7c2l6ZT12O319LFxyXG4gICAgY29vcmRpbmF0ZVN5c3RlbToge2dldDogZnVuY3Rpb24oKXtyZXR1cm4gY29vcmRpbmF0ZVN5c3RlbTt9LCBzZXQ6IGZ1bmN0aW9uKHYpe2Nvb3JkaW5hdGVTeXN0ZW09djt9fSxcclxuICB9KVxyXG5cclxuICBDb25maWcuc2V0TW9kdWxlQWNjZXNzb3JzKHNlbGYpO1xyXG4gIHNlbGYuY29uZmlnKG9wdGlvbnMpO1xyXG4gIFxyXG4gIHJldHVybiBzZWxmXHJcbn1cclxuIl19
