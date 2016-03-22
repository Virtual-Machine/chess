class Piece {
	constructor(color){
		this.color = color;
		this.moved = false;
		this.legalMoves = [];
		this.symbol = '';
	}

	makeMove(origin, destination){
		chessEngine.grid[destination].content = chessEngine.grid[origin].content;
		chessEngine.grid[origin].content = null;
		addMove(this.printName(), origin, destination);
	}

	printName(){
		return this.color[0] + this.symbol;
	}
}