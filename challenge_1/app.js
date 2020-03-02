//initial model conditions on page load stored in global scope - hacking is encouraged (for now)

var state = {
  currentPlayer: 'X',
  boardSolved: false,
  winner: null
};
var currentBoard = [];


//Model functions

//initialize board
  //set up 3x3 array
  //attach event listeners to squares
  //set up state variables
    //whose turn (start with X)
    //board solved (start with 'false')
    //winner

//draw a new board when a move is received
  //slice current 3x3 board
  //take move sent from controller's event listener
  //create a new board
  //send that board to View's render functions

//check if board has been solved
  //diagonal helper functions
  //row helper functions
  //column helper functions
  /* premature optimization - check for games where victory is impossible */


//View functions
  //update DOM after each move
    /* premature optimization - include an undo button if the user presses the last square that was placed */
    //remove event listener for adding a piece from square
    //rerender board (do not reload page) that is passed in from model

  //render a banner with the victor
    //take winner state
    //append a bold banner '{state.winner} is the Victor'

//Controller functions
  //update board when a piece is placed
    //attach event listener to empty squares
      //check state for whose turn it is
      //send the selected coordinate and current piece to the board