var fs = require('fs');
var marked = require('marked');
var watch = require('watch')

function update() {
    var indexTpl = fs.readFileSync('index.tpl', 'utf-8');
    var doc = marked(fs.readFileSync('md/doc.md', 'utf-8'));

    var html = indexTpl.replace('{{article}}', doc);

    fs.writeFileSync('../index.html', html, 'utf-8');

    console.log('Doc updated');
}
watch.createMonitor('../src', function (monitor) {
    monitor.on('changed', update);
})