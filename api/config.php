<?php
// Credenciais do MySQL. Ajuste para o seu ambiente (ou defina variáveis de ambiente).
// Em produção, nunca use o usuário "root": crie um usuário só com permissão neste banco.
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: 'loja_leoncio');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
