# Loja do Leôncio

Loja com login, sacola salva no banco e pagamento com moedas.
Front-end em HTML/CSS/JS, back-end em PHP 8.1+ e banco MySQL/MariaDB.

## Como rodar

1. Instale o XAMPP (ou outro Apache + PHP 8.1+ + MySQL/MariaDB) e copie esta pasta para `htdocs/LojaL`.
2. Importe o banco (cria `loja_leoncio`, as tabelas e os produtos):
   ```
   mysql -u root -p < database/schema.sql
   ```
   Ou use o phpMyAdmin: aba **Importar** → `database/schema.sql`.
3. Se o seu MySQL tiver senha, ajuste `api/config.php`.
4. Mantenha a pasta `imgs/` ao lado do `index.html`.
5. Abra `http://localhost/LojaL/` e crie uma conta.

> Abrir o `index.html` direto do disco (file://) não funciona: o PHP precisa ser servido pelo Apache.

## Estrutura

| Arquivo | Função |
|---|---|
| `login.html`, `login.js` | Entrar (e-mail ou usuário) e criar conta |
| `api.js` | Cliente da API (sessão, token CSRF, erros) |
| `script.js` | Catálogo, sacola, pagamento, contato |
| `api/auth.php` | Registro, login, logout, sessão atual |
| `api/produtos.php` | Lista de produtos |
| `api/carrinho.php` | Ver, adicionar, alterar quantidade e remover |
| `api/checkout.php` | Pagamento com transação no banco |
| `api/contato.php` | Salva mensagens do formulário |
| `database/schema.sql` | Tabelas e produtos iniciais |

## Segurança já incluída

- Senhas com `password_hash` (bcrypt); consultas com PDO e *prepared statements*.
- Token CSRF em toda requisição que altera dados; sessão com cookie `HttpOnly` + `SameSite`.
- Bloqueio de 15 min após 5 logins errados.
- O pagamento recalcula o total no servidor e trava o saldo (`FOR UPDATE`), evitando gasto duplo.
- Todo texto vindo do banco é escapado antes de ir para o HTML.

Antes de publicar: use HTTPS, crie um usuário MySQL próprio (não `root`) e não exponha `api/config.php`.

## Próximos passos possíveis

- **Entrar com Google:** exige criar credenciais OAuth no Google Cloud.
- **Pagamento em dinheiro real (Pix/cartão):** integrar Mercado Pago, Stripe etc. em `api/checkout.php`; a coluna `forma_pagamento` já existe em `pedidos`.
