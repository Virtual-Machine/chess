'use strict';

const fs = require('fs');
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js-harmony");

UglifyJS.onerror

let chess = fs.readFileSync('./chess.html', 'utf-8');
let jsDir = __dirname + "/public/js/";
let jsFiles = [jsDir + "jqlite.min.js", jsDir + "helpers.js", jsDir + "piece.js", jsDir + "pawn.js", jsDir + "rook.js", jsDir + "knight.js", jsDir + "bishop.js", jsDir + "king.js", jsDir + "queen.js", jsDir + "square.js", jsDir + "main.js"]
let main = UglifyJS.minify(jsFiles);

let maincss = fs.readFileSync('./public/css/main.css', 'utf-8');

let minified = new CleanCSS().minify(maincss).styles;

chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/jqlite.min.js\"></script>", "")
chess = chess.replace("<link rel=\"stylesheet\" type=\"text/css\" href=\"public/css/main.css\">", "<style>" + minified + "</style>")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/helpers.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/piece.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/square.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/pawn.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/rook.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/knight.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/bishop.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/king.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/queen.js\"></script>", "")
chess = chess.replace("<script type=\"text/javascript\" src=\"public/js/main.js\"></script>", "<script>" + main.code + "</script>")
chess = chess.replace(/document\.styleSheets\[1\]/g, "document.styleSheets[0]")

fs.writeFileSync('chess-demo.html', chess);