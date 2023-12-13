document.addEventListener("DOMContentLoaded", function () {

    const tamanhoTabuleiroEscolhido = document.getElementById("tamanho-tabuleiro");
    const modoEscolhido = document.getElementById("modo");
    const desenhoTabuleiro = document.getElementById("tabuleiro");
    const mensagem = document.getElementById("mensagem");

    let tamanhoTabuleiro = parseInt(tamanhoTabuleiroEscolhido.value);
    let jogadorAtual = "X";
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
                celula.dataset.lin = i;
                celula.dataset.col = j;
                celula.textContent = tabuleiro[i][j];
                celula.addEventListener("click", clickNaCelula);
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
    function clickNaCelula(event) {
        const lin = parseInt(event.target.dataset.lin);
        const col = parseInt(event.target.dataset.col);

        if (tabuleiro[lin][col] === "") {
            tabuleiro[lin][col] = jogadorAtual;
            desenharTabuleiro();
            if (ehVitoria()) { 
                finalizaVitoria();
            } else if (ehEmpate()) {
                finalizaEmpate();
            } else {
                jogadorAtual = jogadorAtual === "X" ? "O" : "X";
                mudarJogador();
                if (modoEscolhido.value === "maquina" && jogadorAtual === "O") {
                    moveMaquina();
                }
            }
        }
    }

    function moveMaquina() {
        const celulasVazias = [];
        tabuleiro.forEach((lin, i) => {
            lin.forEach((celula, j) => {
                if (celula === "") {
                    celulasVazias.push({ lin: i, col: j });
                }
            });
        });

        const movimentoMaquina = celulasVazias[Math.floor(Math.random() * celulasVazias.length)];
        tabuleiro[movimentoMaquina.lin][movimentoMaquina.col] = jogadorAtual;
        desenharTabuleiro();

        if (ehVitoria()) {
            finalizaVitoria();
        } else if (ehEmpate()) {
            finalizaEmpate();
        } else {
            jogadorAtual = jogadorAtual === "X" ? "O" : "X";
            mudarJogador();
        }
    }

    function ehVitoria() {
        // Verfica as linhas
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            for (let j = 0; j < tamanhoTabuleiro; j++) {
                if (tabuleiro[i][j] !== jogadorAtual) {
                    break;
                }
                if (j === tamanhoTabuleiro - 1) {
                    return true;
                }
            }
        }
        // Verifica as colunas
        for (let j = 0; j < tamanhoTabuleiro; j++) {
            for (let i = 0; i < tamanhoTabuleiro; i++) {
                if (tabuleiro[i][j] !== jogadorAtual) {
                    break;
                }
                if (i === tamanhoTabuleiro - 1) {
                    return true;
                }
            }
        }
        // Verifica a diagonal principal
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            if (tabuleiro[i][i] !== jogadorAtual) {
                break;
            }
            if (i === tamanhoTabuleiro - 1) {
                return true;
            }
        }
        // Verifica a diagonal secundária
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            if (tabuleiro[i][tamanhoTabuleiro - i - 1] !== jogadorAtual) {
                break;
            }
            if (i === tamanhoTabuleiro - 1) {
                return true;
            }
        }
    }
    

    function ehEmpate() {
        for (let i = 0; i < tamanhoTabuleiro; i++) {
            for (let j = 0; j < tamanhoTabuleiro; j++) {
                if (tabuleiro[i][j] === "") {
                    return false; // Ainda há células vazias, o jogo não está empatado
                }
            }
        }
        return true; // Todas as células estão preenchidas, o jogo está empatado
    }

    function finalizaVitoria() {
        desenhoTabuleiro.querySelectorAll(".celula").forEach(celula => {
            celula.removeEventListener("click", clickNaCelula); // Remove o EventListener para que o jogador não possa mais clicar nas células
            celula.style.cursor = "default"; // Muda o cursor para o padrão para indicar que o jogador não pode mais clicar nas células
        });
        // Exibe a mensagem de vitória
        mensagem.textContent = `O VENCEDOR É '${jogadorAtual}'!`;
    }

    function finalizaEmpate() {
        desenhoTabuleiro.querySelectorAll(".celula").forEach(celula => {
            celula.removeEventListener("click", clickNaCelula);
            celula.style.cursor = "default";
        });
        mensagem.textContent = "DEU VELHA!";    
    };


    function mudarJogador() {
        mensagem.textContent = `Jogador Atual: ${jogadorAtual}`;
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
