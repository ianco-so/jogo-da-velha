document.addEventListener("DOMContentLoaded", function () {

    const selectedBoardSize = document.getElementById("board-size");
    const seletectedMode = document.getElementById("mode");
    const boardContainer = document.getElementById("board");
    const status = document.getElementById("status");

    let boardSize = parseInt(selectedBoardSize.value);
    let currentPlayer = "X"; // "X" always goes first
    let board = [];

    function initializeBoard() {
        // board = new Array(boardSize).fill("").map(() => Array(boardSize).fill("")); // Alternativa
        // Array.from({ length: boardSize }, () => Array(boardSize).fill("")); // Alternativa
        // board = [...Array(boardSize)].map(() => Array(boardSize).fill("")); // Alternativa
        // alternative with for loops
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = "";
            }
        }
        renderBoard();
    }
    
    function renderBoard() {
        boardContainer.innerHTML = "";

        // Dynamically adjust grid-template-columns
        boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.textContent = board[i][j];
                cell.addEventListener("click", handleCellClick);
                boardContainer.appendChild(cell);
            }
        }
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col] === "") {
            board[row][col] = currentPlayer;
            renderBoard();
            if (checkWin()) {
                endGameWin();
            } else if (checkDraw()) {
                endGameDraw();
            } 
            else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                mudaJogador();
                if (seletectedMode.value === "computer" && currentPlayer === "O") {
                    computerMove();
                }
            }
        }
    }

    function computerMove() {
        const emptyCells = [];
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === "") {
                    emptyCells.push({ row: i, col: j });
                }
            });
        });

        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomMove.row][randomMove.col] = currentPlayer;
        renderBoard();

        if (checkWin()) {
            endGameWin();
        } else if (checkDraw()) {
            endGameDraw();
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            mudaJogador();
        }
    }

    function checkWin() {
        // Check rows
        for (let i = 0; i < boardSize; i++) {
            if (board[i].every(cell => cell === currentPlayer)) {
                return true;
            }
        }
        // Check columns
        for (let j = 0; j < boardSize; j++) {
            if (board.every(row => row[j] === currentPlayer)) {
                return true;
            }
        }
        // Check diagonals
        if (board.every((row, index) => row[index] === currentPlayer) ||
            board.every((row, index) => row[boardSize - index - 1] === currentPlayer)) {
            return true;
        }
        return false;
    }
    

    function checkDraw() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === "") {
                    return false; // Ainda há células vazias, o jogo não está empatado
                }
            }
        }
        return true; // Todas as células estão preenchidas, o jogo está empatado
    }

    function endGameWin() {
        renderBoard(); // Re-render the board to reflect the winning move

        // Disable further clicks on the board
        boardContainer.querySelectorAll(".cell").forEach(cell => {
            cell.removeEventListener("click", handleCellClick);
            cell.style.cursor = "default";
        });

        // Display the winner
        status.textContent = `O VENCEDOR É '${currentPlayer}'!`;
    }

    function endGameDraw() {
        renderBoard(); // Re-renderize o tabuleiro para refletir o último movimento

        // Desative os cliques adicionais no tabuleiro
        boardContainer.querySelectorAll(".cell").forEach(cell => {
            cell.removeEventListener("click", handleCellClick);
            cell.style.cursor = "default";
        });

        // Exiba a mensagem de empate em vermelho
        status.textContent = "DEU VELHA!";    
    };


    function mudaJogador() {
        status.textContent = `Jogador Atual: ${currentPlayer}`;
    };

    // Event listeners
    // Caso o tamanho do tabuleiro seja alterado, muda a variável boardSize e reinicie o tabuleiro
    selectedBoardSize.addEventListener("change", function () {
        boardSize = parseInt(selectedBoardSize.value);
        initializeBoard();
    });

    // Caso o modo seja alterado, reinicie o tabuleiro
    seletectedMode.addEventListener("change", initializeBoard);

    // Inicia o tabuleiro
    initializeBoard();
});
