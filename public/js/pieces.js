'use strict'

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
		this.possibleDestinations;
		this.moved = false;
		this.value = 1;
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
		this.moved = false;
		this.value = 5;
		this.possibleDestinations = [];
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
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
		this.moved = false;
		this.value = 3;
		this.possibleDestinations = [];
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
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
	}
	requestMove(grid, origin, destination){
		if (!super.requestMove(grid, origin, destination)){
			return false;
		}
		this.buildMoveList(grid, origin);
		if(this.possibleDestinations.indexOf(destination)>=0){
			return true;
		} else {
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
		this.possibleMoves = ['1,1','1,0','1,-1','0,-1','0,0','0,1','-1,1','-1,0','-1,-1'];
		this.moved = false;
		this.checked = false;
		this.value = 0;
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
			return false;
		}
	}
	buildMoveList(grid, origin){
		return;
	}
}