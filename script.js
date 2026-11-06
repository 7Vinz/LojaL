
// Base dos produtos

const PRODUTOS = [
  // Itens Iniciais
  { id: "abatedora", nome: "Abatedora", categoria: "Itens Iniciais", imagem: "imgs/Abatedora.webp", preco: 450,
    descricao: "Uma lâmina simples, mas afiada o bastante para abrir vantagem nos primeiros minutos de luta.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "anel-de-doran", nome: "Anel de Doran", categoria: "Itens Iniciais", imagem: "imgs/Anel.jpeg", preco: 400,
    descricao: "Um anel modesto que canaliza poder mágico contínuo para conjuradores em início de partida.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "arco-de-doran", nome: "Arco de Doran", categoria: "Itens Iniciais", imagem: "imgs/Arco.jpeg", preco: 400,
    descricao: "Reforça o ataque à distância, ideal para atiradores que buscam pressão constante na rota.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "atlas-mundial", nome: "Atlas Mundial", categoria: "Itens Iniciais", imagem: "imgs/Mapinha.jpeg", preco: 400,
    descricao: "Um mapa antigo de Runeterra que revela caminhos e recompensa exploração pela selva.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "elmo-de-doran", nome: "Elmo de Doran", categoria: "Itens Iniciais", imagem: "imgs/Elmo.jpeg", preco: 450,
    descricao: "Proteção extra para quem pretende iniciar as lutas em vez de apenas sobreviver a elas.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "escudo-de-doran", nome: "Escudo de Doran", categoria: "Itens Iniciais", imagem: "imgs/Escudo.jpeg", preco: 450,
    descricao: "Um escudo robusto que regenera vida com o tempo, perfeito para rotas de troca intensa.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "lacre-sombrio", nome: "Lacre Sombrio", categoria: "Itens Iniciais", imagem: "imgs/Lacre.jpeg", preco: 350,
    descricao: "Um artefato sombrio que se fortalece a cada abate, favorecendo jogadores agressivos.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "lagrima-da-deusa", nome: "Lágrima da Deusa", categoria: "Itens Iniciais", imagem: "imgs/Lagrima.jpeg", preco: 400,
    descricao: "Uma relíquia rara que converte o uso de habilidades em recurso mágico permanente.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "lamina-de-doran", nome: "Lâmina de Doran", categoria: "Itens Iniciais", imagem: "imgs/Lamina.webp", preco: 450,
    descricao: "Equilibra dano e resistência, a escolha clássica de duelistas de corpo a corpo.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },

  // Botas
  { id: "bota-comum", nome: "Bota Comum", categoria: "Botas", imagem: "imgs/Bota.jpeg", preco: 300,
    descricao: "O primeiro passo de qualquer jornada por Runeterra: velocidade básica de movimento.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "botas-da-rapidez", nome: "Botas da Rapidez", categoria: "Botas", imagem: "imgs/Rapidez.jpeg", preco: 1000,
    descricao: "Couro encantado que garante o maior bônus de velocidade entre todas as botas.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "galvanizadas-de-aco", nome: "Galvanizadas de Aço", categoria: "Botas", imagem: "imgs/Galvanizadas.jpeg", preco: 1200,
    descricao: "Placas reforçadas que absorvem parte do dano físico recebido em combate prolongado.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "grevas-do-berserker", nome: "Grevas do Berserker", categoria: "Botas", imagem: "imgs/Berserker.jpeg", preco: 1100,
    descricao: "Acelera o ritmo dos ataques, favorito de quem vive do dano físico contínuo.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "grevas-vorazes", nome: "Grevas Vorazes", categoria: "Botas", imagem: "imgs/Vorazes.jpeg", preco: 1000,
    descricao: "Um upgrade simples e direto que recompensa o abate de monstros e inimigos.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "ionianas-da-lucidez", nome: "Ionianas da Lucidez", categoria: "Botas", imagem: "imgs/Ionianas.jpeg", preco: 900,
    descricao: "Reduz o tempo de espera das habilidades, essencial para conjuradores versáteis.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "passos-de-mercurio", nome: "Passos de Mercúrio", categoria: "Botas", imagem: "imgs/Mercurio.jpeg", preco: 1250,
    descricao: "Forjadas em Piltover, reduzem efeitos de controle e protegem contra magia.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "sapatos-do-feiticeiro", nome: "Sapatos do Feiticeiro", categoria: "Botas", imagem: "imgs/Feiticeiro.jpeg", preco: 1100,
    descricao: "Costurados com fios arcanos que ampliam o poder de qualquer magia lançada.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },

  // Pets da Selva
  { id: "filhote-de-andabrisas", nome: "Filhote de Andabrisas", categoria: "Pets da Selva", imagem: "imgs/Brisa.jpeg", preco: 450,
    descricao: "Um companheiro alado dócil que acompanha o invocador em suas incursões pela selva.",
    disponibilidade: "Estoque limitado", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "filhote-de-esmagamusgo", nome: "Filhote de Esmagamusgo", categoria: "Pets da Selva", imagem: "imgs/Musgo.jpeg", preco: 450,
    descricao: "Pequeno e resistente, gosta de esmagar tudo o que encontra pelo caminho.",
    disponibilidade: "Estoque limitado", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "filhote-de-garrabrasa", nome: "Filhote de Garrabrasa", categoria: "Pets da Selva", imagem: "imgs/Brasa.jpeg", preco: 450,
    descricao: "Aquecido por brasas internas, ilumina o caminho nos cantos mais escuros da selva.",
    disponibilidade: "Estoque limitado", avaliacao: 4.9, numAvaliacoes: 123 },

  // Poções
  { id: "pocao-de-mana", nome: "Poção de Mana", categoria: "Poções", imagem: "imgs/PotMana.webp", preco: 50,
    descricao: "Restaura uma quantidade de mana ao longo de alguns segundos. Item básico de sobrevivência.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
  { id: "pocao-de-vida", nome: "Poção de Vida", categoria: "Poções", imagem: "imgs/PotVida.webp", preco: 50,
    descricao: "Restaura uma quantidade de vida ao longo de alguns segundos. Nunca saia da loja sem uma.",
    disponibilidade: "Em estoque", avaliacao: 4.9, numAvaliacoes: 123 },
];

// IDs usados na seção "Produtos em destaque"
const DESTAQUES = ["passos-de-mercurio", "lagrima-da-deusa", "filhote-de-andabrisas", "pocao-de-vida"];

function buscarProduto(id) {
  return PRODUTOS.find((p) => p.id === id);
}

function criarCardProduto(produto) {
  const card = document.createElement("div");
  card.className = "item";
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h5>${produto.nome}</h5>
    <p class="preco">${produto.preco}</p>
    <button class="btn btn-primary btn-comprar" data-id="${produto.id}">Comprar</button>
    <button class="btn btn-add-carrinho" data-id="${produto.id}">Adicionar ao carrinho</button>
  `;
  return card;
}

// Seção Início
function renderizarDestaques() {
  const container = document.getElementById("produtos-destaque");
  if (!container) return;
  DESTAQUES.forEach((id) => {
    const produto = buscarProduto(id);
    if (produto) container.appendChild(criarCardProduto(produto));
  });
}

// Seção Produtos
function renderizarCatalogo() {
  const container = document.getElementById("catalogo-produtos");
  if (!container) return;

  const categorias = [...new Set(PRODUTOS.map((p) => p.categoria))];
  categorias.forEach((categoria) => {
    const bloco = document.createElement("div");
    bloco.className = "catalogo-bloco";

    const titulo = document.createElement("h3");
    titulo.textContent = categoria;
    bloco.appendChild(titulo);

    const trilho = document.createElement("div");
    trilho.className = "Trilho";
    PRODUTOS.filter((p) => p.categoria === categoria).forEach((produto) => {
      trilho.appendChild(criarCardProduto(produto));
    });
    bloco.appendChild(trilho);
    container.appendChild(bloco);
  });
}

// Painel de detalhes do produto
function mostrarDetalhesProduto(id) {
  const produto = buscarProduto(id);
  if (!produto) return;

  const painel = document.getElementById("detalhes");
  const container = document.getElementById("detalhes-produto");

  const estrelasCheias = Math.round(produto.avaliacao);
  const estrelas = "★".repeat(estrelasCheias) + "☆".repeat(5 - estrelasCheias);

  container.innerHTML = `
    <div class="detalhes-imagem">
      <img src="${produto.imagem}" alt="${produto.nome}">
    </div>
    <div class="detalhes-info">
      <p class="detalhes-categoria">${produto.categoria}</p>
      <h1>${produto.nome}</h1>
      <p class="detalhes-avaliacao">${estrelas} <span>${produto.avaliacao.toFixed(1)} (${produto.numAvaliacoes} avaliações)</span></p>
      <p class="detalhes-descricao">${produto.descricao}</p>
      <p class="detalhes-preco">🪙 ${produto.preco} moedas</p>
      <p class="detalhes-disponibilidade">${produto.disponibilidade}</p>
      <button class="btn btn-primary" id="btn-comprar">Adicionar ao carrinho</button>
      <p class="detalhes-confirmacao" id="confirmacao-compra" hidden>Item adicionado à sacola! Boa sorte na Fenda do Invocador.</p>
    </div>
  `;

  document.getElementById("btn-comprar").addEventListener("click", () => {
    adicionarAoCarrinho(produto.id);
    document.getElementById("confirmacao-compra").hidden = false;
  });

  painel.classList.add("visivel");
  painel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function esconderDetalhesProduto() {
  document.getElementById("detalhes").classList.remove("visivel");
  document.getElementById("produtos").scrollIntoView({ behavior: "smooth", block: "start" });
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

/* ===== Carrinho de compras ===== */
const CHAVE_CARRINHO = "carrinhoLojaLeoncio";

function obterCarrinho() {
  const dados = localStorage.getItem(CHAVE_CARRINHO);
  return dados ? JSON.parse(dados) : [];
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
  const contador = document.getElementById("carrinho-contador");
  if (contador) contador.textContent = obterCarrinho().length;
}

function renderizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const totalEl = document.getElementById("carrinho-total");
  if (!lista) return;

  const carrinho = obterCarrinho();
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="carrinho-vazio">Sua sacola está vazia. Volte aos produtos para adicionar itens.</p>';
    if (totalEl) totalEl.textContent = "";
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
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="carrinho-item-info">
        <h4>${produto.nome}</h4>
        <p>🪙 ${produto.preco} moedas</p>
      </div>
      <button class="btn-remover-item" data-indice="${indice}">Remover</button>
    `;
    lista.appendChild(linha);
  });

  if (totalEl) totalEl.textContent = `Total: 🪙 ${total} moedas`;
}

function configurarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  if (!lista) return;

  lista.addEventListener("click", (evento) => {
    const botaoRemover = evento.target.closest(".btn-remover-item");
    if (botaoRemover) {
      removerDoCarrinho(Number(botaoRemover.dataset.indice));
    }
  });
}

