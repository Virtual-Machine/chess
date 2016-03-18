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