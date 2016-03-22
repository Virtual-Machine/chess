class King extends Piece {
	constructor(color){
		super(color);
		this.value = 0;
		this.symbol = 'K';
	}
	calculateLegalMoves(origin, analyze){
		var queenSideSafe = true;
		var kingSideSafe = true;
		this.legalMoves = [];
		var row = origin[1];
		var opponent;
		if(this.color === 'White'){
			opponent = 'Black'
		} else {
			opponent = 'White'
		}
		for(var i in chessEngine.grid){
			if(chessEngine.grid[i].content){
				if(chessEngine.grid[i].content.color === opponent){
					if(chessEngine.grid[i].content.canSeeKing(i, 'f' + row)){
						kingSideSafe = false;
					}
					if(chessEngine.grid[i].content.canSeeKing(i, 'd' + row)){
						queenSideSafe = false;
					}
				}
			}
		}
		if(!this.moved && chessEngine.check !== this.color){
			var cell1 = chessEngine.grid["a" + row];
			var cell2 = chessEngine.grid["b" + row];
			var cell3 = chessEngine.grid["c" + row];
			var cell4 = chessEngine.grid["d" + row];
			var cell6 = chessEngine.grid["f" + row];
			var cell7 = chessEngine.grid["g" + row];
			var cell8 = chessEngine.grid["h" + row];
			if(cell1.content && queenSideSafe){
				if(cell1.content instanceof Rook){
					if(!cell1.content.moved){
						if(cell2.isEmpty() && cell3.isEmpty() && cell4.isEmpty()){
							this.legalMoves.push(origin + ',' + "c" + row);
						}
					}
				}
			}
			if(cell8.content && kingSideSafe){
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

	makeMove(origin, destination){
		var cell1;
		var cell2;
		var movement = getMovementShape(origin, destination);
		if(movement[0] === 2 || movement[0] === -2){
			if(movement[0] === 2){
				cell1 = getCellInDirection(destination, 'E');
				cell2 = getCellInDirection(destination, 'W');
			}
			if(movement[0] === -2){
				cell1 = getCellInDirection(destination, 'W');
				cell1 = getCellInDirection(cell1, 'W');
				cell2 = getCellInDirection(destination, 'E');
			}
			chessEngine.grid[cell2].content = chessEngine.grid[cell1].content
			chessEngine.grid[cell1].content = null;
			chessEngine.grid[cell2].content.moved = true;
			$('#' + cell1)[0].innerHTML = "";
			$('#' + cell2)[0].innerHTML = "♜";
			$('#' + cell2)[0].className = "holder " + this.color.toLowerCase();
		}
		super.makeMove(origin, destination);
	}
}