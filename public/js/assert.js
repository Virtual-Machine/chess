var passingTests = 0;
var failingTests = 0;

var chessEngineTest = new ChessEngine();
chessEngineTest.initializeGrid();



// Error messages ->
var falseNegative = "Engine rejected valid move"
var falsePositive = "Engine accepted invalid move"
var unimplemented = "Unimplemented test"

// Pawn movement ->
var move1 = chessEngineTest.requestMove("a2", "a4");
var move2 = chessEngineTest.requestMove("b2", "b3");
var move3 = chessEngineTest.requestMove("c2", "c5");

function* idMaker(){
  var index = 1;
  while (true) {
  	yield "Test " + index++;
  }
	
}

var gen = idMaker();

moveShouldPass(move1, gen.next().value);
moveShouldPass(move2, gen.next().value);
moveShouldFail(move3, gen.next().value);





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