document.addEventListener("DOMContentLoaded", function () {

    const tamanhoTabuleiroEscolhido = document.getElementById("tamanho-tabuleiro");
    const modoEscolhido = document.getElementById("modo");
    const desenhoTabuleiro = document.getElementById("tabuleiro");
    const mensagem = document.getElementById("mensagem");

    let tamanhoTabuleiro = parseInt(tamanhoTabuleiroEscolhido.value);
    let currentPlayer = "X"; // sempre começa com "X"
    let tabuleiro = [];

    function iniciarTabuleiro() {
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            tabuleiro[i] = [];
            for (let j = 0; j < tamanhoTabuleiro; j++) {
                tabuleiro[i][j] = "";
            }
        }
        desenharTabuleiro();
    }
    
    function desenharTabuleiro() {
        // Zera o tabuleiro já desenhado
        desenhoTabuleiro.innerHTML = "";
        // Muda dinamicamente o grid-template-columns
        desenhoTabuleiro.style.gridTemplateColumns = `repeat(${tamanhoTabuleiro}, 50px)`;

        for (let i = 0; i < tamanhoTabuleiro; i++) {
            for (let j = 0; j < tamanhoTabuleiro; j++) {
                // Cria uma celula e adiciona ao tabuleiro
                const celula = document.createElement("div");
                celula.classList.add("celula");
                celula.dataset.row = i;
                celula.dataset.col = j;
                celula.textContent = tabuleiro[i][j];
                celula.addEventListener("click", handleCellClick);
                desenhoTabuleiro.appendChild(celula);
            }
        }
    }

    /**
     *  Ao clicar em uma celula do tabuleiro,
     * verifica se a celula está vazia e se estiver, 
     * preenche com o simbolo do jogador atual.
     *
     *  Verifica se o jogo terminou com vitória ou empate
     * e encerra o jogo em qualquer um dos casos.
     * 
     *  Caso o jogo não tenha terminado muda o jogador e
     * exibe a mensagem no campo de mensagens. E se o modo
     * de jogo selecionado for "Maquina". e for a vez da maquina,
     * então faz o movimento do computador.
     * @param {} event
     */
    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (tabuleiro[row][col] === "") {
            tabuleiro[row][col] = currentPlayer;
            desenharTabuleiro();
            if (checkWin()) { 
                endGameWin();
            } else if (checkDraw()) {
                endGameDraw();
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                mudarJogador();
                if (modoEscolhido.value === "computer" && currentPlayer === "O") {
                    computerMove();
                }
            }
        }
    }

    function computerMove() {
        const emptyCells = [];
        tabuleiro.forEach((row, i) => {
            row.forEach((celula, j) => {
                if (celula === "") {
                    emptyCells.push({ row: i, col: j });
                }
            });
        });

        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        tabuleiro[randomMove.row][randomMove.col] = currentPlayer;
        desenharTabuleiro();

        if (checkWin()) {
            endGameWin();
        } else if (checkDraw()) {
            endGameDraw();
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            mudarJogador();
        }
    }

    function checkWin() {
        // Check rows
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            if (tabuleiro[i].every(celula => celula === currentPlayer)) {
                return true;
            }
        }
        // Check columns
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            if (tabuleiro.every(row => row[j] === currentPlayer)) {
                return true;
            }
        }
        // Check diagonals
        if (tabuleiro.every((row, index) => row[index] === currentPlayer) ||
            tabuleiro.every((row, index) => row[tamanhoTabuleiro - index - 1] === currentPlayer)) {
            return true;
        }
        return false;
    }
    

    function checkDraw() {
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            for (let j = 0; j < tamanhoTabuleiro; j++) {
                if (tabuleiro[i][j] === "") {
                    return false; // Ainda há células vazias, o jogo não está empatado
                }
            }
        }
        return true; // Todas as células estão preenchidas, o jogo está empatado
    }

    function endGameWin() {
        desenharTabuleiro(); // Re-render the board to reflect the winning move

        // Disable further clicks on the board
        desenhoTabuleiro.querySelectorAll(".celula").forEach(celula => {
            celula.removeEventListener("click", handleCellClick);
            celula.style.cursor = "default";
        });

        // Display the winner
        mensagem.textContent = `O VENCEDOR É '${currentPlayer}'!`;
    }

    function endGameDraw() {
        desenharTabuleiro(); // Re-renderize o tabuleiro para refletir o último movimento

        // Desative os cliques adicionais no tabuleiro
        desenhoTabuleiro.querySelectorAll(".celula").forEach(celula => {
            celula.removeEventListener("click", handleCellClick);
            celula.style.cursor = "default";
        });

        // Exiba a mensagem de empate em vermelho
        mensagem.textContent = "DEU VELHA!";    
    };


    function mudarJogador() {
        mensagem.textContent = `Jogador Atual: ${currentPlayer}`;
    };

    // Event listeners
    // Caso o tamanho do tabuleiro seja alterado, muda a variável tamanhoTabuleiro e reinicie o tabuleiro
    tamanhoTabuleiroEscolhido.addEventListener("change", function () {
        tamanhoTabuleiro = parseInt(tamanhoTabuleiroEscolhido.value);
        iniciarTabuleiro();
    });

    // Caso o modo seja alterado, reinicie o tabuleiro
    modoEscolhido.addEventListener("change", iniciarTabuleiro);

    // Inicia o tabuleiro
    iniciarTabuleiro();
});
