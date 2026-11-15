<?php
require __DIR__ . '/config.php';

$usuario = usuario_logado();
if (!$usuario) {
    responder(['erro' => 'Faça login para ver seus pedidos.'], 401);
}

$pdo = conectar();
$st  = $pdo->prepare('SELECT id, total, criado_em FROM pedidos WHERE usuario_id = ? ORDER BY id DESC LIMIT 20');
$st->execute([$usuario['id']]);
$pedidos = $st->fetchAll();

if ($pedidos) {
    $ids = array_column($pedidos, 'id');
    $marcadores = implode(',', array_fill(0, count($ids), '?'));
    $st = $pdo->prepare(
        "SELECT pedido_id, nome, preco_unitario, quantidade FROM pedido_itens WHERE pedido_id IN ($marcadores) ORDER BY id"
    );
    $st->execute($ids);

    $porPedido = [];
    foreach ($st->fetchAll() as $item) {
        $porPedido[$item['pedido_id']][] = [
            'nome'           => $item['nome'],
            'preco_unitario' => (int) $item['preco_unitario'],
            'quantidade'     => (int) $item['quantidade'],
        ];
    }
    foreach ($pedidos as &$p) {
        $p['id']    = (int) $p['id'];
        $p['total'] = (int) $p['total'];
        $p['itens'] = $porPedido[$p['id']] ?? [];
    }
    unset($p);
}

responder(['pedidos' => $pedidos]);
