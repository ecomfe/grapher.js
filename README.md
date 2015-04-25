# Grapher.js

Grapher.js is a library built on top of [qtek](https://github.com/pissang/qtek) for 3d plotting. It is relatively small (44kb after gzipped), easy to use and mobile friendly. Currently only surface graph is available.


####[Download v0.1](https://raw.githubusercontent.com/ecomfe/grapher.js/master/dist/grapher.js)

####[Documentation](http://ecomfe.github.io/grapher.js/doc/)


## Quick Start

#### Including Grapher.js

You can including Grapher.js by script tag and get a `grapher` global namespace.

```html
<script src="grapher.js"></script>
<script>
    // Print version of Grapher.js
    console.log(grapher.version);
</script>
```

If you have an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) environment.

```javascript
var grapher = require('grapher');
// Print version of Grapher.js
console.log(grapher.version);


// Or require grapher asynchronously
require(['grapher'], function (grapher) {
    // Create a surface graph    
});
```

#### First Example

After including Grapher.js. You can use the `Surface` class in `grapher` namespace to create a basic surface graph.

```javascript
var surface = new grapher.Surface(canvas, {
    color: ['green', 'red'],
    xAxis: {
        data: new grapher.generator.Sequence(-1, 1, 0.1)
    },
    yAxis: {
        data: new grapher.generator.Sequence(-1, 1, 0.1)
    },
    zAxis: {
        range: [-2, 2],
        data: function (x, y) {
            return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
        }
    },
    autoRotate: false
});
```