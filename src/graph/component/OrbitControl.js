/**
 * Provide orbit control for 3D objects
 * 
 * @module echarts-x/util/OrbitControl
 * @author Yi Shen(http://github.com/pissang)
 */

define(function (require) {

    'use strict';

    var Vector2 = require('qtek/math/Vector2');
    var Vector3 = require('qtek/math/Vector3');
    var Quaternion = require('qtek/math/Quaternion');


    function addEvent(dom, eveType, handler) {
        dom.addEventListener(eveType, handler);
    }
    function removeEvent(dom, eveType, handler) {
        dom.removeEventListener(eveType, handler);
    }
    /**
     * @alias module:grapher/util/OrbitControl
     */
    var OrbitControl = function (app3d, opts) {
        opts = opts || {};

        this._app3d = app3d;

        /**
         * @type {qtek.Node}
         */
        this.target = opts.target;

        this.autoRotate = opts.autoRotate || false;

        this._rotateY = 0;
        this._rotateX = 0;

        this._mouseX = 0;
        this._mouseY = 0;

        this._rotateVelocity = new Vector2();

        this._panVelocity = new Vector2();

        this._cameraStartPos = new Vector3();

        this.init();
    };

    OrbitControl.prototype = {
        
        constructor: OrbitControl,

        /**
         * Initialize.
         * Mouse event binding
         */
        init: function () {
            var canvas = this._app3d.getCanvas();
            this._mouseDownHandler = this._mouseDownHandler.bind(this);
            this._mouseUpHandler = this._mouseUpHandler.bind(this);
            this._mouseMoveHandler = this._mouseMoveHandler.bind(this);

            addEvent(canvas, 'mousedown', this._mouseDownHandler);
            addEvent(canvas, 'touchstart', this._mouseDownHandler);

            this._decomposeRotation();
        },

        /**
         * Dispose.
         * Mouse event unbinding
         */
        dispose: function () {
            var canvas = this._app3d.getCanvas();
            removeEvent(canvas, 'mousedown', this._mouseDownHandler);
            removeEvent(document.body, 'mousemove', this._mouseMoveHandler);
            removeEvent(document.body, 'mouseup', this._mouseUpHandler);

            removeEvent(canvas, 'touchstart', this._mouseDownHandler);
            removeEvent(document.body, 'touchmove', this._mouseMoveHandler);
            removeEvent(document.body, 'touchend', this._mouseUpHandler);
        },

        /**
         * Call update each frame
         * @param  {number} deltaTime Frame time
         */
        update: function (deltaTime) {
            if (this._animating) {
                return;
            }

            this._updateRotate(deltaTime);
        },

        _updateRotate: function (deltaTime) {

            var app3d = this._app3d;
            var velocity = this._rotateVelocity;
            this._rotateY = (velocity.y + this._rotateY) % (Math.PI * 2);
            this._rotateX = (velocity.x + this._rotateX) % (Math.PI * 2);

            this._rotateX = Math.max(Math.min(this._rotateX, Math.PI / 2), -Math.PI / 2);

            this.target.rotation
                .identity()
                .rotateX(this._rotateX)
                .rotateY(this._rotateY);

            // Rotate speed damping
            this._vectorDamping(velocity, 0.8);

            if (this.autoRotate) {
                this._rotateY += deltaTime * 3e-4;
                app3d.renderNextFrame();
            }
            else if (velocity.len() > 0) {
                app3d.renderNextFrame();
            }
        },

        _vectorDamping: function (v, damping) {
            var speed = v.len();
            speed = speed * damping;
            if (speed < 1e-4) {
                speed = 0;
            }
            v.normalize().scale(speed);
        },

        _mouseDownHandler: function (e) {
            var canvas = this._app3d.getCanvas();
            addEvent(document.body, 'mousemove', this._mouseMoveHandler);
            addEvent(document.body, 'mouseup', this._mouseUpHandler);

            addEvent(document.body, 'touchmove', this._mouseMoveHandler);
            addEvent(document.body, 'touchend', this._mouseUpHandler);

            // Reset rotate velocity
            this._rotateVelocity.set(0, 0);

            var x = e.pageX;
            var y = e.pageY;
            // Touch
            if (e.targetTouches) {
                var touch = e.targetTouches[0];
                x = touch.clientX;
                y = touch.clientY;
            }
            this._mouseX = x;
            this._mouseY = y;

            this.autoRotate = false;
        },

        _mouseMoveHandler: function (e) {

            var x = e.pageX;
            var y = e.pageY;
            // Touch
            if (e.targetTouches) {
                var touch = e.targetTouches[0];
                x = touch.clientX;
                y = touch.clientY;

                // PENDING
                e.preventDefault();
            }

            var rotateVelocity = this._rotateVelocity;
            rotateVelocity.y = (x - this._mouseX) / 500;
            rotateVelocity.x = (y - this._mouseY) / 500;

            this._mouseX = x;
            this._mouseY = y;
        },

        _mouseUpHandler: function () {
            var canvas = this._app3d.getCanvas();
            removeEvent(document.body, 'mousemove', this._mouseMoveHandler);
            removeEvent(document.body, 'mouseup', this._mouseUpHandler);

            removeEvent(document.body, 'touchmove', this._mouseMoveHandler);
            removeEvent(document.body, 'touchend', this._mouseUpHandler);
        },

        _decomposeRotation: function () {
            var euler = new Vector3();
            // Z Rotate at last so it can be zero
            euler.eulerFromQuaternion(
                this.target.rotation.normalize(), 'ZXY'
            );

            this._rotateX = euler.x;
            this._rotateY = euler.y;
        }
    };

    return OrbitControl;
});