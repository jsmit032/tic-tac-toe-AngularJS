var TTTApp = angular.module('TTTApp', []);

var scopeThing,
    gameInProgress = true;

TTTApp.controller('TTTController', function ($scope) {
  scopeThing = $scope;

  $scope.testString = "Angular source, App, and Controller present" ;

  //List of user errors
  $scope.userErrors = [
      {
        name: 'Too Few Players',
        message: 'Name of two players is required!',
        occurred: false
      },
      {
          name: 'Already Clicked!',
          message: 'Please selected another square!',
          occurred: false
      },
      {
          name: 'Game Over',
          message: 'Game Over! Please start a new game.',
          occurred: false
      }
  ]; //end of user error messages

  //  Create something to store the status of the cells:
  $scope.cellList = [
  {status: "null", clickNumber: 0, value: 1},
  {status: "null", clickNumber: 0, value: 2},
  {status: "null", clickNumber: 0, value: 4},
  {status: "null", clickNumber: 0, value: 8},
  {status: "null", clickNumber: 0, value: 16},
  {status: "null", clickNumber: 0, value: 32},
  {status: "null", clickNumber: 0, value: 64},
  {status: "null", clickNumber: 0, value: 128},
  {status: "null", clickNumber: 0, value: 256}
  ];// end of cell storage

  // array of player and function to insert player's name
  // from input field, limits to two players.
  // also assigns a score property to each player
  $scope.players = [];
  var namePlaceholders = ["name of player", "player 2 name"];
  $scope.namePlaceholder = namePlaceholders[0];

  $scope.addInput = function() {
    if($scope.players.length >= 2) {
      console.log("You've reached the player limit");
      $scope.userErrors[0].occurred = false;
    } else {
      $scope.players.push({name: $scope.playerName, score: 0, wins: 0});
      $scope.namePlaceholder = namePlaceholders[$scope.players.length & 1];
      $scope.playerName = "";
    }
  }; // end of add Input function

  // Clears the score and move count,
  // erases the board, and makes it X's turn
  $scope.startNewGame = function () {
      $scope.movecounter = 0;
      gameInProgress = true;
      $scope.userErrors[2].occurred = false;
      for (var i = 0; i < $scope.cellList.length; i++) {
          $scope.cellList[i].status = "null";
          $scope.cellList[i].clickNumber = 0;
      } // clear board
      for (var i = 0; i < $scope.players.length; i++) {
          $scope.players[i].score = 0;
      }

     // Testing to console
      console.log("connected ");
      console.log("move counter: " + $scope.movecounter);
      console.log("status is: " + $scope.cellList.status);
      console.log("score is: " + $scope.players.score);
      console.log("Game in Progress? " + gameInProgress);
  };

  // can this be inherited from the start New Game???
  $scope.restartGame = function () {
      gameInProgress = true;
      $scope.userErrors[2].occurred = false;
      $scope.movecounter = 0;
      $scope.players = [];
      for (var i = 0; i < $scope.cellList.length; i++) {
          $scope.cellList[i].status = "null";
          $scope.cellList[i].clickNumber = 0;
      } // clear board
  };

  // Binary sums for win
  var winNums = [7, 56, 448, 73, 146, 292, 273, 84];

  // Returns whether the given score is a winning score.
  $scope.win = function (score) {
    for (var i = 0; i < winNums.length; i++) {
        if ((winNums[i] & score) == winNums[i]) {
            return true;
        }
    }
    return false;
  };

  // Stops game by making all clickNumbers = 1, however
  // error message displays to player as asking to click another
  // square instead of game over.
  $scope.stopGame = function() {
    for (var i = 0; i < $scope.cellList.length; i++) {
        $scope.cellList[i].clickNumber = 1;
    }
  };

  $scope.movecounter = 0;

  $scope.testJS = function() {
    console.log('Correctly accessing JS function.') ;
  };

  // function that enables player to pick a square that turn
  // cell to X or O based on the movecounter
  // won't allow a cell to change if clicked on more than once

  $scope.playerPicks = function(thisCell) {
    if ($scope.players.length != 2) {
        // Shows userErrors Not Enough Players if players array not equal to 2
        $scope.userErrors[0].occurred = true;
    } else {
        // if cell already clicked and gameInProcess, userErrors Already Clicked occurs
        if (thisCell.clickNumber == 1 && gameInProgress) {
          $scope.userErrors[1].occurred = true;
          console.log("GAME IN SESSION: " + $scope.userErrors[1].name + " occurred ?: " + $scope.userErrors[1].occurred);
      } else {
            var turn = $scope.players[$scope.movecounter % 2];

            // if clicked cell equals 0 and game not in progress then gameOver() is ran and userErrors Game Over occurs
            //userError already clicked also gets set to false since game is over
            if ((thisCell.clickNumber == 0 || 1) && !gameInProgress) {
                $scope.userErrors[2].occurred = true;
                $scope.userErrors[1].occurred = false;
                console.log("GAME OVER: " + $scope.userErrors[1].name + " occurred ?: " + $scope.userErrors[1].occurred);

            } else {
                //else if clickNumber doesn't equal 0 and game is in progress
                // then players can select squares until there's
                // a winner or cat game
                $scope.movecounter++; //tracks moves to determine turn
                console.log('Cell was: ' + thisCell.status);

                thisCell.clickNumber++;
                if (($scope.movecounter % 2) == 1) {
                    thisCell.status = "X";
                    $scope.userErrors[1].occurred = false;
                } else {
                    thisCell.status = "O";
                    $scope.userErrors[1].occurred = false;
                }

                turn.score += thisCell.value;
                alert("turn: " + turn.name);

                if ($scope.win(turn.score)) {
                    turn.wins++;
                    gameInProgress = false;
                    $scope.userErrors[2].occurred = true;
                    $scope.userErrors[1].occurred = false;
                    alert(turn.name + " wins!\nwins: " + turn.wins);
                } else if ($scope.movecounter == 9) {
                    alert("Cat Game!");
                    gameInProgress = false;
                    $scope.userErrors[2].occurred = true;
                    $scope.userErrors[1].occurred = false;
                }

              //Testing to console, upon clicks to cells
              console.log("Cell is now: " + thisCell.status);
              console.log("Click Number: " + thisCell.clickNumber);
              console.log("name: " + turn.name + "Score: " + turn.score);
              console.log("Game in Progress? " + gameInProgress);
            }
      }
    }
  }; // end of playerPicks()

}); //end of TTTApp module