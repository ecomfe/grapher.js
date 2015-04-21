# Grapher.js

Grapher.js is a library built on top of [qtek](https://github.com/pissang/qtek) for 3d plotting. It is relatively small (44kb after gzipped), easy to use and mobile friendly. Currently only surface graph is available.

## Quick Start

```html
<script src="http://pissang.github.io/grapher.js/dist/grapher.js"></script>
```

<pre id="code-quick-start">
var surface = new grapher.Surface(canvas, {
    color: ['green', 'red'],
    xAxis: {
        data: new grapher.generator.Sequence(-Math.PI, Math.PI, 0.4)
    },
    yAxis: {
        data: new grapher.generator.Sequence(-Math.PI, Math.PI, 0.4)
    },
    zAxis: {
        range: [-2, 2],
        data: function (x, y) {
            return Math.sin(x) * Math.sin(y);
        }
    }
});
</pre>

The API is quite simple. All that's needed to create a basic 3d surface plot is to specify the data of x, y, z axes. Styling options such as color gradients are not required but useful for creating a beautiful 3d graph.

And here is the results.

<div class="preview" data-code="code-quick-start"></div>

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

Instead of array, a more convenient way is using the `grapher.generator.Sequence`. You can define the `start`, `end` and `increment`. The following code generate sequence `0, 1, 2, 3 ... 100`

```javascript
var seq = new grapher.generator.Sequence(0, 100, 1);
```

The advantange of `Sequence` is it only contains the three properties described before. Not like array, it doesn't cost memory (especially when it is large) to keep the elements.

Besides `xAxis`, `yAxis`. The data of `zAxis` is really matters. 

### Parametric Surface

A more general way is using parametric surface. Which is defined by a [parametric equation](http://en.wikipedia.org/wiki/Parametric_equation) with two parameters `u` and `v`.

To draw a parametric surface. `parametric` property must be `true`.

In the following example we will draw a sphere with parametric surface. And parameters are respectively `phi` and `theta` in the spherical coordinate system.


<pre id="code-sphere">
var surface = new grapher.Surface(canvas, {
    color: ['green', 'red'],
    parametric: true,
    parameters: {
        u: new grapher.generator.Sequence(-Math.PI, Math.PI, 0.1),
        v: new grapher.generator.Sequence(-Math.PI / 2, Math.PI / 2, 0.1)
    }
    xAxis: {
        data: function (u, v) {
        }
    },
    yAxis: {
        data: function (u, v) {
        }
    },
    zAxis: {
        data: function (u, v) {
        }
    }
});
</pre>


Another mollusc shell example in which equations are much more complex will show you the fun and fascination of parameteric surface

<pre id="code-mollusc-shell">
var cos = Math.cos;
var sin = Math.sin;
var pow = Math.pow;
var Sequence = grapher.generator.Sequence;
var surface = new grapher.Surface(canvas, {
    parametric: true,
    parameters: {
        u: new Sequence(0, Math.PI * 2 + 0.1, 0.1),
        v: new Sequence(-15, 6, 0.3)
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
    autoRotate: true
});
</pre>


### Surface Color

### Wireframe Styling

### Axis Styling

## API
