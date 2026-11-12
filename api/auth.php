<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
exigir_csrf();

$acao = $_GET['acao'] ?? '';

function iniciar_sessao_do_usuario(int $id): void
{
    session_regenerate_id(true);
    $_SESSION['uid'] = $id;
}

if ($acao === 'me' && metodo() === 'GET') {
    $u = usuario_atual();
    responder(200, ['logado' => $u !== null, 'usuario' => $u, 'csrf' => token_csrf()]);
}

if ($acao === 'registrar' && metodo() === 'POST') {
    $d     = entrada();
    $nome  = trim((string)($d['nome_usuario'] ?? ''));
    $email = strtolower(trim((string)($d['email'] ?? '')));
    $senha = (string)($d['senha'] ?? '');

    if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $nome)) {
        responder(422, ['erro' => 'O nome de usuário deve ter de 3 a 20 caracteres: letras, números ou _.']);
    }
    if (strlen($email) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(422, ['erro' => 'Informe um e-mail válido, como nome@gmail.com.']);
    }
    if (strlen($senha) < 8 || strlen($senha) > 72) {
        responder(422, ['erro' => 'A senha deve ter de 8 a 72 caracteres.']);
    }

    $st = db()->prepare('SELECT nome_usuario, email FROM usuarios WHERE nome_usuario = ? OR email = ?');
    $st->execute([$nome, $email]);
    foreach ($st->fetchAll() as $existente) {
        if (strcasecmp($existente['email'], $email) === 0) {
            responder(409, ['erro' => 'Já existe uma conta com este e-mail.']);
        }
        responder(409, ['erro' => 'Este nome de usuário já está em uso.']);
    }

    try {
        $st = db()->prepare('INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES (?, ?, ?)');
        $st->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            responder(409, ['erro' => 'Nome de usuário ou e-mail já cadastrado.']);
        }
        throw $e;
    }

    iniciar_sessao_do_usuario((int)db()->lastInsertId());
    responder(201, ['usuario' => usuario_atual(), 'csrf' => token_csrf()]);
}

if ($acao === 'entrar' && metodo() === 'POST') {
    $d   = entrada();
    $ident = trim((string)($d['identificador'] ?? ''));
    $senha = (string)($d['senha'] ?? '');
    if ($ident === '' || $senha === '') {
        responder(422, ['erro' => 'Informe e-mail ou nome de usuário e a senha.']);
    }
    $ident = strtolower(substr($ident, 0, 120));

    $st = db()->prepare('SELECT COUNT(*) FROM tentativas_login WHERE identificador = ? AND criado_em > (NOW() - INTERVAL 15 MINUTE)');
    $st->execute([$ident]);
    if ((int)$st->fetchColumn() >= 5) {
        responder(429, ['erro' => 'Muitas tentativas. Aguarde 15 minutos e tente novamente.']);
    }

    $st = db()->prepare('SELECT id, senha_hash FROM usuarios WHERE email = ? OR nome_usuario = ? LIMIT 1');
    $st->execute([$ident, $ident]);
    $u = $st->fetch();

    $hash = $u['senha_hash'] ?? '$2y$10$usesomesillystringforsalt.abcdefghijklmnopqrstuvwxyz012';
    if (!password_verify($senha, $hash) || !$u) {
        db()->prepare('INSERT INTO tentativas_login (identificador) VALUES (?)')->execute([$ident]);
        responder(401, ['erro' => 'E-mail, usuário ou senha incorretos.']);
    }

    db()->prepare('DELETE FROM tentativas_login WHERE identificador = ?')->execute([$ident]);
    if (password_needs_rehash($u['senha_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?')
            ->execute([password_hash($senha, PASSWORD_DEFAULT), $u['id']]);
    }
    iniciar_sessao_do_usuario((int)$u['id']);
    responder(200, ['usuario' => usuario_atual(), 'csrf' => token_csrf()]);
}

if ($acao === 'sair' && metodo() === 'POST') {
    $_SESSION = [];
    session_regenerate_id(true);
    responder(200, ['ok' => true, 'csrf' => token_csrf()]);
}

responder(404, ['erro' => 'Ação inválida.']);
