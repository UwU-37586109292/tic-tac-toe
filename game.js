const gameBoard = (() => {
    let _board = Array(9).fill("");

    const putSymbolToBoard = (symbol, boardIndex) => {
        if (checkIfSpaceEmpty(boardIndex)) {
            _board[boardIndex] = symbol;
        }
    }

    const checkIfSpaceEmpty = (boardIndex) => {
        return _board[boardIndex] === ""
    }

    const getBoard = () => {
        return _board
    }

    const checkWinCondition = () => {
        let winner = checkHorizontalLinesForWinner() || checkVerticalLinesForWinner() || checkDiagonalLinesForWinner()
        if (winner)
            return winner
    }
    const checkHorizontalLinesForWinner = () => {
        for (let i = 0; i < 9; i = i + 3) {
            if (_board[i] !== "" && _board[i] === _board[i + 1] && _board[i] === _board[i + 2]) {
                return _board[i]
            }
        }
    }
    const checkVerticalLinesForWinner = () => {
        for (let i = 0; i < 9; i++) {
            if (_board[i] !== "" && _board[i] === _board[i + 3] && _board[i] === _board[i + 6]) {
                return _board[i]
            }
        }
    }
    const checkDiagonalLinesForWinner = () => {
        if (_board[0] !== "" && _board[0] === _board[4] && _board[0] === _board[8]) {
            return _board[0]
        } else if (_board[2] !== "" && _board[2] === _board[4] && _board[2] === _board[6]) {
            return _board[2]
        }
    }

    return { putSymbolToBoard, getBoard, checkIfSpaceEmpty, checkWinCondition }
})();


const playerFactory = (name, symbol) => {
    let _score = 0;
    const addWin = () => {
        _score++
    }
    const resetScore = () => {
        _score = 0
    }
    const getScore = () => {
        return _score
    }
    return { name, symbol, addWin, resetScore, getScore }
}

const displayController = (() => {

    const renderBoard = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            document.querySelector(`div[id='${i}']`).innerText = gameBoard.getBoard()[i];
        }
    }
    return { renderBoard }
})();

const game = (() => {

    const player = playerFactory('Milo', 'X')
    const computer = playerFactory('Mgielka', 'O')

    let currentUser = player


    const enableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.addEventListener('click', playTurn)
        })
    }
    const disableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.removeEventListener('click', game.playTurn)
        })
    }

    const playTurn = (event) => {
        if (gameBoard.checkIfSpaceEmpty(event.target.id)) {
            gameBoard.putSymbolToBoard(currentUser.symbol, event.target.id)
            displayController.renderBoard()
            if (gameBoard.checkWinCondition()) {
                alert(currentUser.name + ' wins!')
                currentUser.addWin()
                disableBoard()
            } else {
                changeCurrentPlayer()
            }
        }
    }

    const changeCurrentPlayer = () => {
        return currentUser === player ? currentUser = computer : currentUser = player
    }
    return { playTurn, enableBoard }
    //start
    //restart
    //keep score
})()

game.enableBoard()
