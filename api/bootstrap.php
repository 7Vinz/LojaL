<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

session_name('loja_leoncio');
session_set_cookie_params([
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();

function responder(int $status, array $dados): never
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

set_exception_handler(function (Throwable $e): void {
    error_log('[LojaL] ' . $e);
    $msg = 'Erro interno. Tente novamente em instantes.';
    if (DEBUG) {
        $msg .= ' [' . $e->getMessage() . ']';
    }
    responder(500, ['erro' => $msg]);
});

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

function metodo(): string
{
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

function entrada(): array
{
    $dados = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($dados) ? $dados : [];
}

function token_csrf(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function exigir_csrf(): void
{
    if (metodo() === 'GET') {
        return;
    }
    $enviado = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!hash_equals(token_csrf(), $enviado)) {
        responder(419, ['erro' => 'Sessão expirada. Recarregue a página e tente de novo.']);
    }
}

function usuario_atual(): ?array
{
    if (empty($_SESSION['uid'])) {
        return null;
    }
    $st = db()->prepare('SELECT id, nome_usuario, email, saldo FROM usuarios WHERE id = ?');
    $st->execute([$_SESSION['uid']]);
    $u = $st->fetch();
    if (!$u) {
        unset($_SESSION['uid']);
        return null;
    }
    return ['id' => (int)$u['id'], 'nome_usuario' => $u['nome_usuario'], 'email' => $u['email'], 'saldo' => (int)$u['saldo']];
}

function exigir_login(): int
{
    $u = usuario_atual();
    if (!$u) {
        responder(401, ['erro' => 'Entre na sua conta para continuar.']);
    }
    return $u['id'];
}