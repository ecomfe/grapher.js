<!DOCTYPE html>
<html>
<head>
    <title>Grapher.js</title>
    <link rel="stylesheet" href="css/index.css">
</head>
<body>

    <main>
        <header>
            <img id="logo" src="img/logo.png" alt="">
            <h1>Grapher.js</h1>
        </header>
        <article>
            {{article}}
        </article>
    </main>

    <footer>
        Maintained by <a href="http://echarts.baidu.com">ECharts</a> team
    </footer>

    <a href="https://github.com/ecomfe/grapher.js"><img style="z-index: 100; position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>

    <script src="lib/jquery.min.js"></script>
    <script src="lib/prettify/prettify.js"></script>
    <script src="../dist/grapher.js"></script>
    <link rel="stylesheet" href="lib/prettify/tomorrow-night.css">
    <script>
        var codes = {};
        // Save codes
        $('pre,.code').each(function (idx, el) {
            if (el.id) {
                codes[el.id] = el.innerHTML;
            }
        });
        $('pre').addClass('prettyprint');
        prettyPrint();

        $('.preview').each(function (idx, el) {
            var codeId = $(el).data('code');
            if (codes[codeId]) {
                var func = new Function('canvas', codes[codeId]);

                var canvas = document.createElement('canvas');
                el.appendChild(canvas);

                func(canvas);
            }
        });
    </script>
</body>
</html>