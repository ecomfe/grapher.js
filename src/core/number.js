define(function (require) {

    'use strict';

    var number = {};
    var Sequence = require('../generator/Sequence');
    /**
     * Calculating range of data
     * @param {Array.<number>} data
     *
     * @return {Array.<number>}
     */
    number.rangeOfData = function (data) {

        var min = Infinity;
        var max = -Infinity;

        var isDataSequence = data instanceof Sequence;
        var len = isDataSequence ? data.length() : data.length;

        for (var i = 0; i < len; i++) {
            var val = isDataSequence ? data.at(i) : data[i];
            min = Math.min(val, min);
            max = Math.max(val, max);
        }

        return [min, max];
    };

    /**
     * Get array dimensions
     * @return {Array.<number>}
     */
    number.getDimensions = function (matrix) {
        var dims = [];
        var item = matrix;
        while (item instanceof Array) {
            dims.push(item.length);
            // Assume each item has the same length
            item = item[0];
        }
        return dims;
    };

    /**
     * Check if given metrics have the same dimensions
     * @return {Array.<number>}
     */
    number.sameDimensions = function (matrix) {
        var dims = number.getDimensions(matrix);
        for (var i = 1; i < arguments.length; i++) {
            var dims2 = number.getDimensions(arguments[i]);
            if (! number.arrayEqual(dims, dims2)) {
                return false;
            }
        }
        return true;
    }

    number.arrayEqual = function (arr0, arr1) {
        if (arr0.length != arr1.length) {
            return false;
        }
        for (var k = 0; k < arr0.length; k++) {
            if (arr0[k] != arr1[k]) {
                return false;
            }
        }
        return true;
    };

    return number;
});