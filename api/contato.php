<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if (metodo() !== 'POST') {
    responder(405, ['erro' => 'Método não permitido.']);
}
exigir_csrf();

$d        = entrada();
$nome     = trim((string)($d['nome'] ?? ''));
$email    = trim((string)($d['email'] ?? ''));
$mensagem = trim((string)($d['mensagem'] ?? ''));

if ($nome === '' || $email === '' || $mensagem === '') {
    responder(422, ['erro' => 'Preencha todos os campos antes de enviar.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, ['erro' => 'Informe um e-mail válido.']);
}
if (mb_strlen($nome) > 80 || mb_strlen($email) > 120 || mb_strlen($mensagem) > 2000) {
    responder(422, ['erro' => 'Algum campo ultrapassa o tamanho máximo.']);
}

$u = usuario_atual();
db()->prepare('INSERT INTO mensagens_contato (usuario_id, nome, email, mensagem) VALUES (?, ?, ?, ?)')
    ->execute([$u['id'] ?? null, $nome, $email, $mensagem]);

responder(201, ['ok' => true]);
