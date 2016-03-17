'use strict'

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
			this.possibleMoves = [[0,1],[0,2],[-1,1],[1,1]]
		} else {
			this.possibleMoves = [[0,-1],[0,-2],[-1,-1],[1,-1]]
		}
		this.moved = false;
	}

	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		var movement = getMovementShape(origin, destination);
		var index = this.possibleMovesin(movement);
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