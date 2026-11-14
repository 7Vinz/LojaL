<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if (metodo() !== 'POST') {
    responder(405, ['erro' => 'Método não permitido.']);
}
exigir_csrf();
$uid = exigir_login();

$forma = (string)(entrada()['forma_pagamento'] ?? 'moedas');
if ($forma !== 'moedas') {
    responder(422, ['erro' => 'Forma de pagamento indisponível.']);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $st = $pdo->prepare('SELECT saldo FROM usuarios WHERE id = ? FOR UPDATE');
    $st->execute([$uid]);
    $saldo = (int)$st->fetchColumn();

    $st = $pdo->prepare(
        'SELECT c.produto_id, c.quantidade, p.nome, p.preco
           FROM carrinho_itens c JOIN produtos p ON p.id = c.produto_id
          WHERE c.usuario_id = ?'
    );
    $st->execute([$uid]);
    $itens = $st->fetchAll();

    if (!$itens) {
        $pdo->rollBack();
        responder(400, ['erro' => 'Sua sacola está vazia.']);
    }

    $total = 0;
    foreach ($itens as $i) {
        $total += (int)$i['preco'] * (int)$i['quantidade'];
    }

    if ($saldo < $total) {
        $pdo->rollBack();
        responder(402, ['erro' => 'Saldo insuficiente: faltam ' . ($total - $saldo) . ' moedas.', 'saldo' => $saldo, 'total' => $total]);
    }

    $pdo->prepare('INSERT INTO pedidos (usuario_id, total, forma_pagamento, status) VALUES (?, ?, ?, ?)')
        ->execute([$uid, $total, $forma, 'pago']);
    $pedidoId = (int)$pdo->lastInsertId();

    $ins = $pdo->prepare('INSERT INTO pedido_itens (pedido_id, produto_id, nome, preco_unitario, quantidade) VALUES (?, ?, ?, ?, ?)');
    foreach ($itens as $i) {
        $ins->execute([$pedidoId, $i['produto_id'], $i['nome'], $i['preco'], $i['quantidade']]);
    }

    $pdo->prepare('UPDATE usuarios SET saldo = saldo - ? WHERE id = ?')->execute([$total, $uid]);
    $pdo->prepare('DELETE FROM carrinho_itens WHERE usuario_id = ?')->execute([$uid]);
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

responder(200, ['pedido_id' => $pedidoId, 'total' => $total, 'saldo' => $saldo - $total]);
