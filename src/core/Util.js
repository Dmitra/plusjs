var poly2tri = require('poly2tri')

var Self = {};
Self.GUID = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
Self.isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

Self.centerOfTriangle = function (triangle) {
  var points = triangle.points_;

  return {
    x: (points[0].x + points[1].x + points[2].x) / 3,
    y: (points[0].y + points[1].y + points[2].y) / 3
  };
}

Self.areaOfTriangle = function (triangle) {
  var points = triangle.points_,
    point1 = points[0],
    point2 = points[1],
    point3 = points[2],
    x1 = point1.x,
    x2 = point2.x,
    x3 = point3.x,
    y1 = point1.y,
    y2 = point2.y,
    y3 = point3.y;

  return ((x1 * (y2 - y3)) + (x2 * (y3 - y1)) + (x3 * (y1 - y2))) / 2;
}

Self.largestTriangle = function (triangles) {
  var largest = null,
    triangle,
    i = 0;

  for(; i<triangles.length; i++) {
    triangle = triangles[i];
    triangle.area = Self.areaOfTriangle(triangle)
    if (largest === null) {
      largest = triangle;
      continue;
    }

    if ( triangle.area > largest.area ) {
      largest = triangle;
    }
  }

  return largest;
}

Self.centroid2 = function (points) {
  points = Self.clipPolygon(points)
  var contour = []
  _.each(points, function (point) {
    contour.push(new poly2tri.Point(point[0], point[1]))
  })
  var swctx = new poly2tri.SweepContext(contour)
  swctx.triangulate()
  var triangles = swctx.getTriangles()
  var triangle = Self.largestTriangle(triangles)
  return Self.centerOfTriangle(triangle)
}

module.exports = Self
