/**
 * Sequence number generator.
 * Lazy data evaluation
 */

define(function () {

    'use strict';

    var Sequence = function (start, end, step) {
        this._start = start || 0;
        this._end = end;
        this._step = step;

        this._length = Math.floor((end - start) / step) + 1;

        this._mapFuncs = [];
        this._hasMap = false;
    };

    Sequence.prototype = {

        constructor: Sequence,

        at: function (idx) {
            if (idx >= 0 && idx < this._length) {
                var val = this._start + this._step * idx;
                return this._hasMap ? this._mapValue(val) : val;
            }
        },

        length: function () {
            return this._length;
        },

        toArray: function () {
            var arr = [];
            for (var val = this._start; val <= this._end; val += this._step) {
                arr.push(this._hasMap ? this._mapValue(val) : val);
            }
            return arr;
        },

        map: function (func) {
            var sequence = new Sequence(this._start, this._end, this._step);
            sequence._mapFuncs = this._mapFuncs.concat([func]);
            sequence._hasMap = true;
            return sequence;
        },

        _mapValue: function (val) {
            var mapNodes = this._mapFuncs;
            for (var i = 0; i < mapNodes.length; i++) {
                val = mapNodes[i](val);
            }
        }
    };

    return Sequence;
});