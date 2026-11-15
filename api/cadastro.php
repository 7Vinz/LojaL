<?php
require __DIR__ . '/config.php';

$corpo   = exigir_post();
$usuario = trim((string) ($corpo['usuario'] ?? ''));
$email   = strtolower(trim((string) ($corpo['email'] ?? '')));
$senha   = (string) ($corpo['senha'] ?? '');

if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $usuario)) {
    responder(['erro' => 'O nome de usuário deve ter de 3 a 20 caracteres: letras, números ou _.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    responder(['erro' => 'Informe um e-mail válido.'], 422);
}
if (strlen($senha) < 8) {
    responder(['erro' => 'A senha deve ter pelo menos 8 caracteres.'], 422);
}

$pdo = conectar();

$st = $pdo->prepare('SELECT usuario, email FROM usuarios WHERE usuario = ? OR email = ?');
$st->execute([$usuario, $email]);
foreach ($st->fetchAll() as $existente) {
    if (strcasecmp($existente['usuario'], $usuario) === 0) {
        responder(['erro' => 'Esse nome de usuário já está em uso.'], 409);
    }
    responder(['erro' => 'Já existe uma conta com esse e-mail.'], 409);
}

try {
    $pdo->prepare('INSERT INTO usuarios (usuario, email, senha_hash, saldo) VALUES (?, ?, ?, ?)')
        ->execute([$usuario, $email, password_hash($senha, PASSWORD_DEFAULT), SALDO_INICIAL]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') { // duplicado criado por outra requisição ao mesmo tempo
        responder(['erro' => 'Usuário ou e-mail já cadastrado.'], 409);
    }
    throw $e;
}

iniciar_sessao((int) $pdo->lastInsertId());
responder(['ok' => true, 'usuario' => usuario_logado()], 201);
