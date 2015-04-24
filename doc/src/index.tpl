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

            <a href=""></a>
        </header>
        <article>
            {{article}}
        </article>
    </main>

    <footer>
        Maintained by <a href="http://echarts.baidu.com">ECharts</a> team
    </footer>

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