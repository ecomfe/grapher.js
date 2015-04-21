define(function (require) {
    
    'use strict';

    var Cartesian3D = require('./component/Cartesian3D');
    var App3D = require('../core/App3D');
    var vendor = require('../core/vendor');
    var number = require('../core/number');
    var colorTool = require('../core/color');

    var DynamicGeometry = require('qtek/DynamicGeometry');
    var Scene = require('qtek/Scene');
    var PerspectiveCamera = require('qtek/camera/Perspective');
    var OrthoCamera = require('qtek/camera/Orthographic');
    var qtekUtil = require('qtek/core/util');
    var Renderable = require('qtek/Renderable');
    var Node3D = require('qtek/Node');
    var glMatrix = require('qtek/dep/glmatrix');
    var vec4 = glMatrix.vec4;
    var OrbitControl = require('./component/OrbitControl');

    var Sequence = require('../generator/Sequence');

    var rangeOfData = number.rangeOfData;

    var BLACK = [0, 0, 0, 1];

    var DEFAULTS = {

        axisLineWidth: 1,

        axisOutlineWidth: 1,

        axisOutlineColor: 'grey',

        showGrid: true,

        gridLineColor: '#111',

        gridLineWidth: 1,

        projection: 'orthographic',

        renderer: 'auto',

        autoRotate: true,

        parametric: false,

        color: ['red', 'green'],

        // If parametric is true
        parameters: {
            u: new Sequence(0, 1, 0.05),
            v: new Sequence(0, 1, 0.05)
        }
    };

    var BOX_SIZE = 100;
    /**
     * Surface Graph
     * @param {HTMLCanvasElement} canvas
     * @param {Object} opts
     */
    function SurfaceGraph(canvas, opts) {

        this._init(canvas, opts);
    }

    SurfaceGraph.prototype = {

        constructor: SurfaceGraph,

        resize: function (width, height) {
            this._app3d.resize(width, height);

            var camera = this._camera;
            var aspect = this._app3d.getRenderer().getViewportAspect();
            if (camera instanceof OrthoCamera) {
                camera.left = -BOX_SIZE * aspect;
                camera.right = BOX_SIZE * aspect;
            }
            else {
                camera.aspect = aspect;
            }
        },

        _init: function (canvas, opts) {
            // Clone and extend default options
            opts = qtekUtil.extend({}, opts);
            qtekUtil.defaults(opts, DEFAULTS);

            var app3d = new App3D(canvas, {
                renderer: opts.renderer
            });
            this._app3d = app3d;

            var dataOpts = this._convertData(opts);
            var data = dataOpts.data;
            var xRange = opts.xAxis.range || rangeOfData(data.map(function (a) {return a.x}));
            var yRange = opts.yAxis.range || rangeOfData(data.map(function (a) {return a.y}));
            var zRange = opts.zAxis.range || rangeOfData(data.map(function (a) {return a.z}));

            var cartesian = new Cartesian3D(app3d, {
                xAxis: qtekUtil.extend({
                        range: xRange
                    }, opts.xAxis),
                yAxis: qtekUtil.extend({
                        range: yRange
                    }, opts.yAxis),
                zAxis: qtekUtil.extend({
                        range: zRange
                    }, opts.zAxis),
                renderer: opts.renderer,
                axisLineWidth: opts.axisLineWidth,
                axisOutlineWidth: opts.axisOutlineWidth,
                axisOutlineColor: opts.axisOutlineColor,
                size: BOX_SIZE
            });
            this._cartesian = cartesian;

            var scene = new Scene();
            // Dummy node
            var dummy = new Node3D();
            dummy.rotation
                .rotateX(Math.PI / 5)
                .rotateY(-Math.PI / 4);
            var control = new OrbitControl(app3d, {
                target: dummy,
                autoRotate: opts.autoRotate
            });
            this._orbitControl = control;

            var root = new Node3D();
            root.add(cartesian.root);

            dummy.add(root);
            scene.add(dummy);

            // Z UP
            root.rotation.rotateX(-Math.PI / 2);
            root.position.set(-BOX_SIZE / 2, -BOX_SIZE / 2, BOX_SIZE / 2);

            var aspect = app3d.getRenderer().getViewportAspect();
            var camera = opts.projection.toLowerCase() === 'orthographic'
                ? new OrthoCamera({
                    left: -BOX_SIZE * aspect,
                    right: BOX_SIZE * aspect,
                    bottom: -BOX_SIZE,
                    top: BOX_SIZE,
                    near: 0,
                    far: BOX_SIZE * 10
                })
                : new PerspectiveCamera({
                    aspect: aspect,
                    far: BOX_SIZE * 10,
                    fov: 50
                });

            camera.position.set(0, 0, BOX_SIZE * 2.5);
            camera.lookAt(scene.position);

            this._scene = scene;
            this._camera = camera;
            this._root = root;

            this._constructSurface(dataOpts, opts);

            app3d.on('render', this._doRender, this);
            app3d.on('frame', this._frameUpdate, this);

            this.resize();
        },

        _doRender: function (renderer) {
            renderer.render(this._scene, this._camera);
        },

        _frameUpdate: function (deltaTime) {
            this._orbitControl.update(deltaTime);
        },

        _convertData: function (opts) {

            var xData = opts.xAxis.data;
            var yData = opts.yAxis.data;
            var zData = opts.zAxis.data;

            var xDataFunction = typeof xData == 'function';
            var yDataFunction = typeof yData == 'function';
            var zDataFunction = typeof zData == 'function';

            var parametric = opts.parametric;
            var data = [];

            var uLen;
            var vLen;
            if (parametric) { // Parametric Surface
                // Two optional data source
                // 1. x.data, y.data, z.data are all functions
                // 2. All data are m-by-n matrix
                if (xDataFunction && yDataFunction && zDataFunction) {
                    var parameters = opts.parameters;
                    var uGen = parameters.u;
                    var vGen = parameters.v;

                    if (!((uGen instanceof Sequence) && (vGen instanceof Sequence))) {
                        console.warn('Parameters u, v must be grapher.generator.Sequence')
                        return;
                    }
                    uLen = uGen.length();
                    vLen = vGen.length();

                    for (var i = 0; i < uLen; i++) {
                        var u = uGen.at(i);
                        for (var j = 0; j < vLen; j++) {
                            var v = vGen.at(j);

                            var x = xData(u, v);
                            var y = yData(u, v);
                            var z = zData(u, v);

                            data.push({
                                x: x,
                                y: y,
                                z: z
                            });
                        }
                    }
                }
                else {
                    if (! number.sameDimensions(xData, yData, zData)) {
                        console.warn('x, y, z don\'t have same dimensions');
                    }

                    var dims = number.getDimensions(xData);
                    vLen = dims[0];
                    uLen = dims[1];

                    for (var i = 0; i < vLen; i++) {
                        for (var j = 0; j < uLen; j++) {
                            var x = xData(u, v);
                            var y = yData(u, v);
                            var z = zData(u, v);

                            data.push({
                                x: x,
                                y: y,
                                z: z
                            });
                        }
                    }
                }
            }
            else {
                // 1. x.data, y.data are grapher.generator.Sequence, default are [0, 100, 5]
                // 2. x.data is m-array, y.data is n-array
                // 
                // 1. z.data is a generator function
                // 2. z.data is n-by-m matrix
                
                xData = xData || new Sequence(0, 100, 5);
                yData = yData || new Sequence(0, 100, 5);

                var xDataSequence = xData instanceof Sequence;
                var yDataSequence = yData instanceof Sequence;
                uLen = xDataSequence ? xData.length() : xData.length;
                vLen = yDataSequence ? yData.length() : yData.length;

                for (var i = 0; i < vLen; i++) {
                    var y = yDataSequence ? yData.at(i) : yData[i];
                    for (var j = 0; j < uLen; j++) {
                        var x = xDataSequence ? xData.at(j) : xData[j];
                        var z;
                        if (zDataFunction) {
                            z = zData(x, y);
                        }
                        else {
                            z = zData[i][j];
                        }
                        data.push({
                            x: x,
                            y: y,
                            z: z
                        });
                    }
                }
            }

            return {
                uLen: uLen,
                vLen: vLen,
                data: data
            }
        },

        _constructSurface: function (dataOpts, opts) {
            var surfaceGeo = new DynamicGeometry();
            var gridGeo = opts.showGrid && new DynamicGeometry();

            var attributes = surfaceGeo.attributes;
            var positionAttrib = attributes.position;
            var colorAttrib = attributes.color;
            var cartesian = this._cartesian;

            var uLen = dataOpts.uLen;
            var vLen = dataOpts.vLen;
            var data = dataOpts.data;

            var xRange = rangeOfData(data.map(function (a) {return a.x}));;
            var yRange = rangeOfData(data.map(function (a) {return a.y}));;
            var zRange = rangeOfData(data.map(function (a) {return a.z}));;

            // Color gradient
            var colorCfg = opts.color;
            var isColorGradient = colorCfg instanceof Array;
            var isColorFunction = typeof colorCfg === 'function';
            var colorSteps;
            if (isColorGradient) {
                colorSteps = colorCfg.map(function (c) {
                    return colorTool.parse(c) || BLACK;
                });
            }

            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                var coord = cartesian.valueToCoord(value);
                var z = coord.z;
                positionAttrib.set(i, [coord.x, coord.y, coord.z]);

                var color;
                if (isColorGradient) {
                    var zPercent = (value.z - zRange[0]) / (zRange[1] - zRange[0]);
                    var nColorStep = colorSteps.length;
                    if (zPercent === 1) {
                        color = colorSteps[nColorStep - 1].slice();
                    }
                    else {
                        var pp = (nColorStep - 1) * zPercent;
                        var idx = Math.floor(pp);
                        color = vec4.lerp([], colorSteps[idx], colorSteps[idx + 1], pp - idx);
                    }
                }
                else {
                    var xPercent = (value.x - xRange[0]) / (xRange[1] - xRange[0]);
                    var yPercent = (value.y - yRange[0]) / (yRange[1] - yRange[0]);
                    var zPercent = (value.z - zRange[0]) / (zRange[1] - zRange[0]);
                    color = colorTool.parse(colorCfg(xPercent, yPercent, zPercent, x, y, z)) || BLACK;
                }

                colorAttrib.set(i, color);
            }
            // Build triangles
            var faces = surfaceGeo.faces = [];
            var idx = 0;

            var positionArr = positionAttrib.value;
            var gridPositionAttrib = gridGeo && gridGeo.attributes.position;
            for (var i = 0; i < uLen; i++) {
                for (var j = 0; j < vLen; j++) {
                    var i2 = i * vLen + j;
                    var i1 = i * vLen + j + 1;
                    var i4 = (i + 1) * vLen + j + 1;
                    var i3 = (i + 1) * vLen + j;

                    if (i < uLen - 1 && j < vLen - 1 ) {
                        faces.push([i1, i2, i4], [i2, i3, i4]);

                        if (gridGeo) {
                            // Line1
                            gridPositionAttrib.set(idx++, positionArr[i1]);
                            gridPositionAttrib.set(idx++, positionArr[i2]);
                            // Line2
                            gridPositionAttrib.set(idx++, positionArr[i2]);
                            gridPositionAttrib.set(idx++, positionArr[i3]);
                        }
                    }
                    else if (i === uLen - 1 && j === vLen - 1) {
                        continue;   
                    }
                    // Outlines
                    else if (i === uLen - 1) {
                        if (gridGeo) {
                            gridPositionAttrib.set(idx++, positionArr[i1]);
                            gridPositionAttrib.set(idx++, positionArr[i2]);
                        }
                    }
                    else {
                        if (gridGeo) {
                            gridPositionAttrib.set(idx++, positionArr[i2]);
                            gridPositionAttrib.set(idx++, positionArr[i3]);
                        }
                    }
                }
            }


            var app3d = this._app3d;
            var root = this._root;
            var surfaceMesh = new Renderable({
                geometry: surfaceGeo,
                material: app3d.createColorMaterial([1, 1, 1], 1, true),
                culling: false
            });

            root.add(surfaceMesh);

            if (gridGeo) {
                var mat = app3d.createColorMaterial(colorTool.parse(opts.gridLineColor) || BLACK, 1);
                var gridMesh1 = new Renderable({
                    geometry: gridGeo,
                    material: mat,
                    culling: false,
                    lineWidth: opts.gridLineWidth,
                    mode: Renderable.LINES
                });

                var gridMesh2 = new Renderable({
                    geometry: gridGeo,
                    material: mat,
                    culling: false,
                    lineWidth: opts.gridLineWidth,
                    mode: Renderable.LINES
                });

                root.add(gridMesh1);
                root.add(gridMesh2);
                // Avoid z-fighting
                // FIXME Better solution ?
                gridMesh1.scale.set(1.002, 1.002, 1.002);
                gridMesh2.scale.set(0.999, 0.999, 0.999);
            }
        }
    }

    SurfaceGraph.DEFAULTS = DEFAULTS;

    return SurfaceGraph;
});