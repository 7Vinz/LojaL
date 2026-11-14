let PRODUTOS = [];
let carrinho = { itens: [], total: 0, quantidade: 0 };

function buscarProduto(id) {
  return PRODUTOS.find((p) => p.id === id);
}

function atualizarCabecalho() {
  const logado = Boolean(sessao.usuario);
  document.getElementById("link-entrar").hidden = logado;
  document.getElementById("conta-logado").hidden = !logado;
  if (logado) {
    document.getElementById("conta-nome").textContent = sessao.usuario.nome_usuario;
    document.getElementById("saldo-valor").textContent = sessao.usuario.saldo;
  }
}

function configurarConta() {
  document.getElementById("btn-sair").addEventListener("click", async () => {
    try {
      const dados = await api("api/auth.php?acao=sair", { metodo: "POST" });
      sessao.csrf = dados.csrf;
    } finally {
      sessao.usuario = null;
      carrinho = { itens: [], total: 0, quantidade: 0 };
      atualizarCabecalho();
      renderizarCarrinho();
      atualizarContadorCarrinho();
    }
  });
}

function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.className = "item";
  card.innerHTML = `
    <img src="${esc(produto.imagem)}" alt="${esc(produto.nome)}">
    <h5>${esc(produto.nome)}</h5>
    <p class="preco">${produto.preco}</p>
    <button class="btn btn-primary btn-comprar" data-id="${esc(produto.id)}">Comprar</button>
    <button class="btn btn-add-carrinho" data-id="${esc(produto.id)}">Adicionar ao carrinho</button>
  `;
  return card;
}

function renderizarDestaques() {
  const container = document.getElementById("produtos-destaque");
  container.innerHTML = "";
  PRODUTOS.filter((p) => p.destaque).forEach((p) => container.appendChild(criarCardProduto(p)));
}

function renderizarCatalogo() {
  const container = document.getElementById("catalogo-produtos");
  container.innerHTML = "";

  [...new Set(PRODUTOS.map((p) => p.categoria))].forEach((categoria) => {
    const bloco = document.createElement("div");
    bloco.className = "catalogo-bloco";

    const titulo = document.createElement("h3");
    titulo.textContent = categoria;
    bloco.appendChild(titulo);

    const trilho = document.createElement("div");
    trilho.className = "Trilho";
    PRODUTOS.filter((p) => p.categoria === categoria).forEach((p) => trilho.appendChild(criarCardProduto(p)));
    bloco.appendChild(trilho);
    container.appendChild(bloco);
  });
}

async function carregarProdutos() {
  try {
    PRODUTOS = (await api("api/produtos.php")).produtos;
  } catch (erro) {
    document.getElementById("catalogo-produtos").innerHTML = `<p class="carrinho-vazio">${esc(erro.message)}</p>`;
    return;
  }
  renderizarDestaques();
  renderizarCatalogo();
}

