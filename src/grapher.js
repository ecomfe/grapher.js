define(function (require) {

    'use strict';

    var grapher = {
        version: '0.1'
    };

    grapher.Surface = require('./graph/Surface');

    grapher.generator = {
        Sequence: require('./generator/Sequence')
    };

    return grapher;
});