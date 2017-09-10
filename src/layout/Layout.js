module.exports = {
  Radial: require('./Radial'),
  Stacked: require('./Stacked'),
}
/*
  Layout - is a transformation algorythm of input semantic values to the output set of {x, y} points
    1-dimensional layout is a set of points. Each one is defined by 2 coordinates {x, y}
    each measurable dimension is set by quantitative 'scale' - which transforms input value to the output by 'domain' and 'range'

    layout itself is calculated with provided functions

    Output of layout is a set of points

    config options
      dimensions number

    functions for layout calculation of output data
      start
      end

  Stacked area - the same as bars but formed of lines

Examples

  Pie - 1d, recursive
    scale.domain = [0, sum(values)]
    scale.range = [0, 2PI]
    start = 0 || end[i-1] + padding
    end = start + scale(value)

  Star - 2d
    scale.domain = [0, max(values)]
    scale.range = [0, radius]
    start = 0
    end = scale(value)

  Stacked bar - 1d, recursive
    scale.domain = [0, sum(values)] or [0, someValue]
    scale.range = [0, totalLength] or [0, somePixels]
    start = 0 || end[i-1] + padding
    end = start + scale(value)

  Bar - 2d
    scale1.domain = [0, data.length]
    scale1.range = [0, width]
    start1 = scale1(i)
    end1 = start1 + padding1

    scale2.domain = [minValue, maxValue]
    scale2.range = [0, height]
    start2 = 0
    end2 = scale2(value)

  Stacked bars - 2d for N data sets (series)
    scale.domain = [0, max(series.length)]
    scale.range = [0, width]
    start1 = scale1(i)
    end1 = start1 + padding1

    Stacked bar
      scale.domain = [0, sum(max(seriesValues))]
      scale.range = [0, height] 
      start = 0 || end[i-1] + padding
      end = start + scale(value)

*/
