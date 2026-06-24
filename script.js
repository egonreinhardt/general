/****************************************************
 * ESTADO DA APLICAÇÃO
 ****************************************************/

const pontuacoesNumerais = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null
};

const categorias = {

    trinca: {
        nome: "Trinca",
        valor: 20
    },

    doisPares: {
        nome: "Dois Pares",
        valor: 20
    },

    fullHouse: {
        nome: "Full House",
        valor: 25
    },

    par: {
        nome: "Par",
        valor: 20
    },

    impar: {
        nome: "Ímpar",
        valor: 20
    },

    parImpar: {
        nome: "Par/Ímpar",
        valor: 25
    },

    sequenciaMenor: {
        nome: "Sequência Menor",
        valor: 30
    },

    sequenciaMaior: {
        nome: "Sequência Maior",
        valor: 35
    },

    sequenciaReal: {
        nome: "Sequência Real",
        valor: 40
    },

    quadra: {
        nome: "Quadra",
        valor: 40
    },

    chance: {
        nome: "Chance",
        valor: null
    },

    general: {
        nome: "General",
        valor: 50
    }
};

const pontuacoesCategorias = {};

const categoriasAtivas = {

    trinca: true,
    doisPares: false,
    fullHouse: true,
    par: false,
    impar: false,
    parImpar: true,
    sequenciaMenor: true,
    sequenciaMaior: true,
    sequenciaReal: false,
    quadra: true,
    chance: true,
    general: true
};

const categoriasAtivasPadrao = {

    trinca: true,
    doisPares: false,
    fullHouse: true,
    par: false,
    impar: false,
    parImpar: true,
    sequenciaMenor: true,
    sequenciaMaior: true,
    sequenciaReal: false,
    quadra: true,
    chance: true,
    general: true
};

let numeralSelecionado = null;
let categoriaSelecionada = null;


/****************************************************
 * ELEMENTOS GLOBAIS
 ****************************************************/

const valorSubtotal = document.getElementById("valor-subtotal");

const dialogRemover = document.getElementById("dialog-remover");
const btnRemover = dialogRemover.querySelector("button");
const btnCancelarRemover = dialogRemover.querySelectorAll("button")[1];

const dialogCategoria = document.getElementById("dialog-categoria");
const opcoesCategoria = dialogCategoria; // vamos injetar botões direto no dialog
const btnCancelarCategoria = null; // não existe mais fixo

const dialogNumeral = document.getElementById("dialog-numeral");
const tituloNumeral = document.getElementById("titulo-numeral");
const opcoesNumeral = document.getElementById("opcoes-numeral");
const btnCancelarNumeral = document.getElementById("btn-cancelar-numeral");

const containerCategorias = document.getElementById("categorias");

const dialogChance = document.getElementById("dialog-chance");

const selectChance = document.getElementById("select-chance");

const btnConfirmarChance = document.getElementById("btn-confirmar-chance");

const btnCancelarChance = document.getElementById("btn-cancelar-chance");


/****************************************************
 * CONFIGURAÇÕES
 ****************************************************/

const btnConfiguracoes = document.getElementById("btn-configuracoes");
const dialogConfiguracoes = document.getElementById("dialog-configuracoes");
const btnFecharConfiguracoes = document.getElementById("btn-fechar-configuracoes");
const listaConfiguracoes = document.getElementById("lista-configuracoes");
const btnSalvarConfiguracoes = document.getElementById("btn-salvar-configuracoes");
const btnRestaurarConfiguracoes = document.getElementById("btn-restaurar-configuracoes");

btnConfiguracoes.addEventListener("click", () => {
    renderizarConfiguracoes();
    dialogConfiguracoes.showModal();
});

btnFecharConfiguracoes.addEventListener("click", () => {
    dialogConfiguracoes.close();
});

btnSalvarConfiguracoes.addEventListener("click", () => {

    document
        .querySelectorAll(
            '#lista-configuracoes input[type="checkbox"]'
        )
        .forEach(checkbox => {

            const categoria =
                checkbox.dataset.categoria;

            categoriasAtivas[categoria] =
                checkbox.checked;
            salvarEstado();
        });

    renderizarCategorias();

    dialogConfiguracoes.close();
});

btnRestaurarConfiguracoes.addEventListener("click", () => {

    for (const key in categoriasAtivasPadrao) {

        categoriasAtivas[key] =
            categoriasAtivasPadrao[key];
        localStorage.removeItem("general_numeros");
        localStorage.removeItem("general_categorias");
        localStorage.removeItem("general_ativos");
    }

    renderizarConfiguracoes();
});

