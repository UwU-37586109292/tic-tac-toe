

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

    return { putSymbolToBoard, getBoard }
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

    const player = playerFactory('jeff', 'X')
    const computer = playerFactory('CPU', 'O')

    let currentUser = player


    const setupBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.addEventListener('click', game.playTurn)
        })
    }

    const playTurn = (event) => {
        gameBoard.putSymbolToBoard(currentUser.symbol, event.target.id)
        displayController.renderBoard()
        changeCurrentPlayer()
    }

    const changeCurrentPlayer = () => {
        return currentUser === player ? currentUser = computer : currentUser = player
    }
    return { playTurn, setupBoard }
    //start
    //restart
    //keep score
})()

game.setupBoard()