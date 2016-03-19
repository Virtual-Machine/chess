'use strict';

const fs = require('fs');
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js-harmony");

UglifyJS.onerror

let chess = fs.readFileSync('./chess.html', 'utf-8');
let main = UglifyJS.minify([__dirname + "/public/js/jqlite.min.js", __dirname + "/public/js/pieces.js", __dirname + "/public/js/main.js"]);
let maincss = fs.readFileSync('./public/css/main.css', 'utf-8');

let minified = new CleanCSS().minify(maincss).styles;

chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/jqlite.min.js\"></script>", "")
chess = chess.replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"public/css/main.css\">", "<style>" + minified + "</style>")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/pieces.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/main.js\"></script>", "<script>" + main.code + "</script>")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/assert.js\"></script>", "")

fs.writeFileSync('chess-demo.html', chess);