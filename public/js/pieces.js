'use strict'



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
	if(direction.indexOf('N') >= 0){
		y += 1;
	}
	if(direction.indexOf('S') >= 0){
		y -= 1;
	}
	if(direction.indexOf('W') >= 0){
		var val = letters.indexOf(x);
		val -= 1;
		x = letters[val];
	}
	if(direction.indexOf('E') >= 0){
		var val = letters.indexOf(x);
		val += 1;
		x = letters[val];
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
	}
	requestMove(grid, origin, destination){
		if(grid[destination]){//If there is something at destination.
			if (grid[destination].requestMove){ //If it is a piece
				if (grid[destination].color == this.color){ //If it is a teammate
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
		this.moved = false;
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
			return false;
		}
		if (index === 0){
			if(enemyInCell){
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
				return false;
			}
		}
		if(index === 1){
			if (this.moved){
				return false;
			}
			if (enemyInCell){
				return false;
			}
			var cells = cellsBetween(grid, origin, destination);
			if (cells){
				if (objectInCells(grid, cells)){
					return false;
				} else {
					grid[cells[0]] = "EnPassant" + this.color;
					return true;
				}
			}
		}
	}
}

class Rook extends Piece {
	constructor(color){
		super(color);
		this.moved = false;
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
	}
}

class Knight extends Piece {
	constructor(color){
		super(color);
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
	}
}

class Bishop extends Piece {
	constructor(color){
		super(color);
		this.moved = false;
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
	}
}

class Queen extends Piece {
	constructor(color){
		super(color);
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
	}
}

class King extends Piece {
	constructor(color){
		super(color);
		this.moved = false;
		this.checked = false;
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
	}
}