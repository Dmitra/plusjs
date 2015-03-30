/**
 * Interval of time with start in the past and end after start
 */
var Self = function (start, end) {
  var self = this
  self.start = start
  self.end = end
}

/**
 * Round start and end of the interval to the nearest start of the specified interval @name in the past
 * @name String name of the interval
 * @returns Interval
 */
Self.prototype.floor = function (intervalName) {
  var self = this
  , start
  , end
  start = d3.time[intervalName].floor(self.start)
  end = d3.time[intervalName].floor(self.end)
  //TODO find better solution
  //change the end of the interval to be within the interval
  //end = d3.time.second.offset(end, -1)
  return new Self(start, end)
}
/**
 * @return number of passed intervals of specified @intervalName in this
 */
Self.prototype.contains = function (intervalName) {
  if (!d3.time[intervalName]) return
  return d3.time[intervalName].range(this.start, this.end, 1).length
}

//Object.defineProperty(Self.prototype, "start", {
  //set: function () {
  //}
//})
//Object.defineProperty(Self.prototype, "end", {
  //set: function () {
  //}
//})

module.exports = Self
