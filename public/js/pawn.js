class Pawn extends Piece {
	constructor(color){
		super(color);
		this.value = 1;
		this.symbol = 'P';
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
			if(grid[cellN].isEmpty()){
				this.legalMoves.push(origin + "," + cellN);
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
			if(grid[cellS].isEmpty()){
				this.legalMoves.push(origin + "," + cellS);
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
}