-- Loja do Leôncio — esquema MySQL / MariaDB
-- Importe com:  mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS loja_leoncio
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE loja_leoncio;

CREATE TABLE IF NOT EXISTS usuarios (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome_usuario VARCHAR(20)  NOT NULL,
  email        VARCHAR(120) NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  saldo        INT UNSIGNED NOT NULL DEFAULT 1300,  -- moedas
  criado_em    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_nome  (nome_usuario),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS produtos (
  id              VARCHAR(60)  NOT NULL,
  nome            VARCHAR(80)  NOT NULL,
  categoria       VARCHAR(40)  NOT NULL,
  imagem          VARCHAR(120) NOT NULL,
  preco           INT UNSIGNED NOT NULL,
  descricao       TEXT         NOT NULL,
  disponibilidade VARCHAR(40)  NOT NULL DEFAULT 'Em estoque',
  avaliacao       DECIMAL(2,1) NOT NULL DEFAULT 0,
  num_avaliacoes  INT UNSIGNED NOT NULL DEFAULT 0,
  destaque        TINYINT(1)   NOT NULL DEFAULT 0,
  ordem           INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carrinho_itens (
  usuario_id INT UNSIGNED     NOT NULL,
  produto_id VARCHAR(60)      NOT NULL,
  quantidade TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (usuario_id, produto_id),
  CONSTRAINT fk_carrinho_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
  CONSTRAINT fk_carrinho_produto FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id      INT UNSIGNED NOT NULL,
  total           INT UNSIGNED NOT NULL,
  forma_pagamento VARCHAR(20)  NOT NULL DEFAULT 'moedas',
  status          ENUM('pago','cancelado') NOT NULL DEFAULT 'pago',
  criado_em       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedido_itens (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id      INT UNSIGNED NOT NULL,
  produto_id     VARCHAR(60)  NOT NULL,
  nome           VARCHAR(80)  NOT NULL,
  preco_unitario INT UNSIGNED NOT NULL,
  quantidade     TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NULL,
  nome       VARCHAR(80)  NOT NULL,
  email      VARCHAR(120) NOT NULL,
  mensagem   TEXT         NOT NULL,
  criado_em  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_contato_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tentativas_login (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  identificador VARCHAR(120) NOT NULL,
  criado_em     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tentativas (identificador, criado_em)
) ENGINE=InnoDB;

INSERT IGNORE INTO produtos (id, nome, categoria, imagem, preco, descricao, disponibilidade, avaliacao, num_avaliacoes, destaque, ordem) VALUES
('abatedora', 'Abatedora', 'Itens Iniciais', 'imgs/Abatedora.webp', 450, 'Uma lâmina simples, mas afiada o bastante para abrir vantagem nos primeiros minutos de luta.', 'Em estoque', 4.9, 123, 0, 1),
('anel-de-doran', 'Anel de Doran', 'Itens Iniciais', 'imgs/Anel.jpeg', 400, 'Um anel modesto que canaliza poder mágico contínuo para conjuradores em início de partida.', 'Em estoque', 4.9, 123, 0, 2),
('arco-de-doran', 'Arco de Doran', 'Itens Iniciais', 'imgs/Arco.jpeg', 400, 'Reforça o ataque à distância, ideal para atiradores que buscam pressão constante na rota.', 'Em estoque', 4.9, 123, 0, 3),
('atlas-mundial', 'Atlas Mundial', 'Itens Iniciais', 'imgs/Mapinha.jpeg', 400, 'Um mapa antigo de Runeterra que revela caminhos e recompensa exploração pela selva.', 'Em estoque', 4.9, 123, 0, 4),
('elmo-de-doran', 'Elmo de Doran', 'Itens Iniciais', 'imgs/Elmo.jpeg', 450, 'Proteção extra para quem pretende iniciar as lutas em vez de apenas sobreviver a elas.', 'Em estoque', 4.9, 123, 0, 5),
('escudo-de-doran', 'Escudo de Doran', 'Itens Iniciais', 'imgs/Escudo.jpeg', 450, 'Um escudo robusto que regenera vida com o tempo, perfeito para rotas de troca intensa.', 'Em estoque', 4.9, 123, 0, 6),
('lacre-sombrio', 'Lacre Sombrio', 'Itens Iniciais', 'imgs/Lacre.jpeg', 350, 'Um artefato sombrio que se fortalece a cada abate, favorecendo jogadores agressivos.', 'Em estoque', 4.9, 123, 0, 7),
('lagrima-da-deusa', 'Lágrima da Deusa', 'Itens Iniciais', 'imgs/Lagrima.jpeg', 400, 'Uma relíquia rara que converte o uso de habilidades em recurso mágico permanente.', 'Em estoque', 4.9, 123, 1, 8),
('lamina-de-doran', 'Lâmina de Doran', 'Itens Iniciais', 'imgs/Lamina.webp', 450, 'Equilibra dano e resistência, a escolha clássica de duelistas de corpo a corpo.', 'Em estoque', 4.9, 123, 0, 9),
('bota-comum', 'Bota Comum', 'Botas', 'imgs/Bota.jpeg', 300, 'O primeiro passo de qualquer jornada por Runeterra: velocidade básica de movimento.', 'Em estoque', 4.9, 123, 0, 10),
('botas-da-rapidez', 'Botas da Rapidez', 'Botas', 'imgs/Rapidez.jpeg', 1000, 'Couro encantado que garante o maior bônus de velocidade entre todas as botas.', 'Em estoque', 4.9, 123, 0, 11),
('galvanizadas-de-aco', 'Galvanizadas de Aço', 'Botas', 'imgs/Galvanizadas.jpeg', 1200, 'Placas reforçadas que absorvem parte do dano físico recebido em combate prolongado.', 'Em estoque', 4.9, 123, 0, 12),
('grevas-do-berserker', 'Grevas do Berserker', 'Botas', 'imgs/Berserker.jpeg', 1100, 'Acelera o ritmo dos ataques, favorito de quem vive do dano físico contínuo.', 'Em estoque', 4.9, 123, 0, 13),
('grevas-vorazes', 'Grevas Vorazes', 'Botas', 'imgs/Vorazes.jpeg', 1000, 'Um upgrade simples e direto que recompensa o abate de monstros e inimigos.', 'Em estoque', 4.9, 123, 0, 14),
('ionianas-da-lucidez', 'Ionianas da Lucidez', 'Botas', 'imgs/Ionianas.jpeg', 900, 'Reduz o tempo de espera das habilidades, essencial para conjuradores versáteis.', 'Em estoque', 4.9, 123, 0, 15),
('passos-de-mercurio', 'Passos de Mercúrio', 'Botas', 'imgs/Mercurio.jpeg', 1250, 'Forjadas em Piltover, reduzem efeitos de controle e protegem contra magia.', 'Em estoque', 4.9, 123, 1, 16),
('sapatos-do-feiticeiro', 'Sapatos do Feiticeiro', 'Botas', 'imgs/Feiticeiro.jpeg', 1100, 'Costurados com fios arcanos que ampliam o poder de qualquer magia lançada.', 'Em estoque', 4.9, 123, 0, 17),
('filhote-de-andabrisas', 'Filhote de Andabrisas', 'Pets da Selva', 'imgs/Brisa.jpeg', 450, 'Um companheiro alado dócil que acompanha o invocador em suas incursões pela selva.', 'Estoque limitado', 4.9, 123, 1, 18),
('filhote-de-esmagamusgo', 'Filhote de Esmagamusgo', 'Pets da Selva', 'imgs/Musgo.jpeg', 450, 'Pequeno e resistente, gosta de esmagar tudo o que encontra pelo caminho.', 'Estoque limitado', 4.9, 123, 0, 19),
('filhote-de-garrabrasa', 'Filhote de Garrabrasa', 'Pets da Selva', 'imgs/Brasa.jpeg', 450, 'Aquecido por brasas internas, ilumina o caminho nos cantos mais escuros da selva.', 'Estoque limitado', 4.9, 123, 0, 20),
('pocao-de-mana', 'Poção de Mana', 'Poções', 'imgs/PotMana.webp', 50, 'Restaura uma quantidade de mana ao longo de alguns segundos. Item básico de sobrevivência.', 'Em estoque', 4.9, 123, 0, 21),
('pocao-de-vida', 'Poção de Vida', 'Poções', 'imgs/PotVida.webp', 50, 'Restaura uma quantidade de vida ao longo de alguns segundos. Nunca saia da loja sem uma.', 'Em estoque', 4.9, 123, 1, 22);
