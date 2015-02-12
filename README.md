#Vis
reusable and configurable js library for radial visualizations

Built with love and D3.js

##Demo
[Several radial charts in one visualization](http://dmitra.com/vis/example/Runstat.htm)

##Usage
Include d3.js and vis.min.js downloaded from this repository
```html
<!DOCTYPE HTML>
<html><head>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="vis.min.js"></script>
</head>
<body>
  <script type="text/javascript">
    // Specify config for chart
    var config = {
      target: vis,
      width: width,
      height: height,
    }
    //Load data from csv for example
    d3.csv('data.csv', function (data) {
      // create charts
      var rayChart = new Vis.Radial.Ray(config)
      rayChart.draw(data)
    }
  </script>
</body></html>
```
When developing locally, note that your browser may enforce strict permissions for reading files out of the local file system. If you use d3.xhr locally (including d3.json et al.), you must have a local web server. For example, you can run Python's built-in server:

    python -m SimpleHTTPServer 8888 &

##Dependency
    D3.js
    underscore.js
##Roadmap
+ Extend interactivity
  clickable items
+ Add animation

##License
    MIT
