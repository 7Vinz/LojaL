-- Loja do Leôncio — banco de dados MySQL
-- Importe este arquivo uma vez (phpMyAdmin > Importar, ou: mysql -u root -p < database.sql)

CREATE DATABASE IF NOT EXISTS loja_leoncio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loja_leoncio;

-- Logins. A senha é guardada apenas como hash (password_hash do PHP).
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario     VARCHAR(20)  NOT NULL,
  email       VARCHAR(190) NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL,
  saldo       INT UNSIGNED NOT NULL DEFAULT 1300,   -- moedas disponíveis
  criado_em   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_usuario (usuario),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

-- Uma linha por compra finalizada.
CREATE TABLE IF NOT EXISTS pedidos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id  INT UNSIGNED NOT NULL,
  total       INT UNSIGNED NOT NULL,
  criado_em   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pedidos_usuario (usuario_id),
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;

-- Itens de cada compra. Nome e preço são copiados no momento da compra,
-- assim o histórico não muda se os preços forem alterados depois.
CREATE TABLE IF NOT EXISTS pedido_itens (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id       INT UNSIGNED NOT NULL,
  produto_id      VARCHAR(60)  NOT NULL,
  nome            VARCHAR(100) NOT NULL,
  preco_unitario  INT UNSIGNED NOT NULL,
  quantidade      SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_itens_pedido (pedido_id),
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
) ENGINE=InnoDB;
