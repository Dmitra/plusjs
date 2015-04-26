#PlusJS
  reusable and configurable js library for data visualizations

  Built with love and D3.js.

  Consist of many modules and has similar structure as d3 do internally. By virtue of browserify they can be used individually.

##Demo
There are some examples available:
[Composite radial visualization](http://dmitra.com/vis/runstat/index.html)
[Radial visualization](http://dmitra.com/vis/cityweather/index.html)

##Usage
  You may include dependencies and vis.min.js downloaded from this repository or use browserify to include only necessary modules from source.

##Modules
###Array
  d3.cumulative
  lodash has many usefull methods - how to merge them with d3?
  test d3.min vs _.min performance

###Selection
  d3.selection.delegate as https://groups.google.com/forum/#!topic/d3-js/lpezER89BOc

###Layout
  operates on data
  writes **relative** coordinates to data attributes (naming by *convention*)
  have public functions to set relative positioning configuration, data input ranges(domain)
    e.g.
      Pie: startAngle, endAngle - sets start/end of the whole layout
      Radial: range
  Hierarchy
    Tree - 
    Cluster - same as Tree, but produces dendograms with leafs on the same level
    +Partition
    Pack
    Treemap
  -Bundle - Radial with mutial links inside circle
  -Chord - show relationships among a group of entities
  Force
  +Pie - TODO generalize
  ?Histogram

###Svg
  operates on elements
  have public functions to set coordinate **absolute** binding
  and **relative** which by conventions reads the attributes set in the *Layout*
    e.g.
      Arc relative accessors: startAngle, endAngle - sets start/end of each arc
      Arc absolute accessors: innerRadius, outerRadius - sets absolute binding to the [0,0] point of the container
  Axis
  Shapes
    Arc
    Area
    Diagonal
    Line
    Symbol
    -Chord
  Control
    Brush
    Lasso - implemented as plugin

###Behavior
  ~Zoom
  ~Pan
  ~D&D
  ~Selection
###Core
###Format

##Dependencies
  d3.js
  lodash.js
##Roadmap
### Add more visual elements
  * Axis labels in the middle. Custom axis OR rewrite D3.svg.axis?

##License
    MIT
