CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  open_id VARCHAR(255) UNIQUE,
  username VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  login_method ENUM('oauth', 'password'),
  last_signed_in TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rifas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  total_numeros INT NOT NULL,
  valor_numero DECIMAL(10, 2) NOT NULL,
  status ENUM('ativa', 'encerrada', 'cancelada') DEFAULT 'ativa',
  criado_por INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS numeros_rifa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rifa_id INT NOT NULL,
  numero INT NOT NULL,
  status ENUM('disponivel', 'reservado', 'pago') DEFAULT 'disponivel',
  comprador_nome VARCHAR(255),
  comprador_telefone VARCHAR(50),
  reservado_em TIMESTAMP NULL,
  pago_em TIMESTAMP NULL,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id)
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rifa_id INT NOT NULL,
  numero_id INT NOT NULL,
  comprador_nome VARCHAR(255) NOT NULL,
  comprador_telefone VARCHAR(50) NOT NULL,
  status ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id),
  FOREIGN KEY (numero_id) REFERENCES numeros_rifa(id)
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rifa_id INT NOT NULL,
  reserva_id INT,
  comprador_nome VARCHAR(255) NOT NULL,
  comprador_telefone VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
  pix_code TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id),
  FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);
