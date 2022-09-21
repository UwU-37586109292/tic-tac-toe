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

    const getRandomFreeSpot = () => {
        let randomIndex = 0
        do {
            randomIndex = Math.floor(Math.random() * 8)
        } while (!checkIfSpaceEmpty(randomIndex));
        return randomIndex
    }

    const clearBoard = () => {
        _board = Array(9).fill("")
    }

    return { getRandomFreeSpot, clearBoard, putSymbolToBoard, getBoard, checkIfSpaceEmpty, checkWinCondition, getNumberOfAvailableSpaces }
})();


const playerFactory = (name, symbol, useAI) => {
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
    const getName = () => {
        return name
    }
    const setName = (name) => {
        this.name = name
    }
    const isComputer = () => {
        return useAI
    }
    const getSymbol = () => { return symbol }
    return { isComputer, getName, getSymbol, addWin, resetScore, getScore, setName }
}

const displayController = (() => {

    const showAskNameModal = (numberOfPlayers) => {
        const form = document.getElementById('name-modal')
        form.style.display = 'block'
        const nameForm = document.getElementById('name-form')
        const defaultNameBtn = document.getElementById('default-name')
        nameForm.addEventListener('submit', game.handlePlayerNameSubmit)
        defaultNameBtn.addEventListener('click', game.handlePlayerNameSubmit)

        if (numberOfPlayers > 1) {
            document.getElementById('player-2-input').style.display = 'block'
            defaultNameBtn.style.display = 'none'
        } else {
            document.getElementById('player-2-input').style.display = 'none'
            defaultNameBtn.style.display = 'block'
        }
    }

    const closeAskNameModal = () => {
        const formContainer = document.getElementsByClassName('ask-name')[0]
        formContainer.style.display = 'none'
    }

    const closeChoosePlayerModal = () => {
        document.getElementsByClassName('game-mode')[0].style.display = 'none'
    }

    const renderBoard = () => {
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            document.querySelector(`div[id='${i}']`).innerText = gameBoard.getBoard()[i];
        }
    }

    const displayPlayerInfo = (players) => {
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const playerInfoContainer = document.querySelector(`.player-info-${i + 1}`)
            playerInfoContainer.children[0].innerText = `Player name: ${player.getName()}`
            playerInfoContainer.children[1].innerText = `Symbol: ${player.getSymbol()}`
            playerInfoContainer.children[2].innerText = `Current score: ${player.getScore()}`
        }
    }

    const displayCurrentUser = (player) => {
        document.querySelector('.current-turn').innerText = `It's ${player.getName()}'s turn`
    }

    return { renderBoard, displayPlayerInfo, displayCurrentUser, showAskNameModal, closeAskNameModal, closeChoosePlayerModal }
})();

const game = (() => {
    let currentUser
    let players

    const initialize = () => {
        document.getElementById('single-player').addEventListener('click', function (e) {
            displayController.closeChoosePlayerModal()
            displayController.showAskNameModal()
        })
        document.getElementById('versus').addEventListener('click', function (e) {
            displayController.closeChoosePlayerModal()
            displayController.showAskNameModal(2)
        })
        document.getElementsByClassName('reset')[0].addEventListener('click', function (e) {
            gameBoard.clearBoard()
            players.forEach(player => {
                player.resetScore()
            })
            displayController.renderBoard()
            displayController.displayPlayerInfo(players)
        })
    }

    const setup = (player1, player2) => {
        enableBoard()
        const firstPlayer = player1
        const secondPlayer = player2 ? player2 : playerFactory('CPU', 'X', true)
        currentUser = firstPlayer
        players = [firstPlayer, secondPlayer]

        displayController.displayCurrentUser(currentUser)
        displayController.displayPlayerInfo(players)
    }

    const playNextRound = () => {
        gameBoard.clearBoard()
        displayController.renderBoard()
        enableBoard()
        currentUser = players[0]
        displayController.displayCurrentUser(currentUser)
        displayController.displayPlayerInfo(players)
    }

    const handlePlayerNameSubmit = () => {
        event.preventDefault()
        const name = new FormData(document.getElementById('name-form')).get('name-1')
        const player2Name = new FormData(document.getElementById('name-form')).get('name-2')
        displayController.closeAskNameModal()
        const player1Name = name ? name : 'Jeff'
        if (player2Name) {
            setup(playerFactory(player1Name, 'O'), playerFactory(player2Name, 'X'))
        } else {
            setup(playerFactory(player1Name, 'O'))
        }
    }

    const enableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.addEventListener('click', makeMove)
        })
    }

    const disableBoard = () => {
        document.querySelectorAll('.board-field').forEach(element => {
            element.removeEventListener('click', makeMove)
        })
    }

    const makeMove = (event) => {
        const boardId = event.target.id
        playTurn(boardId)
    }

    const playTurn = (boardId) => {
        if (gameBoard.checkIfSpaceEmpty(boardId)) {
            gameBoard.putSymbolToBoard(currentUser.getSymbol(), boardId)
            displayController.renderBoard()
            if (gameBoard.checkWinCondition()) {
                currentUser.addWin()
                disableBoard()
                displayController.displayPlayerInfo(players)
                alert(`${currentUser.getName()} won!`)
                if (currentUser.getScore() === 3) {
                    alert(`${currentUser.getName()} won 3 rounds! Well done <3`)
                } else { playNextRound() }
            } else if (gameBoard.getNumberOfAvailableSpaces() === 0) {
                alert('its a tie!')
                disableBoard()
                playNextRound()
            }
            else {
                changeCurrentPlayer()
                if (currentUser.isComputer()) {
                    //make it seem that CPU 'thinks'
                    setTimeout(() => { playTurn(gameBoard.getRandomFreeSpot()) }, 500)
                }
            }
        }
    }
    const changeCurrentPlayer = () => {
        currentUser === players[0] ? currentUser = players[1] : currentUser = players[0]
        displayController.displayCurrentUser(currentUser)
    }

    return { initialize, handlePlayerNameSubmit }
})()

game.initialize()