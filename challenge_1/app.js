//Model functions
var model = {

  state: {
    playerX: {
      piece: 'X',
      score: 0,
      name: ''
    },
    playerO: {
      piece: 'O',
      score: 0,
      name: ''
    }
  },

  initialize: () => {
    model.reinitialize();
    view.initializeReset();
    view.initializeForm();
  },

  //initialize board
  reinitialize: (winner) => {
    //set up state variables
    //whose turn (start with X)
    if (winner === model.state.playerX) {
      model.state.currentPlayer = model.state.playerO;
    } else {
      model.state.currentPlayer = model.state.playerX;
    }
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
    view.renderBoard(model.state.currentBoard);
  },

  //turn swapping helper function
  swapTurns: () => {
    var s = model.state;
    if(s.currentPlayer === s.playerX) {
     s.currentPlayer = s.playerO;
    } else {
      s.currentPlayer = s.playerX;
    }
  },

  //draw a new board when a move is received
  updateBoard: (moveObj) => {
    //if the winner has been declared, do nothing
    // console.log('hello from updateBoard', model.state.winner);
    // if(model.state.winner) {
    //   return;
    // }
    //slice current 3x3 board
    var newBoard = model.state.currentBoard.slice();
    //take move sent from controller's event listener and update the new board
    newBoard[moveObj.move[1]][moveObj.move[0]] = moveObj.token;
    //switch whose turn it is
    //check if the board is solved
    var victory = model.isBoardSolved(newBoard);
      //isBoardSolved returns a tuple of [bool, string] with bool representing board state
      //if bool is true
      if(victory[0] === true) {
        //render the victory banner based on the string
        view.renderBanner(victory[1]);
        model.state.winner = victory[1];
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
        console.log(model.state.playerX);
        return model.state.playerX;
      } else if (board[0][0] === 'O' && board[1][1] === 'O' && board[2][2] === 'O') {
        return model.state.playerO;
      } else {
        return false;
      }
    },

    minorDiagonalHelper: (board) => {
      if (board[2][0] === 'X' && board[1][1] === 'X' && board[0][2] === 'X') {
        return model.state.playerX;
      } else if (board[2][0] === 'O' && board[1][1] === 'O' && board[0][2] === 'O') {
        return model.state.playerO;
      } else {
        return false;
      }
    },

    //row helper function
    rowHelper: (board) => {
      for (let i = 0; i < 3; i++) {
        if (board[i][0] === 'X' && board[i][1] === 'X' && board[i][2] === 'X') {
          return model.state.playerX;
        } else if (board[i][0] === 'O' && board[i][1] === 'O' && board[i][2] === 'O') {
          return model.state.playerO;
        }
      }
      return false;
    },

    //column helper functions
    columnHelper: (board) => {
      for (let i = 0; i < 3; i++) {
        if (board[0][i] === 'X' && board[1][i] === 'X' && board[2][i] === 'X') {
          return model.state.playerX;
        } else if (board[0][i] === 'O' && board[1][i] === 'O' && board[2][i] === 'O') {
          return model.state.playerO;
        }
      }
      return false;
    }
  },

  //check if board has been solved
  isBoardSolved: (board) => {
    //check each helper function in increasing order of time complexity
    var solved = model.solverHelpers.majorDiagonalHelper(board);
    if (!solved) {
      solved = model.solverHelpers.minorDiagonalHelper(board);
    }
    if (!solved) {
      solved = model.solverHelpers.rowHelper(board);
    }
    if (!solved) {
      solved = model.solverHelpers.columnHelper(board);
    }
    //if solved is still not true, the game continues!
    if (!solved) {
      //return false and null
      return [solved, null];
    } else {
      //if the board is solved, return true and the winner
      solved.score += 1;
      return [true, solved];
    }
    /* premature optimization - check for games where victory is impossible */
  }
};



//View functions
var view = {
  //update DOM after each move - general board renderer
  renderBoard: (board) => {
    //clear board to rerender
    document.getElementById("board").innerHTML = '';
    //add in each row
    for (let row = 0; row < board.length; row++) {
      var rowObj = document.createElement('div');
      rowObj.setAttribute('class', `row${row}`);
      //document.getElementById('board').appendChild(rowObj); adds rows correctly from here
      //then add in each cell to that row
      for (let col = 0; col < board[row].length; col++){
        //create cell in row (span within div)
        var cellObj = document.createElement('span');
        cellObj.setAttribute('class', `col${col}`);
        //if the cell is blank, add an event listener for click events
        if(board[row][col] === null) {
          cellObj.innerHTML = ' - ';
          //create the function to run when the cell is clicked
          var moveListener = controller.createMoveListener([col,row]);
          //and add it to the cell
          cellObj.addEventListener("click", moveListener);
        } else {
          //if the cell is filled, copy the contents from the board
          cellObj.innerHTML = ` ${board[row][col]} `;
        }
        //add the cell to the row
        rowObj.appendChild(cellObj);
      }
      //add the row of cells to the board
      document.getElementById('board').appendChild(rowObj);
    }
  },
    /* premature optimization - include an undo button if the user presses the last square that was placed */
    //add event listener to squares that need it - blank ones
    //rerender board (do not reload page) that is passed in from model

  //render a banner with the victor
  renderBanner: (winner) => {
    //initialize will send a reset request (null) to clear the current banner
    if (winner === null) {
      console.log(`GET READY!\n${model.state.currentPlayer.name || model.state.currentPlayer.piece} plays first`);
      document.getElementById("banner").innerHTML='';
    } else {
      document.getElementById('banner').innerHTML=`VICTORY FOR ${winner.name}`;
    }
  },

  initializeReset: () => {
    document.getElementById('reset').addEventListener("click", controller.resetBoard)
  },

  initializeForm: () => {
    document.getElementById('nameSubmit').addEventListener("click", controller.nameSubmit);
  }
};

var controller = {
  createMoveListener: (xyTuple) => {
    //takes the tuple [x, y] from view when the listener is added and returns a function
    return (() => {
      if(model.state.winner) {
        console.log('The game has ended! Please press reset to continue.');
        return;
      }
      //which calls the updateBoard function with a move Object
      model.updateBoard({
        move: xyTuple,
        token: model.state.currentPlayer.piece
      });
      //and logs the move to the console
      console.log(`${model.state.currentPlayer.name || model.state.currentPlayer.piece} places at [${xyTuple[0]}, ${xyTuple[1]}].`)
      model.swapTurns();
      if(model.state.winner) {
        console.log(`${model.state.winner.name || model.state.winner.piece} wins the round!`);
        console.log(`CURRENT SCORES\n${model.state.playerX.name || 'X'}: ${model.state.playerX.score}\n${model.state.playerO.name || 'O'}: ${model.state.playerO.score}`);
      }
    });
  },

  resetBoard: () => {
    console.log('Clearing the board for a new round!')
    model.reinitialize(model.state.winner);
  },

  nameSubmit: (event) => {
    event.preventDefault();
    model.state.playerX.name = document.getElementById("xname").value;
    model.state.playerO.name = document.getElementById("oname").value;
  }
};