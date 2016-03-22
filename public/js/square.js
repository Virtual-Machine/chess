class Square {
	constructor(piece){
		this.content = piece;
		this.enPassantFlag = false;
	}
	acceptPiece(piece){
		this.content = piece;
	}
	removePiece(){
		this.content = null;
	}
	setFlag(color){
		this.enPassantFlag = color;
	}
	removeFlag(){
		this.enPassantFlag = false;
	}
	hasPiece(){
		if(this.content){
			return true;
		} else {
			return false;
		}
	}
	hasFlag(color){
		if(this.enPassantFlag === color){
			return true;
		} else {
			return false;
		}
	}
	hasTeammate(color){
		if(this.content){
			if(this.content.color === color){
				return true;
			}
		}
		return false;
	}
	hasOpponent(color){
		if(this.content){
			if(this.content.color !== color){
				return true;
			}
		}
		return false;
	}
	isEmpty(){
		if(!this.content){
			return true;
		} else {
			return false;
		}
	}
}