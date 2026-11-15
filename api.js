/* Funções compartilhadas entre index.html e login.html */

// Chama o PHP. Sem "corpo" faz GET; com "corpo" faz POST em JSON.
async function api(url, corpo) {
  const opcoes = { credentials: "same-origin" };
  if (corpo !== undefined) {
    opcoes.method = "POST";
    opcoes.headers = { "Content-Type": "application/json", "X-Requested-With": "fetch" };
    opcoes.body = JSON.stringify(corpo);
  }

  let resposta;
  try {
    resposta = await fetch(url, opcoes);
  } catch {
    throw new Error("Não foi possível falar com o servidor. Abra o site por um servidor PHP (ex.: http://localhost).");
  }

  const dados = await resposta.json().catch(() => null);
  if (!dados) throw new Error("O servidor não respondeu como esperado. O PHP está rodando?");
  if (!resposta.ok) {
    const erro = new Error(dados.erro || "Erro inesperado.");
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
