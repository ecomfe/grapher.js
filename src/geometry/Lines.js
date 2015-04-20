/**
 * Geometry collecting straight line, cubic curve data
 * @module grapher/geometry/Lines
 * @author Yi Shen(http://github.com/pissang)
 */

define(function (require) {
    
    var DynamicGeometry = require('qtek/DynamicGeometry');
    var Attribute = require('qtek/Geometry').Attribute;

    // var CURVE_RECURSION_LIMIT = 8;
    // var CURVE_COLLINEAR_EPSILON = 40;

    /**
     * @constructor
     * @alias module:grapher/geometry/Lines
     * @extends qtek.DynamicGeometry
     */
    var LinesGeometry = DynamicGeometry.derive(function () {
        return {
            attributes: {
                position: new Attribute('position', 'float', 3, 'POSITION', true),
                color: new Attribute('color', 'float', 4, 'COLOR', true)
            }
        };
    },
    /** @lends module: grapher/geometry/Lines.prototype */
    {
        /**
         * Add a straight line
         * @param {qtek.math.Vector3} p0
         * @param {qtek.math.Vector3} p1
         * @param {Array.<number>} color
         */
        addLine: function (p0, p1, color) {
            var attributes = this.attributes;
            attributes.position.value.push(p0._array, p1._array);
            attributes.color.value.push(color, color);
        }
    });

    return LinesGeometry;
});