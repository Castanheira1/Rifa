import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  openId: varchar("open_id", { length: 255 }).unique(),
  username: varchar("username", { length: 255 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user"),
  loginMethod: mysqlEnum("login_method", ["oauth", "password"]),
  lastSignedIn: timestamp("last_signed_in"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const rifas = mysqlTable("rifas", {
  id: int("id").primaryKey().autoincrement(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  totalNumeros: int("total_numeros").notNull(),
  valorNumero: decimal("valor_numero", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["ativa", "encerrada", "cancelada"]).default("ativa"),
  criadoPor: int("criado_por").notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Rifa = InferSelectModel<typeof rifas>;
export type InsertRifa = InferInsertModel<typeof rifas>;

export const numerosRifa = mysqlTable("numeros_rifa", {
  id: int("id").primaryKey().autoincrement(),
  rifaId: int("rifa_id").notNull(),
  numero: int("numero").notNull(),
  status: mysqlEnum("status", ["disponivel", "reservado", "pago"]).default("disponivel"),
  compradorNome: varchar("comprador_nome", { length: 255 }),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }),
  reservadoEm: timestamp("reservado_em"),
  pagoEm: timestamp("pago_em"),
});

export type NumeroRifa = InferSelectModel<typeof numerosRifa>;
export type InsertNumeroRifa = InferInsertModel<typeof numerosRifa>;

export const reservas = mysqlTable("reservas", {
  id: int("id").primaryKey().autoincrement(),
  rifaId: int("rifa_id").notNull(),
  numeroId: int("numero_id").notNull(),
  compradorNome: varchar("comprador_nome", { length: 255 }).notNull(),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["pendente", "confirmada", "cancelada"]).default("pendente"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Reserva = InferSelectModel<typeof reservas>;
export type InsertReserva = InferInsertModel<typeof reservas>;

export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").primaryKey().autoincrement(),
  rifaId: int("rifa_id").notNull(),
  reservaId: int("reserva_id"),
  compradorNome: varchar("comprador_nome", { length: 255 }).notNull(),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado"]).default("pendente"),
  pixCode: text("pix_code"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Pagamento = InferSelectModel<typeof pagamentos>;
export type InsertPagamento = InferInsertModel<typeof pagamentos>;
