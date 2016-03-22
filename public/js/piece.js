class Piece {
	constructor(color){
		this.color = color;
		this.moved = false;
		this.legalMoves = [];
	}

	makeMove(origin, destination){
		chessEngine.grid[destination].content = chessEngine.grid[origin].content;
		chessEngine.grid[origin].content = null;
	}
}