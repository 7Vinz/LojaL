<?php
declare(strict_types=1);

/* ===== Ajuste aqui os dados do seu MySQL ===== */
const DB_HOST = '127.0.0.1';
const DB_NAME = 'loja_leoncio';
const DB_USER = 'root';
const DB_PASS = '';
/* ============================================== */

const SALDO_INICIAL = 1300; // moedas que cada conta nova recebe (igual ao default do banco)

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(array $dados, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// Qualquer erro inesperado (ex.: MySQL fora do ar) vira uma resposta JSON limpa.
set_exception_handler(function (Throwable $e): void {
    error_log('[Loja do Leôncio] ' . $e->getMessage());
    responder(['erro' => 'Erro no servidor. Confira a conexão com o banco de dados.'], 500);
});

function conectar(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// Exige POST com JSON e o cabeçalho X-Requested-With (protege contra formulários de outros sites).
function exigir_post(): array
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder(['erro' => 'Método não permitido.'], 405);
    }
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'fetch') {
        responder(['erro' => 'Requisição inválida.'], 400);
    }
    $corpo = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($corpo) ? $corpo : [];
}

function usuario_logado(): ?array
{
    if (empty($_SESSION['uid'])) {
        return null;
    }
    $st = conectar()->prepare('SELECT id, usuario, email, saldo FROM usuarios WHERE id = ?');
    $st->execute([$_SESSION['uid']]);
    $u = $st->fetch();
    if (!$u) {
        return null;
    }
    $u['id']    = (int) $u['id'];
    $u['saldo'] = (int) $u['saldo'];
    return $u;
}

function iniciar_sessao(int $idUsuario): void
{
    session_regenerate_id(true);
    $_SESSION['uid'] = $idUsuario;
}
