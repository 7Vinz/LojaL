const abas = document.querySelectorAll(".auth-aba");
const formEntrar = document.getElementById("form-entrar");
const formRegistrar = document.getElementById("form-registrar");
const erroEl = document.getElementById("auth-erro");

function mostrarErro(mensagem) {
  erroEl.textContent = mensagem;
  erroEl.hidden = !mensagem;
}

function trocarAba(nome) {
  abas.forEach((aba) => {
    const ativa = aba.dataset.aba === nome;
    aba.classList.toggle("ativa", ativa);
    aba.setAttribute("aria-selected", ativa);
  });
  formEntrar.hidden = nome !== "entrar";
  formRegistrar.hidden = nome !== "registrar";
  mostrarErro("");
}

abas.forEach((aba) => aba.addEventListener("click", () => trocarAba(aba.dataset.aba)));

document.querySelectorAll(".mostrar-senha").forEach((caixa) => {
  caixa.addEventListener("change", () => {
    caixa.closest("form").querySelectorAll("input[data-senha]").forEach((i) => {
      i.type = caixa.checked ? "text" : "password";
    });
  });
});

async function enviar(form, acao, corpo) {
  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  mostrarErro("");
  try {
    await api(`api/auth.php?acao=${acao}`, { metodo: "POST", corpo });
    window.location.href = "index.html";
  } catch (erro) {
    mostrarErro(erro.message);
    botao.disabled = false;
  }
}

formEntrar.addEventListener("submit", (e) => {
  e.preventDefault();
  enviar(formEntrar, "entrar", {
    identificador: formEntrar.identificador.value,
    senha: formEntrar.senha.value,
  });
});

formRegistrar.addEventListener("submit", (e) => {
  e.preventDefault();
  if (formRegistrar.senha.value !== formRegistrar.confirmar.value) {
    mostrarErro("As senhas não são iguais.");
    return;
  }
  enviar(formRegistrar, "registrar", {
    nome_usuario: formRegistrar.nome_usuario.value,
    email: formRegistrar.email.value,
    senha: formRegistrar.senha.value,
  });
});

(async () => {
  try {
    if (await carregarSessao()) {
      window.location.href = "index.html";
      return;
    }
  } catch (erro) {
    mostrarErro(erro.message);
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("aviso") === "carrinho") {
    document.getElementById("auth-aviso").hidden = false;
  }
  if (params.get("aba") === "registrar") trocarAba("registrar");
})();
