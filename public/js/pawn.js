class Pawn extends Piece {
	constructor(color){
		super(color);
		this.value = 1;
		this.symbol = 'P';
		this.attackMoves = [];
	}

	calculateLegalMoves(origin){
		var grid = chessEngine.grid;
		this.legalMoves = [];
		if(this.color === 'White'){
			var cellN = getCellInDirection(origin, 'N');
			var cellNE = getCellInDirection(origin, 'NE');
			var cellNW = getCellInDirection(origin, 'NW');
			if(!this.moved){
				var cellNN = getCellInDirection(cellN, 'N');
				if (grid[cellN].isEmpty() && grid[cellNN].isEmpty()){
					this.legalMoves.push(origin + "," + cellNN);
				}
			}
			if(cellN !== "Out Of Bounds"){
				if(grid[cellN].isEmpty()){
					this.legalMoves.push(origin + "," + cellN);
				}
			}	
			if(cellNE !== "Out Of Bounds"){
				if(grid[cellNE].hasOpponent() || grid[cellNE].hasFlag('Black')){
					this.legalMoves.push(origin + "," + cellNE);	
				}
			}
			if(cellNW !== "Out Of Bounds"){
				if(grid[cellNW].hasOpponent() || grid[cellNW].hasFlag('Black')){
					this.legalMoves.push(origin + "," + cellNW);	
				}
			}
		} else {
			var cellS = getCellInDirection(origin, 'S');
			var cellSE = getCellInDirection(origin, 'SE');
			var cellSW = getCellInDirection(origin, 'SW');
			if(!this.moved){
				var cellSS = getCellInDirection(cellS, 'S');
				if (grid[cellS].isEmpty() && grid[cellSS].isEmpty()){
					this.legalMoves.push(origin + "," + cellSS);
				}
			}
			if(cellN !== "Out Of Bounds"){
				if(grid[cellS].isEmpty()){
					this.legalMoves.push(origin + "," + cellS);
				}
			}
			if(cellSE !== "Out Of Bounds"){
				if(grid[cellSE].hasOpponent() || grid[cellSE].hasFlag('White')){
					this.legalMoves.push(origin + "," + cellSE);	
				}
			}
			if(cellSW !== "Out Of Bounds"){
				if(grid[cellSW].hasOpponent() || grid[cellSW].hasFlag('White')){
					this.legalMoves.push(origin + "," + cellSW);	
				}
			}
		}
	}

	canSeeKing(origin, coord){
		var grid = chessEngine.grid;
		this.attackMoves = [];
		if(this.color === 'White'){
			var cellNE = getCellInDirection(origin, 'NE');
			var cellNW = getCellInDirection(origin, 'NW');
			if(cellNE !== "Out Of Bounds"){
				if(grid[cellNE].hasOpponent() || grid[cellNE].hasFlag('Black')){
					this.attackMoves.push(origin + "," + cellNE);	
				}
			}
			if(cellNW !== "Out Of Bounds"){
				if(grid[cellNW].hasOpponent() || grid[cellNW].hasFlag('Black')){
					this.attackMoves.push(origin + "," + cellNW);	
				}
			}
		} else {
			var cellSE = getCellInDirection(origin, 'SE');
			var cellSW = getCellInDirection(origin, 'SW');
			if(cellSE !== "Out Of Bounds"){
				if(grid[cellSE].hasOpponent() || grid[cellSE].hasFlag('White')){
					this.attackMoves.push(origin + "," + cellSE);	
				}
			}
			if(cellSW !== "Out Of Bounds"){
				if(grid[cellSW].hasOpponent() || grid[cellSW].hasFlag('White')){
					this.attackMoves.push(origin + "," + cellSW);	
				}
			}
		}
		for(var i in this.attackMoves){
			var destination = this.attackMoves[i].split(',')[1];
			if(destination === coord){
				return true;
			}
		}
		return false;
	}

	makeMove(origin, destination){
		var cell;
		var movement = getMovementShape(origin, destination);
		if(movement[1] === 2 || movement[1] === -2){
			if(movement[1] === 2){
				cell = getCellInDirection(origin, 'N');
			}
			if(movement[1] === -2){
				cell = getCellInDirection(origin, 'S');
			}
			chessEngine.grid[cell].setFlag(this.color);
		}
		var opponent;
		if(this.color === 'White'){
			opponent = 'Black'
		} else {
			opponent = 'White'
		}
		if(chessEngine.grid[destination].hasFlag(opponent)){
			if(movement[1] === 1){
				cell = getCellInDirection(destination, 'S');
			}
			if(movement[1] === -1){
				cell = getCellInDirection(destination, 'N');
			}
			chessEngine.grid[cell].content = null;
			$('#' + cell)[0].innerHTML = ""
		}
		super.makeMove(origin, destination);
	}
}