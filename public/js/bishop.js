class Bishop extends Piece {
	constructor(color){
		super(color);
		this.value = 3;
		this.possibleDestinations = [];
		this.symbol = 'B';
	}

	calculateLegalMoves(origin){
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
				var cell = chessEngine.grid[cur];
				if(cell.hasTeammate(this.color)){
					prev = origin;
					break;
				}
				if(cell.hasOpponent(this.color)){
					list.push(origin + "," + cur);
					prev = origin;
					break;
				}
				list.push(origin + "," + cur);
				prev = cur;
			}
		}
		this.legalMoves = list;
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