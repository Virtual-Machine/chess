'use strict'

function explain(text){
	console.log("Rejected: " + text);
}

function cellContents(grid, coord){
	if(grid[coord]){
		if(grid[coord].requestMove){
			return grid[coord].color;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

function processEnPassant(grid, destination){
	var legalEnPassantSquares = ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
	"a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"]
	var index = legalEnPassantSquares.indexOf(destination);
	if(index >= 0 && index < 8){
		destination = destination[0] + 4;
		grid[destination] = null;
		$('#' + destination)[0].className = 'holder';
		$('#' + destination)[0].innerHTML = '';
	} else if(index >= 8 && index < 16){
		destination = destination[0] + 5;
		grid[destination] = null;
		$('#' + destination)[0].className = 'holder';
		$('#' + destination)[0].innerHTML = '';
	}
}

function cellsBetween(grid, origin, destination){
	var cells = [];
	var letters = ['', "a", "b", "c", "d", "e", "f", "g", "h", ''];
	var movement = getMovementShape(origin, destination);
	var originX = letters.indexOf(origin[0]);
	var originY = parseInt(origin[1]);
	var x = movement[0];
	var y = movement[1];
	if( x > 1 || x < -1 || y > 1 || y < -1){ //Moving more than one cell, possible interference
		// horizontal
		if (y === 0){
			if (x > 0){ //East
				for(x; x > 1; x--){
					cells.push(letters[++originX] + originY);
				}
			} else { //West
				for(x; x < -1; x++){
					cells.push(letters[--originX] + originY);
				}
			}
		}
		// vertical
		if (x === 0){
			if (y > 0){ //North
				for(y; y > 1; y--){
					cells.push(letters[originX] + (++originY));
				}
			} else { //South
				for(y; y < -1; y++){
					cells.push(letters[originX] + (--originY));
				}
			}
		}
		// diagonal
		if (Math.abs(x) === Math.abs(y)){
			if(x > 0 && y > 0){ //NE
				for(x; x > 1; x--){
					cells.push(letters[++originX] + (++originY));
				}
			}
			if(x < 0 && y > 0){ //NW
				for(y; y > 1; y--){
					cells.push(letters[--originX] + (++originY));
				}
			}
			if(x < 0 && y < 0){ //SW
				for(x; x < -1; x++){
					cells.push(letters[--originX] + (--originY));
				}
			}
			if(x > 0 && y < 0){ //SE
				for(x; x > 1; x--){
					cells.push(letters[++originX] + (--originY));
				}
			}
		}
		return cells;
	} else {
		return false;
	}
}

function objectInCells(grid, cells){
	for(var i in cells){
		if(grid[cells[i]]){
			if(grid[cells[i]].requestMove){
				return true;
			}
		}
	}
	return false;
}

function getMovementShape(origin, destination){
	var letters = ['', "a", "b", "c", "d", "e", "f", "g", "h", ''];
	var x = origin[0];
	var y = parseInt(origin[1]);
	var a = destination[0];
	var b = parseInt(destination[1]);
	var horizontalDiff = letters.indexOf(a) - letters.indexOf(x);
	var verticalDiff = b - y;
	return [horizontalDiff, verticalDiff];
}

function getCellInDirection(coord, direction){
	var letters = ['', "a", "b", "c", "d", "e", "f", "g", "h", ''];
	var x = coord[0];
	var y = parseInt(coord[1]);
	if(direction === 'N'){
		y += 1;
	}
	if(direction === 'S'){
		y -= 1;
	}
	if(direction === 'W'){
		var val = letters.indexOf(x);
		val -= 1;
		x = letters[val];
	}
	if(direction === 'E'){
		var val = letters.indexOf(x);
		val += 1;
		x = letters[val];
	}
	if(direction === 'NE'){
		var val = letters.indexOf(x);
		val += 1;
		x = letters[val];
		y += 1;
	}
	if(direction === 'SE'){
		var val = letters.indexOf(x);
		val += 1;
		x = letters[val];
		y -= 1;
	}
	if(direction === 'NW'){
		var val = letters.indexOf(x);
		val -= 1;
		x = letters[val];
		y += 1;
	}
	if(direction === 'SW'){
		var val = letters.indexOf(x);
		val -= 1;
		x = letters[val];
		y -= 1;
	}
	if( x === '' || y < 1 || y > 8){
		return "Out Of Bounds"
	} else {
		return x + "" + y;
	}

}

class Piece {
	constructor(color){
		this.color = color
		this.moved = false;
	}
	requestMove(grid, origin, destination){
		if(grid[destination]){//If there is something at destination.
			if (grid[destination].requestMove){ //If it is a piece
				if (grid[destination].color == this.color){ //If it is a teammate
					explain("Trying to land on teammate")
					return false;
				}
			}	
		}
		return true;
	}
}

class Pawn extends Piece {
	constructor(color){
		super(color);
		if (color == 'White'){
			this.possibleMoves = ["0,1","0,2","-1,1","1,1"]
		} else {
			this.possibleMoves = ["0,-1","0,-2","-1,-1","1,-1"]
		}
		this.possibleDestinations;
		this.value = 1;
		this.symbol = 'P';
	}

	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		var enemyInCell = false;
		var flagInCell = false;
		if(grid[destination]){
			if(grid[destination].requestMove && grid[destination].color !== this.color ){
				enemyInCell = true;
			}
			if (this.color === "Black"){
				if(grid[destination] === "EnPassantWhite"){
					flagInCell = true;
				}
			}
			if (this.color === "White"){
				if(grid[destination] === "EnPassantBlack"){
					flagInCell = true;
				}
			}
		}
		
		var movement = getMovementShape(origin, destination);
		var index = this.possibleMoves.indexOf(movement.toString());
		if (index < 0){
			explain("Invalid movement pattern for pawn")
			return false;
		}
		if (index === 0){
			if(enemyInCell){
				explain("Pawns cannot capture directly forward")
				return false;
			} else {
				return true;
			}
		}
		if (index === 2 || index === 3){
			if(enemyInCell){

				return true;
			} else if (flagInCell) {
				processEnPassant(grid, destination);
				return true;
			} else {
				explain("Pawns only move diagonally when capturing")
				return false;
			}
		}
		if(index === 1){
			if (this.moved){
				explain("Pawns can only move 2 squares forward as thier first move")
				return false;
			}
			if (enemyInCell){
				explain("Pawns cannot capture directly forward")
				return false;
			}
			var cells = cellsBetween(grid, origin, destination);
			if (cells){
				if (objectInCells(grid, cells)){
					explain("Pawns cannot jump over pieces")
					return false;
				} else {
					grid[cells[0]] = "EnPassant" + this.color;
					return true;
				}
			}
		}
	}

	buildMoveList(grid, origin){
		var list = [];
		var cell;
		if(this.color === "White"){
			cell = getCellInDirection(origin, "NW");
			if(cell !== "Out Of Bounds") {
				list.push(cell);
			}
			cell = getCellInDirection(origin, "NE");
			if(cell !== "Out Of Bounds") {
				list.push(cell);
			}
		} else {
			cell = getCellInDirection(origin, "SW");
			if(cell !== "Out Of Bounds") {
				list.push(cell);
			}
			cell = getCellInDirection(origin, "SE");
			if(cell !== "Out Of Bounds") {
				list.push(cell);
			}
		}
		this.possibleDestinations = list;
	}
}

class Rook extends Piece {
	constructor(color){
		super(color);
		this.value = 5;
		this.possibleDestinations = [];
		this.symbol = 'R';
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
			explain("Invalid movement pattern for rook")
			return false;
		}
	}

	buildMoveList(grid, origin){
		var list = [];
		var cur;
		var prev = origin;
		var direction = ["N", "E", "S", "W"];
		for(var a = 0; a < 4; a++){
			prev = origin;
			for(var i = 1; i < 8 ; i++){
				cur = getCellInDirection(prev, direction[a]);
				if (cur === "Out Of Bounds"){
					prev = origin;
					break;
				}
				var content = cellContents(grid, cur);
				if(content){
					if (content === this.color){
						prev = origin;
						break;
					} else {
						list.push(cur);
						prev = origin;
						break;
					}
				} else {
					list.push(cur);
					prev = cur;
				}
			}
		}
		this.possibleDestinations = list;
	}
}

