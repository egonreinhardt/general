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
    trinca: { nome: "Trinca", valor: 20 },
    fullHouse: { nome: "Full House", valor: 25 },
    parImpar: { nome: "Par/Ímpar", valor: 25 },
    sequenciaMenor: { nome: "Sequência Menor", valor: 30 },
    sequenciaMaior: { nome: "Sequência Maior", valor: 35 },
    quadra: { nome: "Quadra", valor: 40 },
    general: { nome: "General", valor: 50 }
};

const pontuacoesCategorias = {};

const categoriasAtivas = {
    trinca: true,
    fullHouse: true,
    parImpar: true,
    sequenciaMenor: true,
    sequenciaMaior: true,
    quadra: true,
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


/****************************************************
 * CONFIGURAÇÕES
 ****************************************************/

const btnConfiguracoes = document.getElementById("btn-configuracoes");
const dialogConfiguracoes = document.getElementById("dialog-configuracoes");
const btnFecharConfiguracoes = document.getElementById("btn-fechar-configuracoes");

btnConfiguracoes.addEventListener("click", () => {
    dialogConfiguracoes.showModal();
});

btnFecharConfiguracoes.addEventListener("click", () => {
    dialogConfiguracoes.close();
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
            <span class="label">${cat.nome} (${cat.valor})</span>
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
    }

    if (categoriaSelecionada !== null) {

        pontuacoesCategorias[categoriaSelecionada] = null;

        categoriaSelecionada = null;

        atualizarTotalGeral();
        renderizarCategorias();
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


/****************************************************
 * INICIALIZAÇÃO
 ****************************************************/

renderizarCategorias();
atualizarSubtotal();
atualizarTotalGeral();