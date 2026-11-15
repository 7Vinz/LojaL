<?php
require __DIR__ . '/config.php';

$u = usuario_logado();
responder($u ? ['logado' => true, 'usuario' => $u] : ['logado' => false]);
