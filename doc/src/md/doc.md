Grapher.js is a library built on top of [qtek](https://github.com/pissang/qtek) for 3d plotting. It is relatively small (44kb after gzipped), easy to use and mobile friendly. Currently only surface graph is available.

<div id="download">
    <a href="https://raw.githubusercontent.com/ecomfe/grapher.js/master/dist/grapher.js">
        <img src="img/download.svg" alt="">
        Download v0.1
    </a>
</div>

## Quick Start

### Including Grapher.js

You can include Grapher.js with a script tag and will get a `grapher` global namespace.

```html
<script src="grapher.js"></script>
<script>
    // Print version of Grapher.js
    console.log(grapher.version);
</script>
```

Or if you have an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) environment.

```javascript
var grapher = require('grapher');
// Print version of Grapher.js
console.log(grapher.version);

// Or require grapher asynchronously
require(['grapher'], function (grapher) {
    // Create a surface graph    
});
```

### First Example

After including Grapher.js. You can use the `Surface` class in `grapher` namespace to create a basic surface graph.

<pre id="code-quick-start">
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
</pre>

The API is quite simple. All that's needed to create a basic 3d surface plot is to specify the data of x, y, z axes. Styling options such as color gradients are not required but useful for creating a beautiful 3d graph.

And here is the results.

<div class="preview" data-code="code-quick-start"></div>

## Browser Support

Grapher.js can run on almost all mordern browerers on PC and mobile. In the environment with WebGL support, it will use WebGL to render all the 3D objects, which is fast. If the browser doesn't support WebGL, for example browsers in Android and IE9, 10. It will try to use canvas to render  the 3d objects, which of cause, will be much more slower. But for most cases, performance will not be an issue.

## Surface Graph

Surface graph is a graph visualizing equation `z = f(x, y)`. In which z defines the height of  surface over an underlying `(x, y)` grid. In the previous example this eaquation is `z = sin(x) + sin(y)`.

In Grapher.js `x`, `y`, `z` are respectively defined by `xAxis`, `yAxis`, `zAxis`. In each has a property `data`.


### Sequence Data

To construct a regular x-y plane grid, `data` property in `xAxis` and `yAxis` should be regular sequence data. Which can be an array like this:

```
xAxis: {
    data: [1, 2, 3, 4, 5]
},
yAxis: {
    data: [1, 2, 3, 4, 5]
}
```

Instead of array, a more convenient way is using the `grapher.generator.Sequence`. You can define the `start`, `end` and `increment`. The following code will generate sequence `0, 1, 2, 3 ... 100`

```javascript
var seq = new grapher.generator.Sequence(0, 100, 1);
```

The advantange of `Sequence` is it only contains the three properties described before. Not like array, it doesn't cost memory (especially when it is large) to keep the elements.

### Value of Z

Besides `xAxis`, `yAxis`. `data` of `zAxis` is really matters.  As the equation is `z = f(x, y)`. The most intuitional way to get `z` is set `zAxis.data` as a callback function wich has two parameters `x` and `y` and returned the evaluation. For example

```javascript
zAxis: {
    data: function (x, y) {
        return x * x + y * y;
    }
}
```

`zAxis.data` also can be a m-by-n matrix. When `xAxis.data` is an n-vector and `yAxis.data` is an m-vector.


### Parametric Surface

