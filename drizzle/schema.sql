-- Apaga as tabelas antigas (ordem importa por causa das dependências)
DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS numeros_rifa;
DROP TABLE IF EXISTS rifas;
DROP TABLE IF EXISTS users;

-- Recria as tabelas com todos os campos corretos

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(255) UNIQUE,
  username VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  login_method VARCHAR(20),
  last_signed_in TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rifas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  regras TEXT,
  total_numeros INT NOT NULL,
  valor_numero DECIMAL(10, 2) NOT NULL,
  pix_chave VARCHAR(255),
  pix_qr_code TEXT,
  tempo_reserva_minutos INT DEFAULT 30,
  imagem_url TEXT,
  status VARCHAR(20) DEFAULT 'ativa',
  criado_por INT NOT NULL REFERENCES users(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE numeros_rifa (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  numero INT NOT NULL,
  status VARCHAR(20) DEFAULT 'disponivel',
  reserva_nome VARCHAR(255),
  reserva_whatsapp VARCHAR(50),
  reserva_expira_em TIMESTAMP,
  pago_em TIMESTAMP
);

CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  numero_id INT NOT NULL REFERENCES numeros_rifa(id),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_whatsapp VARCHAR(50) NOT NULL,
  cliente_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pendente',
  expira_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  numero_id INT REFERENCES numeros_rifa(id),
  reserva_id INT REFERENCES reservas(id),
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_whatsapp VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  confirmado_em TIMESTAMP,
  confirmado_por INT REFERENCES users(id),
  observacao_admin TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Recria o admin (senha: Rifa.Wanderlei)
INSERT INTO users (username, password_hash, name, role, login_method, last_signed_in, created_at)
VALUES (
  'admin',
  'f987f9269ae5e10c5cc595bcb8707bb222248dca3004f582c93663fbfd819f70',
  'Administrador',
  'admin',
  'password',
  NOW(),
  NOW()
);
