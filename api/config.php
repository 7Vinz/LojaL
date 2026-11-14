<?php
if (is_file(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
}

defined('DB_HOST') || define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
defined('DB_PORT') || define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
defined('DB_NAME') || define('DB_NAME', getenv('DB_NAME') ?: 'loja_leoncio');
defined('DB_USER') || define('DB_USER', getenv('DB_USER') ?: 'root');
defined('DB_PASS') || define('DB_PASS', getenv('DB_PASS') ?: '');

defined('DEBUG') || define('DEBUG', true);