/****************************************************
 * RENDER CATEGORIAS (DINÂMICO)
 ****************************************************/

function renderizarCategorias() {

    containerCategorias.innerHTML = "";

    for (const key in categorias) {

        if (!categoriasAtivas[key]) continue;

        const cat = categorias[key];

        const botao = document.createElement("button");
        botao.classList.add("btn-categoria");
        botao.dataset.categoria = key;

        botao.innerHTML = `
            <span class="label">
                ${cat.nome}
                ${cat.valor !== null ? `(${cat.valor})` : "(Manual)"}
            </span>
            <span class="valor">${pontuacoesCategorias[key] ?? "-"}</span>
        `;

        botao.addEventListener("click", () => abrirCategoria(key));

        containerCategorias.appendChild(botao);
    }
}


/****************************************************
 * ABRIR CATEGORIA
 ****************************************************/

function abrirCategoria(categoria) {

    categoriaSelecionada = categoria;

    const cat = categorias[categoria];
    const atual = pontuacoesCategorias[categoria];

    if (categoria === "chance") {

        dialogChance.showModal();
        return;
    }

    if (atual !== null && atual !== undefined) {
        dialogRemover.showModal();
        return;
    }

    dialogCategoria.innerHTML = `
        <h2>Categoria</h2>

        <button id="cat-base">Marcar (${cat.valor})</button>
        <button id="cat-bonus">Marcar (${cat.valor} + 5)</button>
        <button id="cat-zero">Zerar</button>
        <button id="cat-cancelar">Cancelar</button>
    `;

    document.getElementById("cat-base").onclick = () => aplicarCategoria("base");
    document.getElementById("cat-bonus").onclick = () => aplicarCategoria("bonus");
    document.getElementById("cat-zero").onclick = () => aplicarCategoria("zero");

    document.getElementById("cat-cancelar").onclick = () => {
        categoriaSelecionada = null;
        dialogCategoria.close();
    };

    dialogCategoria.showModal();
}


/****************************************************
 * APLICAR CATEGORIA
 ****************************************************/

function aplicarCategoria(modo) {

    if (!categoriaSelecionada) return;

    const cat = categorias[categoriaSelecionada];

    let valor = 0;

    if (modo === "base") valor = cat.valor;
    if (modo === "bonus") valor = cat.valor + 5;
    if (modo === "zero") valor = 0;

    pontuacoesCategorias[categoriaSelecionada] = valor;
    salvarEstado();

    atualizarTotalGeral();
    renderizarCategorias();

    categoriaSelecionada = null;
    dialogCategoria.close();
}


/****************************************************
 * NUMERAIS
 ****************************************************/

document.querySelectorAll(".btn-numeral").forEach(botao => {

    botao.addEventListener("click", () => {

        const numero = Number(botao.dataset.numero);
        numeralSelecionado = numero;

        const atual = pontuacoesNumerais[numero];

        if (atual !== null) {
            dialogRemover.showModal();
            return;
        }

        tituloNumeral.textContent = `Número ${numero}`;
        opcoesNumeral.innerHTML = "";

        for (let i = 0; i <= 5; i++) {

            const valor = numero * i;

            const btn = document.createElement("button");
            btn.textContent = valor;

            btn.onclick = () => {

                pontuacoesNumerais[numero] = valor;
                salvarEstado();

                botao.querySelector(".valor").textContent = valor;

                atualizarSubtotal();
                atualizarTotalGeral();

                dialogNumeral.close();
            };

            opcoesNumeral.appendChild(btn);
        }

        dialogNumeral.showModal();
    });
});

btnCancelarNumeral.addEventListener("click", () => {
    dialogNumeral.close();
});

function aplicarNumeraisNaUI() {
    document.querySelectorAll(".btn-numeral").forEach(botao => {
        const numero = Number(botao.dataset.numero);
        const valor = pontuacoesNumerais[numero];

        botao.querySelector(".valor").textContent =
            valor !== null ? valor : "-";
    });
}

/****************************************************
 * REMOVER (NUMERAL + CATEGORIA)
 ****************************************************/

btnRemover.addEventListener("click", () => {

    if (numeralSelecionado !== null) {

        pontuacoesNumerais[numeralSelecionado] = null;

        const botao = document.querySelector(
            `.btn-numeral[data-numero="${numeralSelecionado}"]`
        );

        if (botao) botao.querySelector(".valor").textContent = "-";

        numeralSelecionado = null;

        atualizarSubtotal();
        atualizarTotalGeral();
        salvarEstado();
    }

    if (categoriaSelecionada !== null) {

        pontuacoesCategorias[categoriaSelecionada] = null;

        categoriaSelecionada = null;

        atualizarTotalGeral();
        renderizarCategorias();
        salvarEstado();
    }

    dialogRemover.close();
});

