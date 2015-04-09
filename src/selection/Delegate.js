//TODO remove jquery from implementation
module.exports = function(event, target, handler) {
  function delegate(handler, target) {
    return function() {
      var evtTarget = d3.event.target
      if ($(evtTarget).is(target)) {
        handler.call(evtTarget, evtTarget.__data__)
      }
    }
  }

  return this.on(event, delegate(handler, target))
}