class Knight extends Piece {
	constructor(color){
		super(color);
		this.possibleMoves = ["2,1", "1,2", "2,-1", "-1,2", "-2,1", "1,-2", "-2,-1", "-1,-2"];
		this.possibleDestinations;
		this.value = 3;
		this.symbol = 'N';
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		var movement = getMovementShape(origin, destination);
		var index = this.possibleMoves.indexOf(movement.toString());
		if(index >= 0 && index < 8){
			return true;
		} else {
			explain("Invalid movement pattern for knight")
			return false;
		}
	}
	buildMoveList(grid, origin){
		var letters = ['', "a", "b", "c", "d", "e", "f", "g", "h", ''];
		var list = [];
		var originx = letters.indexOf(origin[0]); 
		var originy = parseInt(origin[1]);
		for(var i in this.possibleMoves){
			var deltax = parseInt(this.possibleMoves[i].split(',')[0]);
			var deltay = parseInt(this.possibleMoves[i].split(',')[1]);
			var newx = originx + deltax;
			var newy = originy + deltay;
			if (newx < 1 || newx > 8 || newy < 1 || newy > 8){

			} else {
				list.push(letters[newx] + newy)
			}
		}
		this.possibleDestinations = list;
	}
}

class Bishop extends Piece {
	constructor(color){
		super(color);
		this.value = 3;
		this.possibleDestinations = [];
		this.symbol = 'B';
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
			explain("Invalid movement pattern for bishop")
			return false;
		}
	}

	buildMoveList(grid, origin){
		var list = [];
		var cur;
		var prev = origin;
		var direction = ["NW", "NE", "SE", "SW"];
		for(var a = 0; a < 4; a++){
			prev = origin;
			for(var i = 1; i < 8 ; i++){
				cur = getCellInDirection(prev, direction[a]);
				if (cur === "Out Of Bounds"){
					prev = origin;
					break;
				}
				var content = cellContents(grid, cur);
				if(content){
					if (content === this.color){
						prev = origin;
						break;
					} else {
						list.push(cur);
						prev = origin;
						break;
					}
				} else {
					list.push(cur);
					prev = cur;
				}
			}
		}
		this.possibleDestinations = list;
	}
}

