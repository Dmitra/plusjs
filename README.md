#Vis
reusable and configurable js library for radial visualizations

Built with love and D3.js

##Demo
[Composite visualization](http://dmitra.com/vis/example/Runstat.htm)

##Usage
You may include dependencies and vis.min.js downloaded from this repository or use browserify to include only necessary modules from source. See [examples](https://github.com/Dmitra/Vis/tree/master/example) for details.

When developing locally, note that your browser may enforce strict permissions for reading files out of the local file system. If you use d3.xhr locally (including d3.json et al.), you must have a local web server. For example, you can run Python's built-in server:

    python -m SimpleHTTPServer 8888 &

##Dependencies
    D3.js
    underscore.js
##Roadmap
+ Add more visual elements
+ Interactivity
+ Add animation

##License
    MIT
