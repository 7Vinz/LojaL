/* Loja do Leôncio — front-end
   Os produtos e as imagens ficam no index.html (sempre carregam).
   O PHP/MySQL cuida de logins, pagamentos e histórico de compras. */

const CHAVE_CARRINHO = "carrinhoLojaLeoncio";
let usuarioAtual = null;

const $ = (id) => document.getElementById(id);

/* ===== Produtos (lidos dos cards do HTML) ===== */
function buscarProduto(id) {
  const card = document.querySelector(`#catalogo-produtos .item[data-id="${CSS.escape(id)}"]`);
  if (!card) return null;
  const d = card.dataset;
  return {
    id: d.id,
    nome: d.nome,
    categoria: d.categoria,
    preco: Number(d.preco),
    descricao: d.descricao,
    disponibilidade: d.disponibilidade,
    avaliacao: Number(d.avaliacao),
    numAvaliacoes: Number(d.numAvaliacoes),
    imagem: card.querySelector("img").getAttribute("src"),
  };
}

/* ===== Painel de detalhes do produto ===== */
function mostrarDetalhesProduto(id) {
  const produto = buscarProduto(id);
  if (!produto) return;

  const painel = $("detalhes");
  const estrelasCheias = Math.round(produto.avaliacao);
  const estrelas = "★".repeat(estrelasCheias) + "☆".repeat(5 - estrelasCheias);

  $("detalhes-produto").innerHTML = `
    <div class="detalhes-imagem">
      <img src="${produto.imagem}" alt="${escapar(produto.nome)}">
    </div>
    <div class="detalhes-info">
      <p class="detalhes-categoria">${escapar(produto.categoria)}</p>
      <h1>${escapar(produto.nome)}</h1>
      <p class="detalhes-avaliacao">${estrelas} <span>${produto.avaliacao.toFixed(1)} (${produto.numAvaliacoes} avaliações)</span></p>
      <p class="detalhes-descricao">${escapar(produto.descricao)}</p>
      <p class="detalhes-preco">🪙 ${produto.preco} moedas</p>
      <p class="detalhes-disponibilidade">${escapar(produto.disponibilidade)}</p>
      <button class="btn btn-primary" id="btn-comprar">Adicionar ao carrinho</button>
      <p class="detalhes-confirmacao" id="confirmacao-compra" hidden>Item adicionado à sacola! Boa sorte na Fenda do Invocador.</p>
    </div>
  `;

  $("btn-comprar").addEventListener("click", () => {
    adicionarAoCarrinho(produto.id);
    $("confirmacao-compra").hidden = false;
  });

  painel.classList.add("visivel");
  painel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function esconderDetalhesProduto() {
  $("detalhes").classList.remove("visivel");
  $("produtos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function configurarBotoesComprar() {
  document.addEventListener("click", (evento) => {
    const botaoDetalhes = evento.target.closest(".btn-comprar");
    if (botaoDetalhes) {
      mostrarDetalhesProduto(botaoDetalhes.dataset.id);
      return;
    }

    const botaoAdicionar = evento.target.closest(".btn-add-carrinho");
    if (botaoAdicionar) {
      adicionarAoCarrinho(botaoAdicionar.dataset.id);
      const rotuloOriginal = botaoAdicionar.textContent;
      botaoAdicionar.textContent = "Adicionado ✓";
      botaoAdicionar.disabled = true;
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

/* ===== Carrinho (fica no navegador até o pagamento) ===== */
function obterCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function adicionarAoCarrinho(idProduto) {
  const carrinho = obterCarrinho();
  carrinho.push(idProduto);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerDoCarrinho(indice) {
  const carrinho = obterCarrinho();
  carrinho.splice(indice, 1);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function atualizarContadorCarrinho() {
  const contador = $("carrinho-contador");
  if (contador) contador.textContent = obterCarrinho().length;
}

function renderizarCarrinho() {
  const lista = $("carrinho-lista");
  const totalEl = $("carrinho-total");
  const botaoPagar = $("btn-pagar");
  if (!lista) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = "";
  botaoPagar.hidden = carrinho.length === 0;

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="carrinho-vazio">Sua sacola está vazia. Volte aos produtos para adicionar itens.</p>';
    totalEl.textContent = "";
    return;
  }

  let total = 0;
  carrinho.forEach((idProduto, indice) => {
    const produto = buscarProduto(idProduto);
    if (!produto) return;
    total += produto.preco;

    const linha = document.createElement("div");
    linha.className = "carrinho-item";
    linha.innerHTML = `
      <img src="${produto.imagem}" alt="${escapar(produto.nome)}">
      <div class="carrinho-item-info">
        <h4>${escapar(produto.nome)}</h4>
        <p>🪙 ${produto.preco} moedas</p>
      </div>
      <button class="btn-remover-item" data-indice="${indice}">Remover</button>
    `;
    lista.appendChild(linha);
  });

  totalEl.textContent = `Total: 🪙 ${total} moedas`;
}

function configurarCarrinho() {
  $("carrinho-lista").addEventListener("click", (evento) => {
    const botaoRemover = evento.target.closest(".btn-remover-item");
    if (botaoRemover) removerDoCarrinho(Number(botaoRemover.dataset.indice));
  });
  $("btn-pagar").addEventListener("click", pagar);
}

/* ===== Conta do usuário ===== */
async function carregarSessao() {
  try {
    const dados = await api("api/sessao.php");
    usuarioAtual = dados.logado ? dados.usuario : null;
  } catch {
    usuarioAtual = null;
  }
  atualizarAreaUsuario();
  if (usuarioAtual) carregarPedidos();
}

function atualizarAreaUsuario() {
  const logado = Boolean(usuarioAtual);
  $("btn-entrar").hidden = logado;
  $("btn-sair").hidden = !logado;
  $("saldo-moedas").hidden = !logado;
  $("usuario-nome").hidden = !logado;
  $("item-pedidos").hidden = !logado;
  $("pedidos").hidden = !logado;

  if (logado) {
    $("usuario-nome").textContent = usuarioAtual.usuario;
    $("saldo-moedas").textContent = `🪙 ${usuarioAtual.saldo}`;
  }
}

function configurarAreaUsuario() {
  $("btn-sair").addEventListener("click", async () => {
    try {
      await api("api/logout.php", {});
    } finally {
      usuarioAtual = null;
      atualizarAreaUsuario();
    }
  });
}

/* ===== Pagamento ===== */
async function pagar() {
  const status = $("status-pagamento");
  const botao = $("btn-pagar");
  const carrinho = obterCarrinho();
  if (carrinho.length === 0) return;

  if (!usuarioAtual) {
    location.href = "login.html?voltar=carrinho";
    return;
  }

  botao.disabled = true;
  status.className = "status-pagamento";
  status.textContent = "Processando pagamento…";

  try {
    const r = await api("api/pagar.php", { itens: carrinho });
    salvarCarrinho([]);
    renderizarCarrinho();
    usuarioAtual.saldo = r.saldo;
    atualizarAreaUsuario();
    status.textContent = `Pagamento aprovado! Pedido #${r.pedido_id}, total de 🪙 ${r.total} moedas. Seu novo saldo é 🪙 ${r.saldo}.`;
    status.className = "status-pagamento sucesso";
    carregarPedidos();
  } catch (erro) {
    status.textContent = erro.message;
    status.className = "status-pagamento erro";
    if (erro.status === 401) {
      usuarioAtual = null;
      atualizarAreaUsuario();
    }
  } finally {
    botao.disabled = false;
  }
}

/* ===== Histórico de pedidos (vem do MySQL) ===== */
async function carregarPedidos() {
  const lista = $("pedidos-lista");
  try {
    const { pedidos } = await api("api/pedidos.php");
    if (pedidos.length === 0) {
      lista.innerHTML = '<p class="carrinho-vazio">Você ainda não fez nenhuma compra.</p>';
      return;
    }
    lista.innerHTML = pedidos
      .map((p) => {
        const data = new Date(p.criado_em.replace(" ", "T")).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
        const itens = p.itens
          .map((i) => `<li>${i.quantidade}× ${escapar(i.nome)} <span>🪙 ${i.preco_unitario * i.quantidade}</span></li>`)
          .join("");
        return `
          <article class="pedido">
            <header><strong>Pedido #${p.id}</strong><span>${data}</span><span class="pedido-total">🪙 ${p.total}</span></header>
            <ul>${itens}</ul>
          </article>`;
      })
      .join("");
  } catch (erro) {
    lista.innerHTML = `<p class="carrinho-vazio">${escapar(erro.message)}</p>`;
  }
}

/* ===== Menu responsivo ===== */
function configurarMenuResponsivo() {
  const botao = $("menu-toggle");
  const nav = $("main-nav");
  if (!botao || !nav) return;

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

/* ===== Formulário de contato ===== */
function configurarFormularioContato() {
  const form = $("form-contato");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const mensagemStatus = $("status-formulario");
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      mensagemStatus.textContent = "Preencha todos os campos antes de enviar.";
      mensagemStatus.className = "status-formulario erro";
      return;
    }

    if (!email.includes("@")) {
      mensagemStatus.textContent = 'Informe um e-mail válido, contendo "@".';
      mensagemStatus.className = "status-formulario erro";
      return;
    }

    mensagemStatus.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada e em breve retornaremos pelo e-mail informado.`;
    mensagemStatus.className = "status-formulario sucesso";
    form.reset();
  });
}

/* ===== Navegação ativa ===== */
function configurarNavegacaoAtiva() {
  const links = document.querySelectorAll(".main-nav a");
  const secoes = ["inicio", "produtos", "carrinho", "pedidos", "contato"].map($).filter(Boolean);

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          links.forEach((link) => link.classList.remove("ativo"));
          const linkAtivo = document.querySelector(`.main-nav a[href="#${entrada.target.id}"]`);
          if (linkAtivo) linkAtivo.classList.add("ativo");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  secoes.forEach((secao) => observer.observe(secao));
}

document.addEventListener("DOMContentLoaded", () => {
  configurarBotoesComprar();
  configurarFormularioContato();
  configurarNavegacaoAtiva();
  configurarMenuResponsivo();
  configurarCarrinho();
  configurarAreaUsuario();
  renderizarCarrinho();
  atualizarContadorCarrinho();
  carregarSessao();
});
