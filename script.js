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

    function playGame() {
        // get move from player
        [selectedRow, selectedCol] = setPlayerMove();
        let selectedCell = board[selectedRow][selectedCol];

        // check if the target cell is available (is there a marker already on it?)
        // if cell not available, re-prompt for another input
        if (selectedCell.getValue() !== null) {
            alert(`That slot has been filled,`, activePlayer.getName(), `please pick another one!`);
            [selectedRow, selectedCol] = setPlayerMove();
            selectedCell = board[selectedRow][selectedCol];
        }   

        // Drop the player's marker on the cell
        selectedCell.addMarker(activePlayer.getMarker());

        // check for win condition via checkWinCondition
        if (gameOver()) {
            console.log("Game Over!");
            return;
        }

        // if not won yet, switch player turn
        switchTurn();

        playGame();   
    }

    function setPlayerMove() {
        const selectedRow = Number(prompt(activePlayer.getName() + ", it's your turn! Pick your row #"));
        const selectedCol = Number(prompt("Pick your column #"));
        return [selectedRow, selectedCol];
    }

    function switchTurn() {
        activePlayer = (activePlayer === null || activePlayer === playerTwo) ? playerOne : playerTwo;
        return activePlayer;
    }
    
    function gameOver() {
        // three in a row
        let gameWon = checkWinCombination();
        if (gameWon) {
            announceWinner();
            return true;
        }
        
        // check if out of moves
        var outOfMoves = checkAvailableMove(); 
        if (outOfMoves) {
            announceOutOfMove();
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
            // console.log("Combination: ", combination);
            for (let j = 0; j < combination.length; j++) {
                let cellVal = combination[j].getValue();
                console.log("cell value: ", cellVal);
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

    function announceWinner() {
        alert("Congratulations " + activePlayer.getName() + ", you just owned!");
    }

    return { playGame };
}

// displayController (IIFE)
game = gameController();
game.playGame();