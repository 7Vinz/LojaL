<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if (metodo() !== 'GET') {
    responder(405, ['erro' => 'Método não permitido.']);
}

$linhas = db()->query(
    'SELECT id, nome, categoria, imagem, preco, descricao, disponibilidade, avaliacao, num_avaliacoes, destaque
       FROM produtos ORDER BY ordem'
)->fetchAll();

responder(200, ['produtos' => array_map(fn($p) => [
    'id'              => $p['id'],
    'nome'            => $p['nome'],
    'categoria'       => $p['categoria'],
    'imagem'          => $p['imagem'],
    'preco'           => (int)$p['preco'],
    'descricao'       => $p['descricao'],
    'disponibilidade' => $p['disponibilidade'],
    'avaliacao'       => (float)$p['avaliacao'],
    'numAvaliacoes'   => (int)$p['num_avaliacoes'],
    'destaque'        => (bool)$p['destaque'],
], $linhas)]);
