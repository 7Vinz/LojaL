const sessao = { usuario: null, csrf: "" };

class ApiErro extends Error {
  constructor(mensagem, status, dados = {}) {
    super(mensagem);
    this.status = status;
    this.dados = dados;
  }
}

async function api(url, { metodo = "GET", corpo, tentarDeNovo = true } = {}) {
  const opcoes = { method: metodo, credentials: "same-origin", headers: { Accept: "application/json" } };
  if (metodo !== "GET") opcoes.headers["X-CSRF-Token"] = sessao.csrf;
  if (corpo !== undefined) {
    opcoes.headers["Content-Type"] = "application/json";
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(url, opcoes);
  } catch {
    throw new ApiErro("Sem conexão com o servidor. Verifique se o PHP e o MySQL estão em execução.", 0);
  }

  let dados = {};
  try { dados = await resposta.json(); } catch {  }

  if (resposta.status === 419 && tentarDeNovo) {
    await carregarSessao();
    return api(url, { metodo, corpo, tentarDeNovo: false });
  }
  if (!resposta.ok) throw new ApiErro(dados.erro || "Erro inesperado. Tente novamente.", resposta.status, dados);
  return dados;
}

async function carregarSessao() {
  const dados = await api("api/auth.php?acao=me");
  sessao.usuario = dados.usuario;
  sessao.csrf = dados.csrf;
  return sessao.usuario;
}

function esc(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
