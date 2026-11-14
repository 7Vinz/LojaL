<?php
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Execute pelo terminal: php instalar.php');
}

function perguntar(string $texto, string $padrao = ''): string
{
    echo $texto . ($padrao !== '' ? " [$padrao]" : '') . ': ';
    $r = trim((string)fgets(STDIN));
    return $r !== '' ? $r : $padrao;
}

echo "== Instalação da Loja do Leôncio ==\n";
$host  = perguntar('Servidor MySQL', '127.0.0.1');
$porta = (int)perguntar('Porta', '3306');
$user  = perguntar('Usuário', 'root');
echo 'Senha (Enter se não tiver; ela aparece enquanto você digita): ';
$senha = rtrim((string)fgets(STDIN), "\r\n");

try {
    $pdo = new PDO("mysql:host=$host;port=$porta;charset=utf8mb4", $user, $senha, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    exit("\nNão foi possível conectar: " . $e->getMessage() . "\nConfira usuário, senha e se o MySQL está ligado.\n");
}

$sql = preg_replace('/^--.*$/m', '', file_get_contents(__DIR__ . '/database/schema.sql'));
try {
    foreach (preg_split('/;\s*\n/', $sql) as $comando) {
        if (trim($comando) !== '') {
            $pdo->exec($comando);
        }
    }
} catch (PDOException $e) {
    exit("\nErro ao importar o banco: " . $e->getMessage() . "\n");
}

$conteudo = "<?php\n"
    . 'define(\'DB_HOST\', ' . var_export($host, true) . ");\n"
    . 'define(\'DB_PORT\', ' . $porta . ");\n"
    . "define('DB_NAME', 'loja_leoncio');\n"
    . 'define(\'DB_USER\', ' . var_export($user, true) . ");\n"
    . 'define(\'DB_PASS\', ' . var_export($senha, true) . ");\n";
file_put_contents(__DIR__ . '/api/config.local.php', $conteudo);

$total = $pdo->query('SELECT COUNT(*) FROM loja_leoncio.produtos')->fetchColumn();
echo "\nPronto! Banco criado com $total produtos e configuração salva.\n";
echo "Agora rode:  php -S localhost:8000   e abra http://localhost:8000/\n";
