CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(255) UNIQUE,
  username VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  login_method VARCHAR(20) CHECK (login_method IN ('oauth', 'password')),
  last_signed_in TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rifas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  total_numeros INT NOT NULL,
  valor_numero DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada', 'cancelada')),
  criado_por INT NOT NULL REFERENCES users(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS numeros_rifa (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  numero INT NOT NULL,
  status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'pago')),
  comprador_nome VARCHAR(255),
  comprador_telefone VARCHAR(50),
  reservado_em TIMESTAMP,
  pago_em TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  numero_id INT NOT NULL REFERENCES numeros_rifa(id),
  comprador_nome VARCHAR(255) NOT NULL,
  comprador_telefone VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id SERIAL PRIMARY KEY,
  rifa_id INT NOT NULL REFERENCES rifas(id),
  reserva_id INT REFERENCES reservas(id),
  comprador_nome VARCHAR(255) NOT NULL,
  comprador_telefone VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  pix_code TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
