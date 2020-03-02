//Model functions
var model = {

  state: {},

  //initialize board

  initialize: () => {
    //set up state variables
    //whose turn (start with X)
    model.state.currentPlayer = 'X';
    //board solved (start with 'false')
    model.state.boardSolved = false;
    //winner (start with null)
    model.state.winner = null;
    //set up 3x3 array
    model.state.currentBoard = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    //reset the banner function
    view.renderBanner(null);
    //send the new board to the render function
  },

  //turn swapping helper function
  swapTurns: () => {
    var swap = {
      X: 'O',
      O: 'X'
    };
    model.state.currentPlayer = swap[currentPlayer];
  },

  //draw a new board when a move is received
  updateBoard: (moveObj) => {
    //slice current 3x3 board
    var newBoard = model.state.currentBoard.slice();
    //take move sent from controller's event listener and update the new board
    newBoard[moveObj.move[1]][moveObj.move[0]] = moveObj.token;
    //switch whose turn it is
    model.swapTurns();
    //check if the board is solved
    var victory = isBoardSolved(newBoard);
      //isBoardSolved returns a tuple of [bool, string] with bool representing board state
      //if bool is true
      if(victory[0] === true) {
        //render the victory banner based on the string
        view.renderBanner(victory[1]);
      }
    //regardless, pass the new board to the render function
    view.renderBoard(newBoard);
    //and update the existing board
    model.state.currentBoard = newBoard;
  },


    //send that board to View's render functions
  solverHelpers: {
    //diagonal helper functions
    majorDiagonalHelper: (board) => {
      if (board[0][0] === 'X' && board[1][1] === 'X' && board[2][2] === 'X') {
        return 'X';
      } else if (board[0][0] === 'O' && board[1][1] === 'O' && board[2][2] === 'O') {
        return 'O';
      } else {
        return false;
      }
    },

    minorDiagonalHelper: (board) => {
      if (board[2][0] === 'X' && board[1][1] === 'X' && board[0][2] === 'X') {
        return 'X';
      } else if (board[2][0] === 'O' && board[1][1] === 'O' && board[0][2] === 'O') {
        return 'O';
      } else {
        return false;
      }
    },

    //row helper function
    rowHelper: (board) => {
      for (let i = 0; i < 3; i++) {
        if (board[i][0] === 'X' && board[i][1] === 'X' && board[i][2] === 'X') {
          return 'X'
        } else if (board[i][0] === 'O' && board[i][1] === 'O' && board[i][2] === 'O') {
          return 'O'
        }
      }
      return false;
    },

    //column helper functions
    columnHelper: (board) => {
      for (let i = 0; i < 3; i++) {
        if (board[0][i] === 'X' && board[1][i] === 'X' && board[2][i] === 'X') {
          return 'X'
        } else if (board[0][i] === 'O' && board[1][i] === 'O' && board[2][i] === 'O') {
          return 'O'
        }
      }
      return false;
    }
  },

  //check if board has been solved
  isBoardSolved: (board) => {
    //check each helper function in increasing order of time complexity
    var solved = majorDiagonalHelper(board);
    if (!solved) {
      solved = minorDiagonalHelper(board);
    }
    if (!solved) {
      solved = rowHelper(board);
    }
    if (!solved) {
      solved = columnHelper(board);
    }
    //if solved is still not true, the game continues!
    if (!solved) {
      //return false and null
      return [solved, null];
    } else {
      //if the board is solved, return true and the winner
      return [true, solved];
    }
    /* premature optimization - check for games where victory is impossible */
  }
};



//View functions
var view = {
  //update DOM after each move - general board renderer
    /* premature optimization - include an undo button if the user presses the last square that was placed */
    //add event listener to squares that need it - blank ones
    //rerender board (do not reload page) that is passed in from model

  //render a banner with the victor
  renderBanner: (winner) => {
    if (winner === null) {
      console.log('GET READY!');
    } else {
      console.log(`${winner} wins the round!`)
    }
  }
    //initialize will send a reset request (null) that should be handled
    //take winner state
    //append a bold banner '{state.winner} is the Victor'
    /* premature optimization - banner could list the current king of the hill or reigning champ when board is reset*/
};

var controller = {
//Controller functions
  //update board when a piece is placed
    //attach event listener to empty squares

  createEventListener: (xyTuple) => {
    //takes the tuple [x, y] from view when the listener is added and returns a function
    return (() => {
      //that calls the updateBoard function with a move Object
      model.updateBoard({
        move: xyTuple,
        token: currentPlayer
      });
      //and logs the move to the console
      console.log(`${currentPlayer} places at [${xyTuple[0]}, ${xyTuple[1]}].`)
    });
  }

};


//initialize the app after declaring all these functions!
model.initialize();