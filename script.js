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
    let moveHistory = [];
    let vsComputer = false;

    const createGameBoard = () => {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('id', `cell-${i}`);
            cell.addEventListener('click', () => handleCellClick(i));
            board.appendChild(cell);
        }
    };

    const updatePlayerTurn = () => {
        const turnDisplay = document.getElementById('player-turn');
        if (turnDisplay) {
            turnDisplay.textContent = `${currentPlayer.getName()}'s turn`;
        }
    };

    const handleCellClick = (index) => {
        if (!gameActive || gameState[index] !== '') return;
        
        gameState[index] = currentPlayer.getSymbol();
        moveHistory.push({index, player: currentPlayer});
        updateCell(index);
        
        if (checkWin()) {
            alert(`${currentPlayer.getName()} wins!`);
            gameActive = false;
        } else if (gameState.every(cell => cell !== '')) {
            alert("It's a draw!");
            gameActive = false;
        } else {
            switchPlayer();
            updatePlayerTurn();
            if (vsComputer && currentPlayer === player2) {
                computerMove();
            }
        }
    };

    const updateCell = (index) => {
        const cell = document.getElementById(`cell-${index}`);
        if (cell) {
            cell.textContent = gameState[index];
        // } else {
        //     console.error(`Cell with id cell-${index} not found`);
        }
    };

    const checkWin = () => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer.getSymbol();
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

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const startGame = () => {
        const player1Name = document.getElementById('player1-name').value;
        let player1Symbol = document.getElementById('player1-symbol').value.charAt(0);
    
        if (!player1Name) {
            alert("Please enter a name for Player 1.");
            return;
        }
    
        if (!player1Symbol) player1Symbol = 'X';
    
        player1 = PlayerFactory(player1Name, player1Symbol);
    
        if (vsComputer) {
            player2 = PlayerFactory("Computer", player1Symbol === 'X' ? 'O' : 'X');
        } else {
            const player2Name = document.getElementById('player2-name').value;
            let player2Symbol = document.getElementById('player2-symbol').value.charAt(0);
    
            if (!player2Name) {
                alert("Please enter a name for Player 2.");
                return;
            }
    
            if (!player2Symbol) player2Symbol = player1Symbol === 'X' ? 'O' : 'X';
    
            if (player1Symbol === player2Symbol) {
                alert("Players must have different symbols.");
                return;
            }
    
            player2 = PlayerFactory(player2Name, player2Symbol);
        }
    
        gameActive = true;
        currentPlayer = player1;
        gameState = ['', '', '', '', '', '', '', '', ''];
        moveHistory = [];
        createGameBoard();
        updatePlayerTurn();
        console.log('Game started');
    };



    const cancelGame = () => {
        gameActive = false;
        gameState = ['', '', '', '', '', '', '', '', ''];
        createGameBoard();
    };

    const undoMove = () => {
        if (!gameActive || moveHistory.length === 0) return;
        
        const lastMove = moveHistory.pop();
        gameState[lastMove.index] = '';
        updateCell(lastMove.index);
        currentPlayer = lastMove.player === player1 ? player2 : player1;
        
        if (vsComputer && moveHistory.length > 0) {
            const computerMove = moveHistory.pop();
            gameState[computerMove.index] = '';
            updateCell(computerMove.index);
        }
        gameActive = true;
    };
    const init = () => {
        createGameBoard();
        vsComputer = true;
        const board = document.getElementById('game-board');
        // if (board) {
        // console.log('Game board found in DOM');
        // } else {
        // console.error('Game board not found in DOM');
        // }
        document.getElementById('start-game').addEventListener('click', startGame);
        document.getElementById('cancel-game').addEventListener('click', cancelGame);
        document.getElementById('undo-move').addEventListener('click', undoMove);

        document.querySelector('input[name="opponent"][value="computer"]').checked = true;
        document.getElementById('player2-name').disabled = true;
        document.getElementById('player2-symbol').disabled = true;

        document.querySelectorAll('input[name="opponent"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                vsComputer = e.target.value === 'computer';
                document.getElementById('player2-name').disabled = vsComputer;
                document.getElementById('player2-symbol').disabled = vsComputer;
            });
        });
    };

        return { 
            init,
            startGame,
            undoMove 
        };
})();

document.addEventListener('DOMContentLoaded', () => {
    TicTacToe.init();
});