class Queen extends Piece {
	constructor(color){
		super(color);
		this.value = 9;
		this.possibleDestinations = [];
		this.symbol = 'Q';
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
			explain("Invalid movement pattern for queen")
			return false;
		}
	}

	buildMoveList(grid, origin){
		var list = [];
		var cur;
		var prev = origin;
		var direction = ["W", "NW", "N", "NE", "E", "SE", "S", "SW"];
		for(var a = 0; a < 8; a++){
			prev = origin;
			for(var i = 1; i < 8 ; i++){
				cur = getCellInDirection(prev, direction[a]);
				if (cur === "Out Of Bounds"){
					prev = origin;
					break;
				}
				var content = cellContents(grid, cur);
				if(content){
					if (content === this.color){
						prev = origin;
						break;
					} else {
						list.push(cur);
						prev = origin;
						break;
					}
				} else {
					list.push(cur);
					prev = cur;
				}
			}
		}
		this.possibleDestinations = list;
	}
}

class King extends Piece {
	constructor(color){
		super(color);
		this.possibleMoves = ['1,1','1,0','1,-1','0,-1','0,1','-1,1','-1,0','-1,-1','2,0','-2,0'];
		this.value = 0;
		this.symbol = 'K';
		this.checked = false;
	}
	requestMove(grid, origin, destination, production){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		var movement = getMovementShape(origin, destination);
		var index = this.possibleMoves.indexOf(movement.toString());
		if(index >= 0 && index < 8){
			return true;
		} else if (index >= 8){
			if(this.checked){
				explain("Trying to castle a king that is in check")
				return false;
			}
			if(this.moved){
				explain("Trying to castle a king that has been moved")
				return false;
			} else {
				if (index == 8){
					if(cellContents(grid, 'f' + destination[1])){
						explain("Pieces in the way of castling move")
						return false;
					}
					if(cellContents(grid, 'g' + destination[1])){
						explain("Pieces in the way of castling move")
						return false;
					}
					if(production){
						if(!chessEngine.requestMove(origin, 'f' + destination[1])){
							explain("Trying to castle a king through a check")
							return false;
						}
					}
					if(!production){
						if(!chessEngineTest.requestMove(origin, 'f' + destination[1])){
							explain("Trying to castle a king through a check")
							return false;
						}
					}
				}
				if (index == 9){
					if(cellContents(grid, 'b' + destination[1])){
						explain("Pieces in the way of castling move")
						return false;
					}
					if(cellContents(grid, 'c' + destination[1])){
						explain("Pieces in the way of castling move")
						return false;
					}
					if(cellContents(grid, 'd' + destination[1])){
						explain("Pieces in the way of castling move")
						return false;
					}
					if(production){
						if(!chessEngine.requestMove(origin, 'd' + destination[1])){
							explain("Trying to castle a king through a check")
							return false;
						}
					}
					if(!production){
						if(!chessEngineTest.requestMove(origin, 'd' + destination[1])){
							explain("Trying to castle a king through a check")
							return false;
						}
					}
				}
				// check for 4 possible castling moves
				var index2 = ['c1', 'c8', 'g1', 'g8'].indexOf(destination);
				var rook;
				if(index2 >=0){
					if (index2 < 2){
						rook = grid["a" + destination[1]];
					} else {
						rook = grid["h" + destination[1]];
					}
					if(rook){
						if(rook.moved){
							explain("Trying to castle with a rook that has been moved")
							return false;
						} else {
							//move rook to facilitate castling
							if(production){
								if(index === 9){
									rook.moved = true;
									grid['f' + destination[1]] = rook;
									$('#f' + destination[1])[0].innerHTML = "♜"
									$('#f' + destination[1]).addClass(rook.color.toLowerCase());
									grid['h' + destination[1]] = null;
									$('#h' + destination[1])[0].innerHTML = ""
								}
								if(index === 10){
									rook.moved = true;
									grid['d' + destination[1]] = rook;
									$('#d' + destination[1])[0].innerHTML = "♜"
									$('#d' + destination[1]).addClass(rook.color.toLowerCase());
									grid['a' + destination[1]] = null;
									$('#a' + destination[1])[0].innerHTML = ""
								}
							}
							return true;
						}
					} else {
						explain("No rook present")
						return false;
					}
				} else {
					explain("Not a valid castling square")
					return false;
				}
			}
		} else {
			explain("Invalid movement pattern for king")
			return false;
		}
	}
	buildMoveList(grid, origin){
		return;
	}
}