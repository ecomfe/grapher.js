define(function (require) {

    'use strict';

    var Axis = require('./Axis');

    var Cartesian = function (size) {
        this._size = size;

        this._axis = {};

        this._dimList = [];
    };

    Cartesian.prototype = {
        
        constructor: Cartesian,

        /**
         * Get axis by dim
         * @param  {number|string} dim
         * @return {module:grapher/coordinate/Axis}
         */
        getAxis: function (dim) {
            return this._axis[dim];
        },

        /**
         * Add an axis
         * @param {number|string} dim
         * @param {data range} range
         */
        addAxis: function (dim, range) {
            var axis = new Axis(dim, range, [0, this._size]);
            this._axis[dim] = axis;

            this._dimList.push(dim);

            return axis;
        },

        /**
         * Convert value to coord in nd space
         * @param  {Array.<number>|Object.<string, number>} val
         * @return {Array.<number>|Object.<string, number>}
         */
        valueToCoord: function (val) {
            return this._valueCoordConvert(val, 'valueToCoord');
        },

        /**
         * Convert coord in nd space to value
         * @param  {Array.<number>|Object.<string, number>} val
         * @return {Array.<number>|Object.<string, number>}
         */
        coordToValue: function () {
            return this._valueCoordConversion(val, 'coordToValue');
        },
        
        _valueCoordConvert: function (input, method) {
            var dimList = this._dimList;

            var output = input instanceof Array ? [] : {};

            for (var i = 0; i < dimList.length; i++) {
                var dim = dimList[i];
                var axis = this._axis[dim];

                output[dim] = axis[method](input[dim]);
            }

            return output;
        }
    };

    return Cartesian;
});