define(function (require) {

    'use strict';

    var supportWebGL = true;
    try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error();
        }
    } catch (e) {
        supportWebGL = false;
    }

    var vendor = {};

    /**
     * If support WebGL
     * @return {boolean}
     */
    vendor.supportWebGL = function () {
        return supportWebGL;
    };

    vendor.Uint16Array = typeof Uint16Array == 'undefined' ? Array : Uint16Array;

    vendor.Uint32Array = typeof Uint32Array == 'undefined' ? Array : Uint32Array;

    vendor.Float32Array = typeof Float32Array == 'undefined' ? Array : Float32Array;

    return vendor;
});