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
 * @return number of passed intervals of specified @intervalName in this
 */
Self.prototype.contains = function (intervalName) {
  var step = 1
  if (intervalName === 'decade') {
    intervalName = 'year'
    step = 10
  }
  if (!d3.time[intervalName]) return
  return d3.time[intervalName].range(this.start, this.end, step).length
}

module.exports = Self