// Menu responsivo
function configurarMenuResponsivo() {
  const botao = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!botao || !nav) return;

  botao.addEventListener("click", () => {
    const aberto = nav.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
    botao.textContent = aberto ? "✕" : "☰";
  });

  // Fecha o menu ao clicar em um link (útil em telas pequenas)
  nav.addEventListener("click", (evento) => {
    if (evento.target.tagName === "A" && nav.classList.contains("aberto")) {
      nav.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
      botao.textContent = "☰";
    }
  });
}

// Formulário de contato
function configurarFormularioContato() {
  const form = document.getElementById("form-contato");
  if (!form) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const mensagemStatus = document.getElementById("status-formulario");
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      mensagemStatus.textContent = "Preencha todos os campos antes de enviar.";
      mensagemStatus.className = "status-formulario erro";
      return;
    }

    if (!email.includes("@")) {
      mensagemStatus.textContent = "Informe um e-mail válido, contendo \"@\".";
      mensagemStatus.className = "status-formulario erro";
      return;
    }

    mensagemStatus.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada e em breve retornaremos pelo e-mail informado.`;
    mensagemStatus.className = "status-formulario sucesso";
    form.reset();
  });
}

// Navegação
function configurarNavegacaoAtiva() {
  const links = document.querySelectorAll(".main-nav a");
  const secoes = ["inicio", "produtos", "carrinho", "contato"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

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
  renderizarDestaques();
  renderizarCatalogo();
  configurarBotoesComprar();
  configurarFormularioContato();
  configurarNavegacaoAtiva();
  configurarMenuResponsivo();
  configurarCarrinho();
  renderizarCarrinho();
  atualizarContadorCarrinho();
});
