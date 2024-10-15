const PlayerFactory = (name, symbol) => {
    let score = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const incrementScore = () => score++;
    const resetScore = () => score = 0;

    return {
        getName,
        getSymbol,
        getScore,
        incrementScore,
        resetScore
    };
};


const TicTacToe = (() => {
    let player1, player2, currentPlayer;
    let gameActive = false;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let vsComputer = false;

    const createGameBoard = () => {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('id', `cell-${i}`);
            // cell.setAttribute('data-index', i);
            cell.addEventListener('click', () => handleCellClick(i));
            board.appendChild(cell);
        }
    };

    const handleCellClick = (index) => {
        if (!gameActive || gameState[index] !== '') return;
        
        // gameState[index] = currentPlayer;
        gameState[index] = currentPlayer.getSymbol();
        updateCell(index);
        
        if (checkWin()) {
            alert(`${currentPlayer} wins!`);
            gameActive = false;
        } else if (gameState.every(cell => cell !== '')) {
            alert("It's a draw!");
            gameActive = false;
        } else {
            switchPlayer();
            if (vsComputer && currentPlayer === player2) {
                setTimeout(computerMove, 500);
            }
        }
    };

    const updateCell = (index) => {
        const cells = document.querySelectorAll('.cell');
        cells[index].textContent = gameState[index];
    };

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    };

    const computerMove = () => {
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            handleCellClick(randomIndex);
        }
    };

    const startGame = () => {
        gameActive = true;
        player1 = PlayerFactory("Player 1", "X");
        player2 = vsComputer ? PlayerFactory("Computer", "O") : PlayerFactory("Player 2", "O");
        currentPlayer = player1;
        gameState = ['', '', '', '', '', '', '', '', ''];
        createGameBoard();
        // vsComputer = document.querySelector('input[name="opponent"]:checked').value === 'computer';
    };

    const cancelGame = () => {
        gameActive = false;
        createGameBoard();
    };

    const undoMove = () => {
        if (!gameActive || gameState.every(cell => cell === '')) return;
        
        const lastMoveIndex = gameState.findLastIndex(cell => cell !== '');
        gameState[lastMoveIndex] = '';
        updateCell(lastMoveIndex);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };
    
    const resetGameState = () => {
        gameActive = false;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        updateBoard();
    };

    const init = () => {
        createGameBoard();
        document.getElementById('start-game').addEventListener('click', startGame);
        document.getElementById('cancel-game').addEventListener('click', cancelGame);
        document.getElementById('undo-move').addEventListener('click', undoMove);
    };
};

    return { init };
})();

TicTacToe.init();