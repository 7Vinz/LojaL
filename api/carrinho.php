<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
exigir_csrf();
$uid = exigir_login();

const MAX_POR_ITEM = 99;

function carrinho_atual(int $uid): array
{
    $st = db()->prepare(
        'SELECT c.produto_id, c.quantidade, p.nome, p.imagem, p.preco
           FROM carrinho_itens c JOIN produtos p ON p.id = c.produto_id
          WHERE c.usuario_id = ? ORDER BY p.ordem'
    );
    $st->execute([$uid]);
    $itens = []; $total = 0; $qtd = 0;
    foreach ($st->fetchAll() as $l) {
        $item = [
            'produto_id' => $l['produto_id'], 'nome' => $l['nome'], 'imagem' => $l['imagem'],
            'preco' => (int)$l['preco'], 'quantidade' => (int)$l['quantidade'],
        ];
        $total += $item['preco'] * $item['quantidade'];
        $qtd   += $item['quantidade'];
        $itens[] = $item;
    }
    return ['itens' => $itens, 'total' => $total, 'quantidade' => $qtd];
}

function produto_existe(string $id): bool
{
    $st = db()->prepare('SELECT 1 FROM produtos WHERE id = ?');
    $st->execute([$id]);
    return (bool)$st->fetchColumn();
}

switch (metodo()) {
    case 'GET':
        responder(200, carrinho_atual($uid));

    case 'POST':
        $d  = entrada();
        $id = (string)($d['produto_id'] ?? '');
        $q  = max(1, min(MAX_POR_ITEM, (int)($d['quantidade'] ?? 1)));
        if (!produto_existe($id)) {
            responder(404, ['erro' => 'Produto não encontrado.']);
        }
        db()->prepare(
            'INSERT INTO carrinho_itens (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantidade = LEAST(quantidade + VALUES(quantidade), ' . MAX_POR_ITEM . ')'
        )->execute([$uid, $id, $q]);
        responder(200, carrinho_atual($uid));

    case 'PUT':
        $d  = entrada();
        $id = (string)($d['produto_id'] ?? '');
        $q  = max(0, min(MAX_POR_ITEM, (int)($d['quantidade'] ?? 0)));
        if ($q === 0) {
            db()->prepare('DELETE FROM carrinho_itens WHERE usuario_id = ? AND produto_id = ?')->execute([$uid, $id]);
        } else {
            db()->prepare('UPDATE carrinho_itens SET quantidade = ? WHERE usuario_id = ? AND produto_id = ?')
                ->execute([$q, $uid, $id]);
        }
        responder(200, carrinho_atual($uid));

    case 'DELETE':
        $id = (string)($_GET['produto_id'] ?? '');
        db()->prepare('DELETE FROM carrinho_itens WHERE usuario_id = ? AND produto_id = ?')->execute([$uid, $id]);
        responder(200, carrinho_atual($uid));

    default:
        responder(405, ['erro' => 'Método não permitido.']);
}
