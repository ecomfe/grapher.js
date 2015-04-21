define(function (require) {

    var Cartesian = require('../../coordinate/Cartesian');
    var LinesGeo = require('../../geometry/Lines');
    var colorTool = require('../../core/color');

    var Node3D = require('qtek/Node');
    var Renderable = require('qtek/Renderable');
    var qtekUtil = require('qtek/core/util');
    var Vector3 = require('qtek/math/Vector3');

    var axes = ['x', 'y', 'z'];

    var DEFAULTS = {
        x: {
            lineColor: '#f00'
        },
        y: {
            lineColor: '#0f0'
        },
        z: {
            lineColor: '#00f'
        }
    }

    var Cartesian3D = function (app3d, opts) {

        opts = opts || {};
        var size = opts.size || 100;
        var cartesian = new Cartesian(size);

        var root = new Node3D({
            name: 'cartesian'
        });
        root.scale.set(size, size, size);

        this.root = root;

        this._cartesian = cartesian;

        this._app3d = app3d;

        this._initAxes(opts);
    };

    Cartesian3D.prototype = {

        constructor: Cartesian3D,

        valueToCoord: function (val) {
            return this._cartesian.valueToCoord(val);
        },

        coordToValue: function (coord) {
            return this._cartesian.coordToValue(coord);
        },

        _initAxes: function (opts) {
            var self = this;
            var app3d = this._app3d;
            var renderable = new Renderable({
                geometry: new LinesGeo(),
                material: app3d.createColorMaterial([1, 1, 1], 1, true),
                mode: Renderable.LINES,
                lineWidth: opts.axisLineWidth,
            });
            var boxRenderable = new Renderable({
                geometry: new LinesGeo(),
                material: app3d.createColorMaterial(colorTool.parse(opts.axisWireframeLineColor), 1, false),
                mode: Renderable.LINES,
                lineWidth: opts.axisWireframeLineWidth,
            });

            this.root.add(renderable);
            this.root.add(boxRenderable);

            var ZERO = [0, 0, 0];

            var vectors = {
                x: [1, 0, 0],
                y: [0, 1, 0],
                z: [0, 0, 1]
            };

            axes.forEach(function (dim, idx) {
                // Clone and extend default options
                var axisOpts = qtekUtil.extend({}, opts[dim + 'Axis']);
                qtekUtil.defaults(axisOpts, DEFAULTS[dim]);

                self._cartesian.addAxis(dim, axisOpts.range);

                renderable.geometry.addLine(
                    ZERO, vectors[dim], colorTool.parse(axisOpts.lineColor)
                );
            });

            // Add other box outlines
            var points = [
                [0, 1, 0], [0, 1, 1],
                [0, 1, 0], [1, 1, 0],
                [1, 1, 0], [1, 1, 1],
                [0, 1, 1], [1, 1, 1],

                [0, 0, 1], [1, 0, 1],
                [1, 0, 0], [1, 0, 1],

                [0, 1, 1], [0, 0, 1],
                [1, 1, 1], [1, 0, 1],
                [1, 1, 0], [1, 0, 0]
            ];
            for (var i = 0; i < points.length;) {
                boxRenderable.geometry.addLine(points[i++], points[i++]);
            }
        }
    };

    Cartesian3D.DEFAULTS = DEFAULTS;

    return Cartesian3D;
});