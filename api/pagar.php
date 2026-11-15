<?php
require __DIR__ . '/config.php';

$corpo   = exigir_post();
$usuario = usuario_logado();
if (!$usuario) {
    responder(['erro' => 'Faça login para finalizar a compra.'], 401);
}

$catalogo = require __DIR__ . '/catalogo.php';
$itens    = $corpo['itens'] ?? null;

if (!is_array($itens) || count($itens) === 0 || count($itens) > 100) {
    responder(['erro' => 'Seu carrinho está vazio ou é inválido.'], 400);
}

// Conta as quantidades e calcula o total com os preços DO SERVIDOR.
$quantidades = [];
foreach ($itens as $id) {
    if (!is_string($id) || !isset($catalogo[$id])) {
        responder(['erro' => 'O carrinho contém um item que não existe mais.'], 400);
    }
    $quantidades[$id] = ($quantidades[$id] ?? 0) + 1;
}

$total = 0;
foreach ($quantidades as $id => $qtd) {
    $total += $catalogo[$id]['preco'] * $qtd;
}

$pdo = conectar();
try {
    $pdo->beginTransaction();

    // Trava a linha do usuário para evitar gastar o mesmo saldo em duas compras simultâneas.
    $st = $pdo->prepare('SELECT saldo FROM usuarios WHERE id = ? FOR UPDATE');
    $st->execute([$usuario['id']]);
    $saldo = (int) $st->fetchColumn();

    if ($saldo < $total) {
        $pdo->rollBack();
        responder([
            'erro' => "Saldo insuficiente: você tem 🪙 $saldo e o total é 🪙 $total.",
        ], 402);
    }

    $pdo->prepare('UPDATE usuarios SET saldo = saldo - ? WHERE id = ?')->execute([$total, $usuario['id']]);
    $pdo->prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)')->execute([$usuario['id'], $total]);
    $pedidoId = (int) $pdo->lastInsertId();

    $inserir = $pdo->prepare(
        'INSERT INTO pedido_itens (pedido_id, produto_id, nome, preco_unitario, quantidade) VALUES (?, ?, ?, ?, ?)'
    );
    foreach ($quantidades as $id => $qtd) {
        $inserir->execute([$pedidoId, $id, $catalogo[$id]['nome'], $catalogo[$id]['preco'], $qtd]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

responder(['ok' => true, 'pedido_id' => $pedidoId, 'total' => $total, 'saldo' => $saldo - $total]);
