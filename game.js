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

    const getNumberOfAvailableSpaces = () => {
        return _board.filter(element => element === "").length
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

    return { putSymbolToBoard, getBoard, checkIfSpaceEmpty, checkWinCondition, getNumberOfAvailableSpaces }
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

    const displayPlayerInfo = (index, player) => {
        const playerInfoContainer = document.querySelectorAll(`.player-info-${index}`)
        console.log(playerInfoContainer[0].children)
        playerInfoContainer[0].children[0].innerText = `Player name: ${player.name}`
        playerInfoContainer[0].children[1].innerText = `Symbol: ${player.symbol}`
        playerInfoContainer[0].children[2].innerText = `Current score: ${player.getScore()}`
    }

    const displayCurrentUser = (player) => {
        document.querySelector('.current-turn').innerText = `It's ${player.name}'s turn`
    }

    return { renderBoard, displayPlayerInfo, displayCurrentUser }
})();

const game = (() => {

    const player = playerFactory('jeff', 'X')
    const computer = playerFactory('CPU', 'O')

    let currentUser = player
    displayController.displayCurrentUser(currentUser)

    displayController.displayPlayerInfo(1, player)
    displayController.displayPlayerInfo(2, computer)


    const enableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.addEventListener('click', playTurn)
        })
    }
    const disableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.removeEventListener('click', playTurn)
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
                displayController.displayPlayerInfo(1, player)
                displayController.displayPlayerInfo(2, computer)
            } else if (gameBoard.getNumberOfAvailableSpaces() === 0) {
                alert('its a tie!')
                disableBoard()
            }
            else {
                changeCurrentPlayer()
            }
        }
    }
    const changeCurrentPlayer = () => {
        currentUser === player ? currentUser = computer : currentUser = player
        displayController.displayCurrentUser(currentUser)
    }

    return { enableBoard }

    //restart
})()

game.enableBoard()