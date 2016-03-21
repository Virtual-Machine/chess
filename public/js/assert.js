var passingTests = 0;
var failingTests = 0;


var chessEngineTest = new ChessEngine(false);
chessEngineTest.initializeGrid();

var gen = idMaker();

// Error messages ->
var falseNegative = "Engine rejected valid move"
var falsePositive = "Engine accepted invalid move"
var unimplemented = "Unimplemented test"

// Pawn movement ->
var move1 = chessEngineTest.requestMove("a2", "a4"); // two steps forward possible on start
var move2 = chessEngineTest.requestMove("b2", "b3"); // 1 step forward possible
var move3 = chessEngineTest.requestMove("c2", "c5"); // 3 steps forward not possible

moveShouldPass(move1, gen.next().value);
moveShouldPass(move2, gen.next().value);
moveShouldFail(move3, gen.next().value);

chessEngineTest.movePiece("h2", "g3");
chessEngineTest.movePiece("h7", "f3");


var move4 = chessEngineTest.requestMove("f2", "f3"); //pawn cant kill forward
var move5 = chessEngineTest.requestMove("g2", "g3"); //pawn cant land on friend
var move6 = chessEngineTest.requestMove("f2", "g3"); //pawn cant kill friend
var move7 = chessEngineTest.requestMove("g2", "f3"); //pawn can kill enemy diagonally
var move8 = chessEngineTest.requestMove("f2", "f4"); //pawn cant jump enemy
var move9 = chessEngineTest.requestMove("g2", "g4"); //pawn cant jump friend

moveShouldFail(move4, gen.next().value);
moveShouldFail(move5, gen.next().value);
moveShouldFail(move6, gen.next().value);
moveShouldPass(move7, gen.next().value);
moveShouldFail(move8, gen.next().value);
moveShouldFail(move9, gen.next().value);

chessEngineTest.flagCell('a3', 'Black');
chessEngineTest.flagCell('b3', 'White');
var move10 = chessEngineTest.requestMove("b2", "a3"); //pawn can kill enpassant...
var move11 = chessEngineTest.requestMove("a2", "b3"); //... but not when incorrect color.


moveShouldPass(move10, gen.next().value);
moveShouldFail(move11, gen.next().value);

chessEngineTest.movePiece('a7', 'a5')
chessEngineTest.movePiece('b2', 'b5')
chessEngineTest.flagCell('a6', 'Black');
var move12 = chessEngineTest.requestMove("b5", "a6");
moveShouldPass(move12, gen.next().value);
assert("EnPassant Removal Check", chessEngineTest.grid["a5"] == null, "Not removed")

chessEngineTest.initializeGrid();


//Castling rules
//1. There are no pieces between the king and the chosen rook.
chessEngineTest.movePiece("g1", "g5")
chessEngineTest.movePiece("c1", "c5")
chessEngineTest.movePiece("g8", "g6")
chessEngineTest.movePiece("c8", "c6")

var move13 = chessEngineTest.requestMove("e1", "g1");
var move14 = chessEngineTest.requestMove("e1", "c1");
var move15 = chessEngineTest.requestMove("e8", "g8");
var move16 = chessEngineTest.requestMove("e8", "c8");

moveShouldFail(move13, gen.next().value);
moveShouldFail(move14, gen.next().value);
moveShouldFail(move15, gen.next().value);
moveShouldFail(move16, gen.next().value);



//2. Neither the king nor the chosen rook has previously moved.

chessEngineTest.movePiece("f1", "f5")
chessEngineTest.movePiece("f8", "f6")

chessEngineTest.grid["h8"].moved = true;

var move17 = chessEngineTest.requestMove("e1", "g1");
var move18 = chessEngineTest.requestMove("e8", "g8");
moveShouldPass(move17, gen.next().value);
moveShouldFail(move18, gen.next().value);

chessEngineTest.grid["h8"].moved = false;
chessEngineTest.grid["e1"].moved = true;

var move19 = chessEngineTest.requestMove("e1", "g1");
var move20 = chessEngineTest.requestMove("e8", "g8");
moveShouldFail(move19, gen.next().value);
moveShouldPass(move20, gen.next().value);
chessEngineTest.grid["e1"].moved = false;
//3. The king is not currently in check.

var move21 = chessEngineTest.requestMove("e1", "g1");
chessEngineTest.movePiece("g6", "g2")
var move22 = chessEngineTest.requestMove("e1", "g1");

moveShouldPass(move21, gen.next().value);
moveShouldFail(move22, gen.next().value);

//4. The king does not pass through a square that is attacked by an enemy piece.
chessEngineTest.movePiece("g2", "h2")
var move23 = chessEngineTest.requestMove("e1", "g1");
moveShouldFail(move23, gen.next().value);

//5. The king does not end up in check. (True of any legal move.)
chessEngineTest.movePiece("h2", "h3")
var move24 = chessEngineTest.requestMove("e1", "g1");
moveShouldFail(move24, gen.next().value);



console.log("There were: " + passingTests + " passing tests.");
console.log("There were: " + failingTests + " failing tests.");

function moveShouldPass(result, name){
	assert( name, result, falseNegative );
}

function moveShouldFail(result, name){
	if (result === true || result === false){
		assert( name, !result, falsePositive );	
	} else {
		assert( name, null, null );
	}
	
}

function assert(name, testCondition, errorMsg){
	if(testCondition === true){
		passingTests += 1;
	} else if (testCondition === false){
		failingTests += 1;
		console.error(errorMsg + " : " + name);
	} else {
		failingTests += 1;
		console.warn(unimplemented + " : " + name);
	}
}

function* idMaker(){
  var index = 1;
  while (true) {
  	yield "Test " + index++;
  }
	
}