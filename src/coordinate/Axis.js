define(function (require) {

    'use strict';

    var Axis = function (dim, dataRange, spaceRange) {

        /**
         * Axis dimension
         * @type {string|number}
         */
        this.dim = dim;

        /**
         * Axis data range
         * @type {Array.<number>}
         */
        this.dataRange = dataRange;

        /**
         * Axis range in space
         * @type {Array.<number>}
         */
        this.spaceRange = spaceRange;
    };

    Axis.prototype = {
        
        contructor: Axis,

        /**
         * Convert value to coord in 1d space
         * @param  {number} value
         * @return {number}
         */
        valueToCoord: function (value) {
            var spaceRange = this.spaceRange;
            var dataRange = this.dataRange;

            var delta = dataRange[1] - dataRange[0];
            if (delta === 0) {
                return (spaceRange[1] + spaceRange[0]) / 2;
            }

            var ratio = (spaceRange[1] - spaceRange[0]) / delta;
            return (value - dataRange[0]) * ratio + spaceRange[0];
        },

        /**
         * Convert coord in 1d space to value
         * @param  {number} coord
         * @return {number}
         */
        coordToValue: function (coord) {
            var spaceRange = this.spaceRange;
            var dataRange = this.dataRange;

            var ratio = (dataRange[1] - dataRange[0]) / (spaceRange[1] - spaceRange[0]);
            return (value - spaceRange[0]) * ratio + dataRange[0];
        }
    };

    return Axis;
});