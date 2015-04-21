/**
 * @module grapher/core/App3D
 */

define(function (require) {

    var vendor = require('qtek/core/vendor');

    var supportWebGL = vendor.supportWebGL();

    // Canvas Pipeline
    var CanvasRenderer = require('qtek/canvas/Renderer');
    var CanvasMaterial = require('qtek/canvas/Material');

    // WebGL Pipeline
    var WebGLRenderer = supportWebGL && require('qtek/Renderer');
    var Material = supportWebGL && require('qtek/Material');
    var Shader = supportWebGL && require('qtek/Shader');

    var qtekUtil = require('qtek/core/util');
    var notifier = require('qtek/core/mixin/notifier');

    var CANVAS = 'canvas';
    var WEBGL = 'webgl';

    var requestAnimationFrame = window.requestAnimationFrame
                                || window.msRequestAnimationFrame
                                || window.mozRequestAnimationFrame
                                || window.webkitRequestAnimationFrame
                                || function(func){setTimeout(func, 16);};

    // Import shaders
    if (supportWebGL) {
        Shader['import'](require('text!../shader/color.essl'));
    }

    /**
     * @alias module:grapher/core/App3D
     * @param {HTMLCanvasElement} canvas
     * @param {Object} opts
     */
    var App3D = function (canvas, opts) {

        var self = this;
        opts = opts || {};

        var isCanvas = ! supportWebGL || opts.renderer === CANVAS;
        this._isCanvas = isCanvas;

        this._canvas = canvas;
        this._renderer = new (isCanvas ? CanvasRenderer : WebGLRenderer)({
            canvas: canvas
        });

        this._needsUpdate = false;

        this._time = new Date().getTime();

        function step() {

            requestAnimationFrame(step);

            var time = new Date().getTime();
            var dTime = time - self._time;
            self._time = time;
            self._frame(dTime);
        }

        requestAnimationFrame(step);
    };

    App3D.prototype = {
        
        constructor: App3D,

        /**
         * Get renderer
         * @return {qtek.Renderer}
         */
        getRenderer: function () {
            return this._renderer;
        },

        /**
         * Get canvas
         * @return {HTMLCanvasElement}
         */
        getCanvas: function () {
            return this._canvas;
        },

        /**
         * Resize renderer
         * @param {number} [width]
         * @param {number} [height]
         */
        resize: function (width, height) {
            if (width == null) {
                var canvas = this._canvas;
                width = canvas.clientWidth;
                height = canvas.clientHeight;
            }
            this._renderer.resize(width, height);

            this._needsUpdate = true;
        },

        getWidth: function () {
            return this._renderer.getWidth();
        },

        getHeight: function () {
            return this._renderer.getHeight();
        },

        /**
         * If use canvas renderer
         * @return boolean
         */
        isCanvasRenderer: function () {
            return this._isCanvas;
        },

        /**
         * Mark and render in next frame
         */
        renderNextFrame: function () {
            this._needsUpdate = true;
        },

        createColorMaterial: function (color, opacity, vertexColor) {
            if (this._isCanvas) {
                return new CanvasMaterial({
                    color: color,
                    opacity: opacity
                });
            }
            else {
                var mat = new Material({
                    shader: new Shader({
                        vertex: Shader.source('grapher.color.vertex'),
                        fragment: Shader.source('grapher.color.fragment')
                    })
                });
                if (vertexColor) {
                    mat.shader.define('both', 'VERTEX_COLOR');
                }
                mat.set('color', color.slice(0, 3));
                mat.set('alpha', (opacity == null ? 1 : opacity) * (color[3] == null) ? 1 : color[3]);
                return mat;
            }
        },

        _frame: function (deltaTime) {

            this.trigger('frame', deltaTime);

            if (this._needsUpdate) {
                this.trigger('render', this._renderer);

                this._needsUpdate = false;
            }
        }
    };

    qtekUtil.extend(App3D.prototype, notifier);

    return App3D;
});