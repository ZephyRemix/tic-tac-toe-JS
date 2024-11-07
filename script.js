// ** BOARD
const gameBoard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    return { getBoard };
})();


// ** CELL
function Cell() {
    let value = null;

    const addMarker = (marker) => value = marker;

    const getValue = () => value;

    return { addMarker, getValue };
}


function Player(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
}


// ** DISPLAY CONTROLLER
const displayController = (function() {
    const game = gameController();
    const board = gameBoard.getBoard();
    
    const turnDisplay = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const initDisplayMessage = (function() {
        displayTurn(game.getActivePlayer().getName());
    })();
    
    const initBoard = (function() {
        for (let i = 0; i < board.length; i++) {
            rowDiv = drawRow(i);
            for (let j = 0; j < board[i].length; j++) {
                drawCell(rowDiv, j);
            }
        }
    })();

    function drawRow(rowIndex) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.id = "r" + rowIndex;
        boardDiv.appendChild(rowDiv);
        return rowDiv;
    }

    function drawCell(rowDiv, col) {
        const cellEle = document.createElement("div");
        cellEle.classList.add("cell", "onclick=getPlayerMove()");
        cellEle.dataset.col = col;
        rowDiv.appendChild(cellEle);
    }

    function clickHandlerBoard(e) {
        rowInt = e.target.parentElement.id.slice(-1);
        colInt = e.target.dataset.col;

        game.playGame(rowInt, colInt);
    } 

    function displayTurn(playerName) {
        turnDisplay.textContent = playerName + "'s turn to move!";
    }

    function drawMarker(row, col, marker) {
        targetRow = document.querySelector("#r" + row);
        targetCell = targetRow.children[col];
        targetCell.textContent = marker;
    }

    function announceWinner() {
        turnDisplay.textContent = "Congratulations " + game.getActivePlayer().getName() + ", you just owned!";
    }

    function announceOutOfMove() {
        turnDisplay.textContent = "Out of moves! Game is tied.";
    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    return { displayTurn, drawMarker, announceWinner, announceOutOfMove };
})();


// ** CONTROLLER
function gameController() {
    const playerOne = Player("PlayerOne", "X");
    const playerTwo = Player("PlayerTwo", "O");
    const board = gameBoard.getBoard();
    const winCombination = {
        r0: [board[0][0], board[0][1], board[0][2]],
        r1: [board[1][0], board[1][1], board[1][2]],
        r2: [board[2][0], board[2][1], board[2][2]],
        c0: [board[0][0], board[1][0], board[2][0]],
        c1: [board[0][1], board[1][1], board[2][1]],
        c2: [board[0][2], board[1][2], board[2][2]],
        d0: [board[2][0], board[1][1], board[0][2]],
        d1: [board[0][0], board[1][1], board[2][2]]
    };

    let activePlayer = playerOne;
    let selectedRow;
    let selectedCol;

    const getActivePlayer = () => activePlayer;

    function playGame(row, col) {
        // get move from player
        selectedRow = Number(row);
        selectedCol = Number(col);
        let selectedCell = board[selectedRow][selectedCol];

        // check if the target cell is available (is there a marker already on it?)
        // if cell not available, re-prompt for another input
        if (selectedCell.getValue() !== null) {
            alert(`This cell is taken, ` + activePlayer.getName() + `, please pick another one!`);
            return;
        }   

        dropMarker(selectedCell);
        
        if (gameOver()) {
            return;
        }

        // if not won yet, switch player turn
        switchTurn(); 
    }

    function dropMarker(targetCell) {
        marker = activePlayer.getMarker();
        targetCell.addMarker(marker);
        displayController.drawMarker(selectedRow, selectedCol, marker);
    }

    function switchTurn() {
        activePlayer = (activePlayer === null || activePlayer === playerTwo) ? playerOne : playerTwo;
        displayController.displayTurn(activePlayer.getName());
        return activePlayer;
    }
    
    function gameOver() {
        // three in a row
        let gameWon = checkWinCombination();
        if (gameWon) {
            displayController.announceWinner();
            return true;
        }
        
        // check if out of moves
        var outOfMoves = checkAvailableMove(); 
        if (outOfMoves) {
            displayController.announceOutOfMove();
            return true;
        }

        return false;
    }

    // based on latest move, check the possible win combinations are met
    function checkWinCombination() {
        let streak = false;
        
        switch(true) {
            case selectedRow === 0 && selectedCol === 0:
                streak = checkWinningStreak([winCombination.r0, winCombination.c0, winCombination.d1]);
                break;
            case selectedRow === 0 && selectedCol === 1:
                streak = checkWinningStreak([winCombination.r0, winCombination.c1]);
                break;
            case selectedRow === 0 && selectedCol === 2:
                streak = checkWinningStreak([winCombination.r0, winCombination.c2, winCombination.d0]);
                break;
            case selectedRow === 1 && selectedCol === 0:
                streak = checkWinningStreak([winCombination.r0, winCombination.c0]);
                break;
            case selectedRow === 1 && selectedCol === 1:
                streak = checkWinningStreak([winCombination.r1,winCombination.c1,winCombination.d0, winCombination.d1]);
                break;
            case selectedRow === 1 && selectedCol === 2:
                streak = checkWinningStreak([winCombination.r1, winCombination.c2]);
                break;
            case selectedRow === 2 && selectedCol === 0:
                streak = checkWinningStreak([winCombination.r2, winCombination.c0, winCombination.d0]);
                break;
            case selectedRow === 2 && selectedCol === 1:
                streak = checkWinningStreak([winCombination.r2, winCombination.c1]);
                break;
            case selectedRow === 2 && selectedCol === 2:
                streak = checkWinningStreak([winCombination.r2, winCombination.c2, winCombination.d1]);
                break;
        }

        return streak;
    }

    function checkWinningStreak(winningCombinationArr) {
        playerMarker = activePlayer.getMarker();

        for (let i = 0; i < winningCombinationArr.length; i++) {
            let combination = winningCombinationArr[i]; 

            for (let j = 0; j < combination.length; j++) {
                let cellVal = combination[j].getValue();
                // if cell's value is not equal to the current player's marker, means no streak! 
                if (cellVal !==  playerMarker) {
                    break;
                } else if (j === combination.length - 1 && cellVal === playerMarker) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // returns true if out of moves
    function checkAvailableMove() {
        for (let i = 0; i < board.length; i++) {
            let boardRow = board[i];
            for (let j = 0; j < boardRow.length; j++) {
                if (boardRow[j].getValue() == null) {
                    return false;
                } 
            }
        }
        return true;
    }

    return { playGame, getActivePlayer };
}
