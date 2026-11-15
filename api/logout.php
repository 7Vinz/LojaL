<?php
require __DIR__ . '/config.php';

exigir_post();
$_SESSION = [];
session_destroy();
responder(['ok' => true]);
