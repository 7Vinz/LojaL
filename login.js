/* Tela de login / cadastro */

const $ = (id) => document.getElementById(id);
const statusEl = $("login-status");

// Para onde voltar depois de entrar (só valores conhecidos, nada vindo livre da URL)
const voltar = new URLSearchParams(location.search).get("voltar");
const DESTINO = ["carrinho", "produtos", "pedidos"].includes(voltar) ? `index.html#${voltar}` : "index.html";

function mostrarMensagem(texto, tipo) {
  statusEl.textContent = texto;
  statusEl.className = "status-formulario " + (tipo || "");
}

function trocarAba(entrar) {
  $("aba-entrar").setAttribute("aria-selected", entrar);
  $("aba-cadastro").setAttribute("aria-selected", !entrar);
  $("form-login").hidden = !entrar;
  $("form-cadastro").hidden = entrar;
  mostrarMensagem("");
}

$("aba-entrar").addEventListener("click", () => trocarAba(true));
$("aba-cadastro").addEventListener("click", () => trocarAba(false));

async function enviar(form, url, corpo) {
  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  mostrarMensagem("Aguarde…");
  try {
    await api(url, corpo);
    mostrarMensagem("Tudo certo! Entrando na loja…", "sucesso");
    location.href = DESTINO;
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
    botao.disabled = false;
  }
}

$("form-login").addEventListener("submit", (e) => {
  e.preventDefault();
  const identificador = $("login-identificador").value.trim();
  const senha = $("login-senha").value;
  if (!identificador || !senha) return mostrarMensagem("Informe seu e-mail ou usuário e a senha.", "erro");
  enviar(e.target, "api/login.php", { identificador, senha });
});

$("form-cadastro").addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = $("cadastro-usuario").value.trim();
  const email = $("cadastro-email").value.trim();
  const senha = $("cadastro-senha").value;

  if (!/^[A-Za-z0-9_]{3,20}$/.test(usuario)) return mostrarMensagem("O nome de usuário deve ter de 3 a 20 caracteres: letras, números ou _.", "erro");
  if (!/^\S+@\S+\.\S+$/.test(email)) return mostrarMensagem("Informe um e-mail válido.", "erro");
  if (senha.length < 8) return mostrarMensagem("A senha deve ter pelo menos 8 caracteres.", "erro");
  if (senha !== $("cadastro-senha2").value) return mostrarMensagem("As senhas não são iguais.", "erro");

  enviar(e.target, "api/cadastro.php", { usuario, email, senha });
});

// Quem já está logado não precisa ver esta tela
api("api/sessao.php").then((d) => { if (d.logado) location.href = DESTINO; }).catch(() => {});
