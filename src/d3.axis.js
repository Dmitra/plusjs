var ε = 1e-6,
    ε2 = ε * ε,
    π = Math.PI,
    τ = 2 * π,
    τε = τ - ε,
    halfπ = π / 2,
    d3_radians = π / 180,
    d3_degrees = 180 / π;
function d3_identity(d) {
  return d;
}
function d3_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1];
  return start < stop ? [start, stop] : [stop, start];
}

function d3_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}

module.exports = function (options) {
  var self = this;

  var scale = d3.scale.linear(),
    orient = self._defaultOrient,
    innerTickSize = 6,
    outerTickSize = 6,
    tickPadding = 3,
    tickArguments_ = [10],
    tickValues = null,
    tickFormat_;

  self._defaultOrient = "bottom",
  self._orients = {top: 1, right: 1, bottom: 1, left: 1};

  self.draw = function (g) {
    g.each(function() {
      var g = d3.select(this);

      // Stash a snapshot of the new scale, and retrieve the old snapshot.
      var scale0 = this.__chart__ || scale,
      scale1 = this.__chart__ = scale.copy();

      // Ticks, or domain values for ordinal scales.
      var ticks = tickValues == null ? (scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain()) : tickValues,
      tickFormat = tickFormat_ == null ? (scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity) : tickFormat_,
      tick = g.selectAll(".tick").data(ticks, scale1),
      tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε),
      tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(),
      tickUpdate = d3.transition(tick.order()).style("opacity", 1),
      tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
      tickTransform;

      // Domain.
      var range = d3_scaleRange(scale1),
      path = g.selectAll(".domain").data([0]),
      pathUpdate = (path.enter().append("path").attr("class", "domain"), d3.transition(path));

      tickEnter.append("line");
      tickEnter.append("text");

      var lineEnter = tickEnter.select("line"),
        lineUpdate = tickUpdate.select("line"),
        text = tick.select("text").text(tickFormat),
        textEnter = tickEnter.select("text"),
        textUpdate = tickUpdate.select("text"),
        sign = orient === "top" || orient === "left" ? -1 : 1,
        x1, x2, y1, y2;

      if (orient === "bottom" || orient === "top") {
        tickTransform = self._x, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
        text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
        pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
      } else {
        tickTransform = self._y, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
        text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
        pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
      }

      lineEnter.attr(y2, sign * innerTickSize);
      textEnter.attr(y1, sign * tickSpacing);
      lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
      textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);

      // If either the new or old scale is ordinal,
      // entering ticks are undefined in the old scale,
      // and so can fade-in in the new scale’s position.
      // Exiting ticks are likewise undefined in the new scale,
      // and so can fade-out in the old scale’s position.
      if (scale1.rangeBand) {
        var x = scale1, dx = x.rangeBand() / 2;
        scale0 = scale1 = function(d) { return x(d) + dx; };
      } else if (scale0.rangeBand) {
        scale0 = scale1;
      } else {
        tickExit.call(tickTransform, scale1, scale0);
      }

      tickEnter.call(tickTransform, scale0, scale1);
      tickUpdate.call(tickTransform, scale1, scale1);
    });
  }

  self.scale = function(x) {
    if (!arguments.length) return scale;
    scale = x;
    return self;
  };

  self.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x in self._orients ? x + "" : self._defaultOrient;
    return self;
  };

  self.ticks = function() {
    if (!arguments.length) return tickArguments_;
    tickArguments_ = arguments;
    return self;
  };

  self.tickValues = function(x) {
    if (!arguments.length) return tickValues;
    tickValues = x;
    return self;
  };

  self.tickFormat = function(x) {
    if (!arguments.length) return tickFormat_;
    tickFormat_ = x;
    return self;
  };

  self.tickSize = function(x) {
    var n = arguments.length;
    if (!n) return innerTickSize;
    innerTickSize = +x;
    outerTickSize = +arguments[n - 1];
    return self;
  };

  self.innerTickSize = function(x) {
    if (!arguments.length) return innerTickSize;
    innerTickSize = +x;
    return self;
  };

  self.outerTickSize = function(x) {
    if (!arguments.length) return outerTickSize;
    outerTickSize = +x;
    return self;
  };

  self.tickPadding = function(x) {
    if (!arguments.length) return tickPadding;
    tickPadding = +x;
    return self;
  };

  self.tickSubdivide = function() {
    return arguments.length && self;
  };

  self._x = function (selection, x0, x1) {
    selection.attr("transform", function(d) { var v0 = x0(d); return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)"; });
  }

  self._y = function (selection, y0, y1) {
    selection.attr("transform", function(d) { var v0 = y0(d); return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")"; });

  }
}
