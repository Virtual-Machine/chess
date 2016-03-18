'use strict'

// variables
var coordMap = [];
var letters = ['', "a", "b", "c", "d", "e", "f", "g", "h"];
var positions = {
	a2: 'w♟1',	b2: 'w♟2', c2: 'w♟3', d2: 'w♟4',
	e2: 'w♟5', 	f2: 'w♟6', g2: 'w♟7', h2: 'w♟8',
	a1: 'w♜1',  b1: 'w♞1', c1: 'w♝1', d1: 'w♛',
	e1: 'w♚', 	f1: 'w♝2', 	g1: 'w♞2',	h1: 'w♜2',
	a7: 'b♟1', 	b7: 'b♟2', 	c7: 'b♟3',	d7: 'b♟4',
	e7: 'b♟5', 	f7: 'b♟6', 	g7: 'b♟7',	h7: 'b♟8',
	a8: 'b♜1',	b8: 'b♞1',	c8: 'b♝1',	d8: 'b♛',
	e8: 'b♚',	f8: 'b♝2',	g8: 'b♞2',	h8: 'b♜2'
}

class ChessEngine {
	constructor(production){
		this.grid = {};
		this.whiteTurn = true;
		this.production = production
		this.pause = false;
	}

	initializeGrid(){
		for(var a = 1; a < 9; a++){
			for(var b = 1; b < 9; b++){
				this.grid[mapToLetter(a) + b] = idToPiece(positions[mapToLetter(a) + b]);
			}
		}
		this.updatePoints();
	}

	showGrid(){
		console.log(this.grid)
	}

	requestMove(origin, destination){
		if(this.grid[origin] && !this.pause){ //Something located
			if(this.grid[origin].requestMove){//Has ability to move
				if((this.grid[origin].color === 'Black' && !this.whiteTurn) || (this.grid[origin].color === 'White' && this.whiteTurn)){
					var response = this.grid[origin].requestMove(this.grid, origin, destination);
					if (response){
						if(this.production){
							if (this.whiteTurn){
								this.removePassants("Black");
							} else {
								this.removePassants("White");
							}
							this.whiteTurn = !this.whiteTurn;	
						}
						return true;
					} else {
						return false;
					}
				}
				
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	removePassants(color){
		for(var i in this.grid){
			if (this.grid[i] === "EnPassant" + color){
				this.grid[i] = null;
			}
		}
	}

	upgradePawnCheck(){
		this.pause = true;
		var upgradeSquares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
		"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];
		for(var i in upgradeSquares){
			var check = this.grid[upgradeSquares[i]]
			if(check instanceof Pawn){
				$('#pieceWindow').css('visibility', 'visible');
				$('#pieceWindow').data('coords', upgradeSquares[i])
				$('#pieceWindow').data('color', check.color)
				return;
			}
		}
		this.pause = false;
	}

	updatePoints(){
		var blackPoints = 0;
		var whitePoints = 0;
		for(var i in this.grid){
			if(this.grid[i]){
				if(this.grid[i].color){
					if(this.grid[i].color == "Black"){
						blackPoints += this.grid[i].value;
					}
					if(this.grid[i].color == "White"){
						whitePoints += this.grid[i].value;
					}
				}
			}
		}
		$('#bPieceValue')[0].innerHTML = blackPoints;
		$('#wPieceValue')[0].innerHTML = whitePoints;
	}

	// test helpers

	flagCell(cell, color){
		this.grid[cell] = "EnPassant" + color;
	}

	unflagCell(cell){
		this.grid[cell] = null;
	}

	movePiece(origin, destination){
		var tmp = this.grid[origin];
		this.grid[destination] = tmp;
		this.grid[origin] = null;
	}
}

var chessEngine = new ChessEngine(true);
chessEngine.initializeGrid();

function idToPiece(id){
	if(id == null){
		return;
	}
	var color = id[0];
	if (color === 'w'){
		color = 'White'
	} else {
		color = 'Black'
	}
	id = id[1];
	switch(id){
		case '♟':
			return new Pawn(color);   
		case '♜':
			return new Rook(color);
		case '♞':
			return new Knight(color);
		case '♝':
			return new Bishop(color);
		case '♛':
			return new Queen(color);
		case '♚':
			return new King(color);
	}
}

function mapToLetter(val){
	return letters[val];
}

function mapToValue(letter){
	return letters.indexOf(letter);
}



function getPieceAtCoords(coords){
	if (positions[coords]){
		var piece = positions[coords][1];
		if(positions[coords][0] == "w"){
			return "<div id='" + coords + "' class='holder white'>" + piece + "</div>"
		} else {
			return "<div id='" + coords + "' class='holder black'>" + piece + "</div>"
		}
	} else {
		return "<div id='" + coords + "' class='holder'></div>";
	}
}

function initializeMapping(){
	var counter = 0;
	for(var a = 8; a > 0; a--){
		for(var b = 1; b < 9; b++){
			coordMap[counter++] = mapToLetter(b) + '' + a;
		}
	}
}


function initializeBoard(){
	var counter = 0;
	var boolSwitch = false;
	for(var i = 0; i < 64; i++){
		if (++counter > 8){
			counter = 1;
			boolSwitch = !boolSwitch;
		}
		boolSwitch = !boolSwitch;
		if (boolSwitch){
			$('#board').append("<div class='cell light'>" + getPieceAtCoords(coordMap[i]) + "</div>");	
		} else {
			$('#board').append("<div class='cell'>" + getPieceAtCoords(coordMap[i]) + "</div>");
		}
	}
}

// Setup chess board

initializeMapping();
initializeBoard();

// Setup drag and drop events

var cellholders = $('.holder');

for(var i in cellholders){
	if (i < 64){
		cellholders[i].draggable = true;
		cellholders[i].ondrop = drop;
		cellholders[i].ondragover = allowDrop;
		cellholders[i].ondragstart = drag
	}	
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("piece", ev.target.innerHTML);
	ev.dataTransfer.setData("id", ev.target.id);
	ev.dataTransfer.setData("className", ev.target.className);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("piece");
    var className = ev.dataTransfer.getData("className");
    var origin = ev.dataTransfer.getData("id");
    var destination = ev.target.id;
    var response = chessEngine.requestMove(origin, destination);
    if (response){
    	ev.target.className = className;
    	$('#' + origin)[0].className = 'holder';
    	$('#' + origin)[0].innerHTML = '';
    	ev.target.innerHTML = data;
    	chessEngine.grid[destination] = chessEngine.grid[origin];
    	chessEngine.grid[origin] = null;
    	chessEngine.grid[destination].moved = true;
    	chessEngine.upgradePawnCheck();
    	chessEngine.updatePoints();
    }
}

function submitValue(){
	$('#pieceWindow').css('visibility', 'hidden');
	var selection = $('#pieceSelect').val();
	var coords = $('#pieceWindow').data('coords');
	var color = $('#pieceWindow').data('color');
	switch(selection){
		case 'Knight':
			$('#' + coords)[0].innerHTML = "♞"
			chessEngine.grid[coords] = new Knight(color);
			break;
		case 'Bishop':
			$('#' + coords)[0].innerHTML = "♝"
			chessEngine.grid[coords] = new Bishop(color);
			break;
		case 'Rook':
			$('#' + coords)[0].innerHTML = "♜"
			chessEngine.grid[coords] = new Rook(color);
			break;
		case 'Queen':
			$('#' + coords)[0].innerHTML = "♛"
			chessEngine.grid[coords] = new Queen(color);
			break;
	}
	chessEngine.pause = false;
}