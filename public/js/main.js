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
	constructor(){
		this.grid = {};
		this.turn = "White";
		this.waiting = "Black";
		this.blackKing = "e8";
		this.whiteKing = "e1";
		this.pause = false;
		this.check = false;
		this.lastMove = null;
		this.legalMoves = {}
		this.legalMoves["White"] = [];
		this.legalMoves["Black"] = [];
	}

	initializeGrid(){
		for(var b = 1; b < 9; b++){
			for(var a = 1; a < 9; a++){
				this.grid[mapToLetter(a) + b] = new Square(idToPiece(positions[mapToLetter(a) + b]));
			}
		}
		this.updatePoints();
		this.calculateLegalMoves(this.turn, true);
	}

	showGrid(){
		var counter = 0;
		var counter2 = 0;
		var string = "";
		var line = "";
		for(var i in this.grid){
			line += "|"
			if(this.grid[i].content){
				if(this.grid[i].content.symbol){
					line += this.grid[i].content.color[0] + this.grid[i].content.symbol;
				} else {
					line += "  ";
				}
			} else {
				line += "  ";
			}
			counter++;
			if (counter == 8){
				counter = 0;
				line += "|\n"
				string =  ++counter2 + " " + line + "---------------------------\n" + string
				line = "";
			}
		}
		string += "----A--B--C--D--E--F--G--H-"
		console.log(string);
	}


	requestMove(origin, destination){
		if(this.pause){
			return false;
		}
		if(this.grid[origin]){
			if(this.grid[origin].hasOpponent(this.turn)){
				return false;
			}
		}
		if(this.legalMoves[this.turn].indexOf(origin + "," + destination) >=0){
			return true;
		} else {
			return false;
		}
	}

	removePassants(color){
		for(var i in this.grid){
			if (this.grid[i].hasFlag(color)){
				this.grid[i].removeFlag();
			}
		}
	}

	changeHighlighting(origin, destination){
		if(this.lastMove){
			var lastOrigin = this.lastMove[0];
			var lastDestination = this.lastMove[1];
			$("#" + lastOrigin).removeClass('glow');
			$("#" + lastDestination).removeClass('glow');
		}
		this.lastMove = [origin, destination];
		$("#" + origin).addClass('glow');
		$("#" + destination).addClass('glow');
	}

	upgradePawnCheck(){
		this.pause = true;
		var upgradeSquares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
		"a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];
		for(var i in upgradeSquares){
			var check = this.grid[upgradeSquares[i]].content;
			if(check instanceof Pawn){
				$('#wYourTurn').css("visibility", "hidden");
				$('#bYourTurn').css("visibility", "hidden");
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
			if(this.grid[i].content){
				if(this.grid[i].content.color === "Black"){
					blackPoints += this.grid[i].content.value;
				}
				if(this.grid[i].content.color === "White"){
					whitePoints += this.grid[i].content.value;
				}
			}
		}
		$('#bPieceValue')[0].innerHTML = blackPoints;
		$('#wPieceValue')[0].innerHTML = whitePoints;
	}

	calculateLegalMoves(color){
		this.legalMoves[color] = [];
		for(var i in this.grid){
			if(this.grid[i].content){
				var piece = this.grid[i].content;
				if(piece.color === color){
					piece.calculateLegalMoves(i);
					for(var k in piece.legalMoves){
						if(this.analyzeMoveForLegality(piece.legalMoves[k])){
							this.legalMoves[color].push(piece.legalMoves[k]);
						}
					}
				}
			}
		}
		
		if(this.legalMoves[color].length === 0){
			this.searchForCheck()
			if(this.check === color){
				checkmate(color);
			} else {
				stalemate();
			}
		}
		console.log(this.turn.toUpperCase() + "'s turn, legal moves: ", this.legalMoves[color])
	}

	searchForCheck(){
		var checkFound = false;
		var kingCoords;
		if(this.turn === "Black"){
			kingCoords = this.blackKing;
		} else {
			kingCoords = this.whiteKing;
		}
		
		for(var i in this.grid){
			if(this.grid[i].content){
				if(this.grid[i].content.color === this.waiting){
					if(this.grid[i].content.canSeeKing(i, kingCoords)){
						checkFound = true;
					}
				}
			}
		}
		if(this.turn === "Black" && checkFound){
			$('#' + this.blackKing).addClass("check");
			$('#' + this.whiteKing).removeClass("check");
			this.check = "Black";
			return;
		}
		if(this.turn === "White" && checkFound){
			$('#' + this.whiteKing).addClass("check");
			$('#' + this.blackKing).removeClass("check");
			this.check = "White";
			return;
		}
		$('#' + this.whiteKing).removeClass("check");
		$('#' + this.blackKing).removeClass("check");
		this.check = false;
	}

	analyzeMoveForLegality(move){
		var ok = true;
		var origin = move.split(',')[0];
		var destination = move.split(',')[1];
		var holdOrigin = this.grid[origin].content;
		var holdDestination = this.grid[destination].content;
		if(holdOrigin instanceof King && holdOrigin.color === this.turn){
			if(this.turn === 'White'){
				this.whiteKing = destination;
			} else {
				this.blackKing = destination;
			}
		}
		this.grid[origin].content = null;
		this.grid[destination].content = holdOrigin;

		if(this.turn === 'White'){
			ok = !this.isKingInSight(this.grid, this.whiteKing)
		} else {
			ok = !this.isKingInSight(this.grid, this.blackKing)
		}
		if(holdOrigin instanceof King && holdOrigin.color === this.turn){
			if(this.turn === 'White'){
				this.whiteKing = origin;
			} else {
				this.blackKing = origin;
			}
		}
		this.grid[origin].content = holdOrigin;
		this.grid[destination].content = holdDestination;
		return ok;
	}

	isKingInSight(grid, coord){
		var seen = false;
		for(var i in grid){
			if(grid[i].content){
				if(grid[i].content.color === this.waiting){
					if(grid[i].content.canSeeKing(i, coord)){
						seen = true;
					}
				}
			}
		}
		return seen;
	}

	turnOver(origin, destination){
		if(this.grid[origin].content instanceof King){
			if(this.turn === "White"){
				this.whiteKing = destination;
			} else {
				this.blackKing = destination;
			}
		}
		this.grid[origin].content.makeMove(origin, destination);
		this.upgradePawnCheck();
		this.updatePoints();
		this.grid[destination].content.moved = true;
		this.changeHighlighting(origin, destination);
		if(this.turn === 'White'){
			this.turn = 'Black';
			this.waiting = 'White';
			$('#wYourTurn').css("visibility", "hidden");
			$('#bYourTurn').css("visibility", "visible");
		} else {
			this.turn = 'White';
			this.waiting = 'Black';
			$('#wYourTurn').css("visibility", "visible");
			$('#bYourTurn').css("visibility", "hidden");
		}
		this.removePassants(this.turn);
		this.searchForCheck();
		this.calculateLegalMoves(this.turn)
	}
}

var chessEngine = new ChessEngine();
chessEngine.initializeGrid();

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
    	chessEngine.turnOver(origin, destination);
    }
}

