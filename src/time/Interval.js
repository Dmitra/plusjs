/**
 * Interval of time with start in the past and end after start
 */
var Self = function (start, end) {
  var self = this
  self.start = start
  self.end = end
}
Self.weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

/**
 * Round start and end of the interval to the nearest start of the specified interval @name in the past
 * @name String name of the interval
 * @returns Interval
 */
Self.prototype.floor = function (intervalName) {
  var self = this
  //Do not floor to week with custom start
  if (_.contains(Self.weekDays, intervalName)) {
    return self
  } else {
    return new Self(d3.time[intervalName].floor(self.start), d3.time[intervalName].floor(self.end))
  }
}
/**
 * @returns Number of full calendar intervals named @intervalName in this
 */
Self.prototype.count = function (intervalName) {
  var self = this
  if (!d3.time[intervalName]) return

  //end of the nearest calendar [intervalName] interval
  var calEnd = d3.time[intervalName](self.end)

  //calculate fraction of the interval
  var fraction = 0
  if (calEnd < self.end) {
    var nextCalEnd = d3.time[intervalName].offset(calEnd, 1)
    fraction = (self.end - calEnd)/(nextCalEnd - calEnd)
  }

  return d3.time[intervalName].range(self.start, calEnd).length + fraction
}

Self.prototype.contains = function (intervalName) {
  var self = this
  return self.count(intervalName) >= 1
}

module.exports = Self
