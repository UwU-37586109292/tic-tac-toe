

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
    //clear board

    return { putSymbolToBoard, getBoard, checkIfSpaceEmpty }
})();


const playerFactory = (name, symbol) => {
    let _score = 0;
    const addWin = () => {
        _score++
    }
    const resetScore = () => {
        _score = 0
    }
    return { name, symbol, addWin, resetScore }
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


    const setupBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.addEventListener('click', playTurn)
        })
    }

    const playTurn = (event) => {
        if (gameBoard.checkIfSpaceEmpty(event.target.id)) {
            gameBoard.putSymbolToBoard(currentUser.symbol, event.target.id)
            displayController.renderBoard()
            changeCurrentPlayer()
        }
    }

    const changeCurrentPlayer = () => {
        return currentUser === player ? currentUser = computer : currentUser = player
    }

    const play = () => {
        setupBoard()
    }
    return { play }
    //start
    //restart
    //keep score
})()

game.play()