function mostrarDetalhesProduto(id) {
  const produto = buscarProduto(id);
  if (!produto) return;

  const painel = document.getElementById("detalhes");
  const estrelasCheias = Math.round(produto.avaliacao);
  const estrelas = "★".repeat(estrelasCheias) + "☆".repeat(5 - estrelasCheias);

  document.getElementById("detalhes-produto").innerHTML = `
    <div class="detalhes-imagem">
      <img src="${esc(produto.imagem)}" alt="${esc(produto.nome)}">
    </div>
    <div class="detalhes-info">
      <p class="detalhes-categoria">${esc(produto.categoria)}</p>
      <h1>${esc(produto.nome)}</h1>
      <p class="detalhes-avaliacao">${estrelas} <span>${produto.avaliacao.toFixed(1)} (${produto.numAvaliacoes} avaliações)</span></p>
      <p class="detalhes-descricao">${esc(produto.descricao)}</p>
      <p class="detalhes-preco">🪙 ${produto.preco} moedas</p>
      <p class="detalhes-disponibilidade">${esc(produto.disponibilidade)}</p>
      <button class="btn btn-primary" id="btn-comprar">Adicionar ao carrinho</button>
      <p class="detalhes-confirmacao" id="confirmacao-compra" hidden>Item adicionado à sacola! Boa sorte na Fenda do Invocador.</p>
    </div>
  `;

  document.getElementById("btn-comprar").addEventListener("click", async () => {
    if (await adicionarAoCarrinho(produto.id)) {
      document.getElementById("confirmacao-compra").hidden = false;
    }
  });

  painel.classList.add("visivel");
  painel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function esconderDetalhesProduto() {
  document.getElementById("detalhes").classList.remove("visivel");
  document.getElementById("produtos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function configurarBotoesComprar() {
  document.addEventListener("click", async (evento) => {
    const botaoDetalhes = evento.target.closest(".btn-comprar");
    if (botaoDetalhes) {
      mostrarDetalhesProduto(botaoDetalhes.dataset.id);
      return;
    }

    const botaoAdicionar = evento.target.closest(".btn-add-carrinho");
    if (botaoAdicionar) {
      const rotuloOriginal = botaoAdicionar.textContent;
      botaoAdicionar.disabled = true;
      const ok = await adicionarAoCarrinho(botaoAdicionar.dataset.id);
      botaoAdicionar.textContent = ok ? "Adicionado ✓" : rotuloOriginal;
      setTimeout(() => {
        botaoAdicionar.textContent = rotuloOriginal;
        botaoAdicionar.disabled = false;
      }, 900);
      return;
    }

    if (evento.target.closest(".voltar-link")) {
      evento.preventDefault();
      esconderDetalhesProduto();
    }
  });
}

function irParaLogin() {
  window.location.href = "login.html?aviso=carrinho";
}

async function chamarCarrinho(opcoes = {}, query = "") {
  if (!sessao.usuario) {
    irParaLogin();
    return false;
  }
  try {
    carrinho = await api("api/carrinho.php" + query, opcoes);
    atualizarContadorCarrinho();
    renderizarCarrinho();
    return true;
  } catch (erro) {
    if (erro.status === 401) irParaLogin();
    else mostrarAviso(erro.message, "erro");
    return false;
  }
}

const adicionarAoCarrinho = (id) => chamarCarrinho({ metodo: "POST", corpo: { produto_id: id, quantidade: 1 } });
const alterarQuantidade = (id, q) => chamarCarrinho({ metodo: "PUT", corpo: { produto_id: id, quantidade: q } });
const removerDoCarrinho = (id) => chamarCarrinho({ metodo: "DELETE" }, `?produto_id=${encodeURIComponent(id)}`);

function atualizarContadorCarrinho() {
  document.getElementById("carrinho-contador").textContent = carrinho.quantidade;
}

function mostrarAviso(texto, tipo = "sucesso") {
  const el = document.getElementById("pagamento-status");
  el.textContent = texto;
  el.className = `status-formulario ${tipo}`;
}

function renderizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const pagamento = document.getElementById("pagamento");
  lista.innerHTML = "";

  if (!sessao.usuario) {
    pagamento.hidden = true;
    lista.innerHTML = '<p class="carrinho-vazio">Entre na sua conta para usar a sacola. <a href="login.html">Entrar</a></p>';
    return;
  }

  if (carrinho.itens.length === 0) {
    pagamento.hidden = true;
    lista.innerHTML = '<p class="carrinho-vazio">Sua sacola está vazia. Volte aos produtos para adicionar itens.</p>';
    return;
  }

  carrinho.itens.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "carrinho-item";
    linha.innerHTML = `
      <img src="${esc(item.imagem)}" alt="${esc(item.nome)}">
      <div class="carrinho-item-info">
        <h4>${esc(item.nome)}</h4>
        <p>🪙 ${item.preco} moedas</p>
      </div>
      <div class="quantidade" role="group" aria-label="Quantidade de ${esc(item.nome)}">
        <button type="button" class="btn-qtd" data-acao="menos" data-id="${esc(item.produto_id)}" data-qtd="${item.quantidade}" aria-label="Diminuir">−</button>
        <span>${item.quantidade}</span>
        <button type="button" class="btn-qtd" data-acao="mais" data-id="${esc(item.produto_id)}" data-qtd="${item.quantidade}" aria-label="Aumentar">+</button>
      </div>
      <button class="btn-remover-item" data-id="${esc(item.produto_id)}">Remover</button>
    `;
    lista.appendChild(linha);
  });

  atualizarPainelPagamento();
}

