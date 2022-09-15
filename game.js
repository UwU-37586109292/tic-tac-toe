//displayController module
//player factory
const gameBoard = (() => {
    let _board = new Array(9);

    const putSymbolToBoard = (symbol, boardIndex) => {
        if (checkIfSpaceEmpty(boardIndex)) {
            _board[boardIndex] = symbol;
        }
    }

    const checkIfSpaceEmpty = (boardIndex) => {
        return _board[boardIndex] === undefined
    }

    const getBoard = () => {
        return _board
    }

    return { putSymbolToBoard, showBoard }
})();

const displayController = (() => {

})();


const playerFactory = (name, symbol) => {
    return { name, symbol }
}

const player = playerFactory('jeff', 'X')
const computer = playerFactory('CPU', 'O')