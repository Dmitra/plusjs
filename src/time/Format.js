/**
*/
var Self = function (key) {
  if (key && _.contains(key, '%')) {
    return d3.time.format(key)
  } else {
    return function (date) {
      return d3.time.format('%' + [key[0]])(date).slice(0, key.length)
    }
  }
}

module.exports = Self