A more general way is using parametric surface. Which is defined by a [parametric equation](http://en.wikipedia.org/wiki/Parametric_equation) with two parameters `u` and `v`.

To draw a parametric surface. `parametric` property must be `true`.

In the following example we will draw a sphere with parametric surface. And parameters are respectively `phi` and `theta` in the spherical coordinate system.


<pre id="code-sphere">
var sin = Math.sin;
var cos = Math.cos;
var PI = Math.PI;
var surface = new grapher.Surface(canvas, {
    color: ['green', 'red'],
    parametric: true,
    parameters: {
        u: new grapher.generator.Sequence(-PI, PI, PI / 20),
        v: new grapher.generator.Sequence(0, PI, PI / 20)
    },
    xAxis: {
        data: function (u, v) {
            return sin(u) * sin(v);
        }
    },
    yAxis: {
        data: function (u, v) {
            return sin(u) * cos(v);
        }
    },
    zAxis: {
        data: function (u, v) {
            return cos(u);
        }
    },
    autoRotate: false
});
</pre>

<div class="preview" data-code="code-sphere"></div>

Another mollusc shell example in which equations are much more complex will show you the fun and fascination of parameteric surface.

<pre id="code-mollusc-shell">
var cos = Math.cos;
var sin = Math.sin;
var pow = Math.pow;
var Sequence = grapher.generator.Sequence;
var surface = new grapher.Surface(canvas, {
    parametric: true,
    parameters: {
        u: new Sequence(0, Math.PI * 2, Math.PI / 30),
        v: new Sequence(-15, 6, 0.21)
    },
    xAxis: {
        data: function (u, v) {
            return pow(1.16, v) * cos(v) * (1 + cos(u));
        }
    },
    yAxis: {
        data: function (u, v) {
            return -pow(1.16, v) * sin(v) * (1 + cos(u));
        }
    },
    zAxis: {
        data: function (u, v) {
            return -2 * pow(1.16, v) * (1 + sin(u));
        }
    },
    autoRotate: false
});
</pre>

<div class="preview" data-code="code-mollusc-shell"></div>

### Surface Color

Points on the surface can be colored differently to make the graph more clearly and beautiful.

For each point in the surface with coord `x`, `y`, `z=f(x, y)`. We define the color of it is `C(x, y, z)`. 


#### Color Function

As described before, color is a function of `x`, `y`, `z`. And more generally we want the `x`, `y`, `z` to be a percent value from 0 to 1 to make the color mapping more convenient. Like the following example

```javascript
color: function (x0, y0, z0, x, y, z) {
    var round = Math.round;
    return 'rgb(' + round(x0 * 255) + ',' + round(y0 * 255) + ',' + round(z0 * 255) + ')';
}
```

First three parameters are the percent value of `x`, `y`, `z`. Second three parameters are the real value. 

If we apply the color function to the mollusc shell example.

<script type="example/javascript" class="code" id="code-mollusc-shell-color" style="display:none;">
var cos = Math.cos;
var sin = Math.sin;
var pow = Math.pow;
var Sequence = grapher.generator.Sequence;
var surface = new grapher.Surface(canvas, {
    parametric: true,
    parameters: {
        u: new Sequence(0, Math.PI * 2, Math.PI / 30),
        v: new Sequence(-15, 6, 0.21)
    },
    color: function (x0, y0, z0, x, y, z) {
        var round = Math.round;
        return 'rgb(' + round(x0 * 255) + ',' + round(y0 * 255) + ',' + round(z0 * 255) + ')';
    },
    xAxis: {
        data: function (u, v) {
            return pow(1.16, v) * cos(v) * (1 + cos(u));
        }
    },
    yAxis: {
        data: function (u, v) {
            return -pow(1.16, v) * sin(v) * (1 + cos(u));
        }
    },
    zAxis: {
        data: function (u, v) {
            return -2 * pow(1.16, v) * (1 + sin(u));
        }
    },
    autoRotate: false
});
</script>

<div class="preview" data-code="code-mollusc-shell-color"></div>
 
Here is the logo!

#### Color Gradient

Default color function in `Grapher.js` is a linear gradient from smaller z value to larger z value. Which can be described with a list of color strings. Following configuration will have a gradient from light grey to deep grey.

```javascript
color: ['#eee', '#111']
```


### Full Option of Surface

```javascript
{
    // Line width of x, y, z axis
    axisLineWidth: 3,
    
    // Line width of axis outline wireframe
    axisWireframeLineWidth: 1,
    
    // Line color of axis outline wireframe
    axisWireframeLineColor: 'grey',

    // If show wireframe of surface
    showWireframe: true,

    // Surface wireframe color
    wireframeLineColor: '#111',

    // Surface wireframe line width
    wireframeLineWidth: 1,
    
    // Camera projection, 'orthographic' or 'perspective'
    projection: 'orthographic',
    
    // Choose renderer, default is 'auto', which will use WebGL renderer
    // If possible. You can force it using canvas renderer by setting value 
    // 'canvas'
    renderer: 'auto',
    
    // If autorotate the scene
    autoRotate: true,
    
    // If surface is parametric
    parametric: false,

    // Color gradient or color function
    color: ['red', 'green'],
    
    // U, V Sequence of parametric equation
    // Used if parametric is true
    parameters: {
        u: new Sequence(0, 1, 0.05),
        v: new Sequence(0, 1, 0.05)
    },

    xAxis: {
        // Line color of x axis
        lineColor: '#f00',
        data: new Sequence(0, 1, 0.05)
    },
    yAxis: {
        // Line color of y axis
        lineColor: '#0f0',
        data: new Sequence(0, 1, 0.05)
    },
    zAxis: {
        // Line color of z axis
        lineColor: '#00f',
        data: function (x, y) { return 1; }
    }
};
```