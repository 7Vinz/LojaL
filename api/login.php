<?php
require __DIR__ . '/config.php';

$corpo         = exigir_post();
$identificador = strtolower(trim((string) ($corpo['identificador'] ?? ''))); // e-mail OU nome de usuário
$senha         = (string) ($corpo['senha'] ?? '');

if ($identificador === '' || $senha === '') {
    responder(['erro' => 'Informe seu e-mail ou usuário e a senha.'], 422);
}

$st = conectar()->prepare('SELECT id, senha_hash FROM usuarios WHERE email = ? OR usuario = ? LIMIT 1');
$st->execute([$identificador, $identificador]);
$conta = $st->fetch();

if (!$conta || !password_verify($senha, $conta['senha_hash'])) {
    responder(['erro' => 'Usuário/e-mail ou senha incorretos.'], 401);
}

iniciar_sessao((int) $conta['id']);
responder(['ok' => true, 'usuario' => usuario_logado()]);