btnCancelarRemover.addEventListener("click", () => {
    numeralSelecionado = null;
    categoriaSelecionada = null;
    dialogRemover.close();
});


/****************************************************
 * SUBTOTAL / TOTAL
 ****************************************************/

function atualizarSubtotal() {

    let subtotal = 0;

    for (const n in pontuacoesNumerais) {
        if (pontuacoesNumerais[n] !== null) {
            subtotal += pontuacoesNumerais[n];
        }
    }

    valorSubtotal.textContent = subtotal;
}

function atualizarTotalGeral() {

    let total = 0;

    for (const n in pontuacoesNumerais) {
        if (pontuacoesNumerais[n] !== null) {
            total += pontuacoesNumerais[n];
        }
    }

    for (const c in pontuacoesCategorias) {
        if (pontuacoesCategorias[c] !== null) {
            total += pontuacoesCategorias[c];
        }
    }

    document.querySelector("#total-geral span:last-child")
        .textContent = total;
}

function inicializarChance() {

    selectChance.innerHTML = "";

    for (let i = 5; i <= 30; i++) {

        const option =
            document.createElement("option");

        option.value = i;
        option.textContent = i;

        selectChance.appendChild(option);
    }
}

btnConfirmarChance.addEventListener("click", () => {

    const valor =
        Number(selectChance.value);

    pontuacoesCategorias.chance = valor;
    salvarEstado();

    atualizarTotalGeral();
    renderizarCategorias();

    categoriaSelecionada = null;

    dialogChance.close();
});

btnCancelarChance.addEventListener("click", () => {

    categoriaSelecionada = null;

    dialogChance.close();
});

function renderizarConfiguracoes() {

    listaConfiguracoes.innerHTML = "";

    for (const key in categorias) {

        const item =
            document.createElement("label");

        item.style.display = "block";
        item.style.marginBottom = "10px";

        item.innerHTML = `
            <input
                type="checkbox"
                data-categoria="${key}"
                ${categoriasAtivas[key] ? "checked" : ""}
            >

            ${categorias[key].nome}
        `;

        listaConfiguracoes.appendChild(item);
    }
}

/****************************************************
 * NOVA PARTIDA
 ****************************************************/
function novaPartida() {

    // limpa numerais
    for (const key in pontuacoesNumerais) {
        pontuacoesNumerais[key] = null;
    }

    // limpa categorias
    for (const key in pontuacoesCategorias) {
        pontuacoesCategorias[key] = null;
    }

    // fecha qualquer modal aberto (opcional mas bom)
    dialogNumeral.close();
    dialogCategoria.close();
    dialogChance.close();
    dialogRemover.close();

    numeralSelecionado = null;
    categoriaSelecionada = null;

    // atualiza UI
    renderizarCategorias();
    atualizarSubtotal();
    atualizarTotalGeral();
    aplicarNumeraisNaUI(); // importante!

    // persiste estado limpo
    salvarEstado();
}

const btnNovaPartida = document.getElementById("btn-nova-partida");

btnNovaPartida.addEventListener("click", () => {
    novaPartida();
});

/****************************************************
 * PERSISTÊNCIA
 ****************************************************/

function salvarEstado() {

    localStorage.setItem(
        "general_numeros",
        JSON.stringify(pontuacoesNumerais)
    );

    localStorage.setItem(
        "general_categorias",
        JSON.stringify(pontuacoesCategorias)
    );

    localStorage.setItem(
        "general_ativos",
        JSON.stringify(categoriasAtivas)
    );
}

function carregarEstado() {

    const numerosSalvos =
        localStorage.getItem("general_numeros");

    const categoriasSalvas =
        localStorage.getItem("general_categorias");

    const ativosSalvos =
        localStorage.getItem("general_ativos");

    if (numerosSalvos) {
        Object.assign(
            pontuacoesNumerais,
            JSON.parse(numerosSalvos)
        );
    }

    if (categoriasSalvas) {
        Object.assign(
            pontuacoesCategorias,
            JSON.parse(categoriasSalvas)
        );
    }

    if (ativosSalvos) {
        Object.assign(
            categoriasAtivas,
            JSON.parse(ativosSalvos)
        );
    }
}


/****************************************************
 * INICIALIZAÇÃO
 ****************************************************/

carregarEstado();
renderizarCategorias();
atualizarSubtotal();
atualizarTotalGeral();
renderizarCategorias();
inicializarChance();
atualizarSubtotal();
atualizarTotalGeral();
aplicarNumeraisNaUI();