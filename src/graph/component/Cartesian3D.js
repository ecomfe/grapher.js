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
            var renderable = new Renderable({
                geometry: new LinesGeo(),
                material: this._app3d.createColorMaterial([1, 1, 1], 1, true),
                mode: Renderable.LINES,
                lineWidth: opts.lineWidth,
            });

            var lineGeo = renderable.geometry;
            var ZERO = Vector3.ZERO.clone();

            var vectors = {
                x: Vector3.POSITIVE_X.clone(),
                y: Vector3.POSITIVE_Y.clone(),
                z: Vector3.POSITIVE_Z.clone()
            };

            axes.forEach(function (dim, idx) {
                // Clone and extend default options
                var axisOpts = qtekUtil.extend({}, opts[dim]);
                qtekUtil.defaults(axisOpts, DEFAULTS[dim]);

                self._cartesian.addAxis(dim, axisOpts.range);

                lineGeo.addLine(
                    ZERO, vectors[dim], colorTool.parse(axisOpts.lineColor)
                );
            });

            // Add other box edge lines
            // lineGeo.addLine(
            //     ZERO, vectors[dim], colorTool.parse(axisOpts.lineColor)
            // );

            this.root.add(renderable);
        }
    };

    Cartesian3D.DEFAULTS = DEFAULTS;

    return Cartesian3D;
});