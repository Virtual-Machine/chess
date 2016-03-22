class King extends Piece {
	constructor(color){
		super(color);
		this.value = 0;
		this.symbol = 'K';
	}
	calculateLegalMoves(origin, analyze){
		this.legalMoves = [];
		var row = origin[1];
		if(!this.moved && chessEngine.check !== this.color){
			var cell1 = chessEngine.grid["a" + row];
			var cell2 = chessEngine.grid["b" + row];
			var cell3 = chessEngine.grid["c" + row];
			var cell4 = chessEngine.grid["d" + row];
			var cell6 = chessEngine.grid["f" + row];
			var cell7 = chessEngine.grid["g" + row];
			var cell8 = chessEngine.grid["h" + row];
			if(cell1.content){
				if(cell1.content instanceof Rook){
					if(!cell1.content.moved){
						if(cell2.isEmpty() && cell3.isEmpty() && cell4.isEmpty()){
							this.legalMoves.push(origin + ',' + "c" + row);
						}
					}
				}
			}
			if(cell8.content){
				if(cell8.content instanceof Rook){
					if(!cell8.content.moved){
						if(cell6.isEmpty() && cell7.isEmpty()){
							this.legalMoves.push(origin + ',' + "g" + row);
						}
					}
				}
			}
		}
		var cur;
		var cell;
		var direction = ["W", "NW", "N", "NE", "E", "SE", "S", "SW"];
		for(var a = 0; a < 8; a++){
			var ok = true;
			cur = getCellInDirection(origin, direction[a]);
			if (cur === "Out Of Bounds"){
				continue;
			}
			cell = chessEngine.grid[cur];
			if(cell.hasOpponent(this.color)|| cell.isEmpty()){
				if(this.color === "White"){
					if(analyze){
						for (var i in chessEngine.legalMoves["Black"]){
							if(chessEngine.legalMoves["Black"][i].split(',')[1] === cur){
								ok = false;
							}
						}
					}
				} else {
					if(analyze){
						for (var i in chessEngine.legalMoves["White"]){
							if(chessEngine.legalMoves["White"][i].split(',')[1] === cur){
								ok = false;
							}
						}
					}
				}
				if(ok){
					this.legalMoves.push(origin + "," + cur);
				}
			}
		}
	}

	canSeeKing(origin, coord){
		return false;
	}
}