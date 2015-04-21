{
    baseUrl: '../src',
    // optimize: 'none',
    paths: {
        // 使用requirejs的text插件
        'text': '../build/text'
    },
    packages: [
        {
            name: 'qtek',
            location: '../../qtek/src',
            main: 'qtek.amd'
        },
        {
            name: 'grapher',
            location: '../src',
            main: 'grapher'
        }
    ],
    name: 'grapher',

    wrap: {
        'startFile' : ['wrap/start.js', 'almond.js'],
        'endFile' : 'wrap/end.js'
    },

    // http://stackoverflow.com/questions/10196977/how-can-i-prevent-the-require-js-optimizer-from-including-the-text-plugin-in-opt
    stubModules : ['text', 'less'],

    out: '../dist/grapher.js'
}