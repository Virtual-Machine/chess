function idToPiece(id){
	if(id == null){
		return null;
	}
	var color = id[0];
	if (color === 'w'){
		color = 'White'
	} else {
		color = 'Black'
	}
	id = id[1];
	switch(id){
		case '♟':
			return new Pawn(color);   
		case '♜':
			return new Rook(color);
		case '♞':
			return new Knight(color);
		case '♝':
			return new Bishop(color);
		case '♛':
			return new Queen(color);
		case '♚':
			return new King(color);
	}
}

function mapToLetter(val){
	return letters[val];
}

function mapToValue(letter){
	return letters.indexOf(letter);
}



function getPieceAtCoords(coords){
	if (positions[coords]){
		var piece = positions[coords][1];
		if(positions[coords][0] == "w"){
			return "<div id='" + coords + "' class='holder white'>" + piece + "</div>"
		} else {
			return "<div id='" + coords + "' class='holder black'>" + piece + "</div>"
		}
	} else {
		return "<div id='" + coords + "' class='holder'></div>";
	}
}

function initializeMapping(){
	var counter = 0;
	for(var a = 8; a > 0; a--){
		for(var b = 1; b < 9; b++){
			coordMap[counter++] = mapToLetter(b) + '' + a;
		}
	}
}


function initializeBoard(){
	var counter = 0;
	var boolSwitch = false;
	for(var i = 0; i < 64; i++){
		if (++counter > 8){
			counter = 1;
			boolSwitch = !boolSwitch;
		}
		boolSwitch = !boolSwitch;
		if (boolSwitch){
			$('#board').append("<div class='cell light'>" + getPieceAtCoords(coordMap[i]) + "</div>");	
		} else {
			$('#board').append("<div class='cell'>" + getPieceAtCoords(coordMap[i]) + "</div>");
		}
	}
}

function cellContents(grid, coord){
	if(grid[coord].content){
		return grid[coord].content.color;
	} else {
		return null;
	}
}

function explain(text){
	// console.log("Rejected: " + text);
}

function objectInCells(grid, cells){
	for(var i in cells){
		if(grid[cells[i]].content){
			return true;
		}
	}
	return false;
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

function submitValue(){
	$('#pieceWindow').css('visibility', 'hidden');
	var selection = $('#pieceSelect').val();
	var coords = $('#pieceWindow').data('coords');
	var color = $('#pieceWindow').data('color');
	switch(selection){
		case 'Knight':
			$('#' + coords)[0].innerHTML = "♞"
			chessEngine.grid[coords].content = new Knight(color);
			break;
		case 'Bishop':
			$('#' + coords)[0].innerHTML = "♝"
			chessEngine.grid[coords].content = new Bishop(color);
			break;
		case 'Rook':
			$('#' + coords)[0].innerHTML = "♜"
			chessEngine.grid[coords].content = new Rook(color);
			break;
		case 'Queen':
			$('#' + coords)[0].innerHTML = "♛"
			chessEngine.grid[coords].content = new Queen(color);
			break;
	}
	chessEngine.searchForCheck();
	chessEngine.calculateLegalMoves(chessEngine.turn);
	chessEngine.pause = false;
	if(chessEngine.whiteTurn){
		$('#wYourTurn').css("visibility", "visible");
	} else {
		$('#bYourTurn').css("visibility", "visible");
	}
}

function checkmate(color){
	var opponent;
	if (color === 'White'){
		opponent = 'Black';
	} else {
		opponent = 'White';
	}
	$('#wYourTurn').css("visibility", "hidden");
	$('#bYourTurn').css("visibility", "hidden");
	$('#gameBanner')[0].innerHTML = "Checkmate: " + opponent + " wins."
}


function stalemate(){
	$('#wYourTurn').css("visibility", "hidden");
	$('#bYourTurn').css("visibility", "hidden");
	$('#gameBanner')[0].innerHTML = "Stalemate: Its a draw."
}

function hideThemePicker(){
	$('#themePicker').css("visibility", "hidden");
}

function changeTheme1(){
	var stylesheet = document.styleSheets[1];
	for(var i in stylesheet.cssRules){
		if(stylesheet.cssRules[i].selectorText === '.black'){
			stylesheet.cssRules[i].style.color = $('#html5colorpicker1').val()
		}
	}
}

function changeTheme2(){
	var stylesheet = document.styleSheets[1];
	for(var i in stylesheet.cssRules){
		if(stylesheet.cssRules[i].selectorText === '.white'){
			stylesheet.cssRules[i].style.color = $('#html5colorpicker2').val()
		}
	}
}

function changeTheme3(){
	var stylesheet = document.styleSheets[1];
	for(var i in stylesheet.cssRules){
		if(stylesheet.cssRules[i].selectorText === '#board'){
			stylesheet.cssRules[i].style.backgroundColor = $('#html5colorpicker3').val()
		}
	}
}

function changeTheme4(){
	var stylesheet = document.styleSheets[1];
	for(var i in stylesheet.cssRules){
		if(stylesheet.cssRules[i].selectorText === '.light'){
			stylesheet.cssRules[i].style.backgroundColor = $('#html5colorpicker4').val()
		}
	}
}

function addMove(piece, origin, destination){
	$('.moveList').append("<p>" + piece + ": " + origin + " ~> " + destination + "</p>")
}