function atualizarPainelPagamento() {
  const saldo = sessao.usuario.saldo;
  const falta = carrinho.total - saldo;
  document.getElementById("pagamento").hidden = false;
  document.getElementById("pg-total").textContent = `🪙 ${carrinho.total}`;
  document.getElementById("pg-saldo").textContent = `🪙 ${saldo}`;
  document.getElementById("pg-restante").textContent = falta > 0 ? `faltam 🪙 ${falta}` : `🪙 ${saldo - carrinho.total}`;
  document.getElementById("btn-pagar").disabled = falta > 0;
  if (falta > 0) mostrarAviso("Saldo insuficiente para pagar esta sacola. Remova itens para continuar.", "erro");
}

function configurarCarrinho() {
  document.getElementById("carrinho-lista").addEventListener("click", (evento) => {
    const remover = evento.target.closest(".btn-remover-item");
    if (remover) {
      removerDoCarrinho(remover.dataset.id);
      return;
    }
    const qtd = evento.target.closest(".btn-qtd");
    if (qtd) {
      const atual = Number(qtd.dataset.qtd);
      alterarQuantidade(qtd.dataset.id, qtd.dataset.acao === "mais" ? atual + 1 : atual - 1);
    }
  });

  document.getElementById("btn-pagar").addEventListener("click", pagar);
}

async function pagar() {
  const botao = document.getElementById("btn-pagar");
  botao.disabled = true;
  mostrarAviso("Processando pagamento…", "");
  try {
    const r = await api("api/checkout.php", { metodo: "POST", corpo: { forma_pagamento: "moedas" } });
    sessao.usuario.saldo = r.saldo;
    carrinho = { itens: [], total: 0, quantidade: 0 };
    atualizarCabecalho();
    atualizarContadorCarrinho();
    renderizarCarrinho();
    mostrarAviso(`Pagamento aprovado! Pedido #${r.pedido_id}: 🪙 ${r.total} moedas. Boa sorte na Fenda!`, "sucesso");
  } catch (erro) {
    mostrarAviso(erro.message, "erro");
    if (erro.dados.saldo !== undefined) sessao.usuario.saldo = erro.dados.saldo;
    atualizarCabecalho();
    botao.disabled = false;
  }
}

function configurarMenuResponsivo() {
  const botao = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  botao.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
    botao.textContent = aberto ? "✕" : "☰";
  });

  nav.addEventListener("click", (evento) => {
    if (evento.target.tagName === "A" && nav.classList.contains("aberto")) {
      nav.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.textContent = "☰";
    }
  });
}

function configurarFormularioContato() {
  const form = document.getElementById("form-contato");
  const status = document.getElementById("status-formulario");

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      status.textContent = "Preencha todos os campos antes de enviar.";
      status.className = "status-formulario erro";
      return;
    }

    try {
      await api("api/contato.php", { metodo: "POST", corpo: { nome, email, mensagem } });
      status.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada e em breve retornaremos pelo e-mail informado.`;
      status.className = "status-formulario sucesso";
      form.reset();
    } catch (erro) {
      status.textContent = erro.message;
      status.className = "status-formulario erro";
    }
  });
}

function configurarNavegacaoAtiva() {
  const links = document.querySelectorAll(".main-nav a");
  const secoes = ["inicio", "produtos", "carrinho", "contato"].map((id) => document.getElementById(id));

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          links.forEach((link) => link.classList.remove("ativo"));
          const ativo = document.querySelector(`.main-nav a[href="#${entrada.target.id}"]`);
          if (ativo) ativo.classList.add("ativo");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  secoes.forEach((secao) => observer.observe(secao));
}

document.addEventListener("DOMContentLoaded", async () => {
  configurarMenuResponsivo();
  configurarFormularioContato();
  configurarNavegacaoAtiva();
  configurarBotoesComprar();
  configurarCarrinho();
  configurarConta();

  try {
    await carregarSessao();
  } catch (erro) {
    mostrarAviso(erro.message, "erro");
  }
  atualizarCabecalho();
  renderizarCarrinho();

  await carregarProdutos();
  if (sessao.usuario) await chamarCarrinho();
});
