class Knight extends Piece {
	constructor(color){
		super(color);
		this.possibleMoves = ["2,1", "1,2", "2,-1", "-1,2", "-2,1", "1,-2", "-2,-1", "-1,-2"];
		this.possibleDestinations;
		this.value = 3;
		this.symbol = 'N';
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

	calculateLegalMoves(origin){
		this.legalMoves = [];
		this.buildMoveList(chessEngine.grid, origin);
		for(var i in this.possibleDestinations){
			if(chessEngine.grid[this.possibleDestinations[i]].hasOpponent(this.color)){
				this.legalMoves.push(origin + "," + this.possibleDestinations[i])
			}
			if(chessEngine.grid[this.possibleDestinations[i]].isEmpty()){
				this.legalMoves.push(origin + "," + this.possibleDestinations[i])
			}
		}
	}
	canSeeKing(origin, coord){
		this.calculateLegalMoves(origin);
		for(var i in this.legalMoves){
			var destination = this.legalMoves[i].split(',')[1];
			if(destination === coord){
				return true;
			}
		}
		return false;
	}
}