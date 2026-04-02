import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 255 }).unique(),
  username: varchar("username", { length: 255 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 20 }).default("user"),
  loginMethod: varchar("login_method", { length: 20 }),
  lastSignedIn: timestamp("last_signed_in"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const rifas = pgTable("rifas", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  totalNumeros: integer("total_numeros").notNull(),
  valorNumero: decimal("valor_numero", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("ativa"),
  criadoPor: integer("criado_por").notNull(),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Rifa = InferSelectModel<typeof rifas>;
export type InsertRifa = InferInsertModel<typeof rifas>;

export const numerosRifa = pgTable("numeros_rifa", {
  id: serial("id").primaryKey(),
  rifaId: integer("rifa_id").notNull(),
  numero: integer("numero").notNull(),
  status: varchar("status", { length: 20 }).default("disponivel"),
  compradorNome: varchar("comprador_nome", { length: 255 }),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }),
  reservadoEm: timestamp("reservado_em"),
  pagoEm: timestamp("pago_em"),
});

export type NumeroRifa = InferSelectModel<typeof numerosRifa>;
export type InsertNumeroRifa = InferInsertModel<typeof numerosRifa>;

export const reservas = pgTable("reservas", {
  id: serial("id").primaryKey(),
  rifaId: integer("rifa_id").notNull(),
  numeroId: integer("numero_id").notNull(),
  compradorNome: varchar("comprador_nome", { length: 255 }).notNull(),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("pendente"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Reserva = InferSelectModel<typeof reservas>;
export type InsertReserva = InferInsertModel<typeof reservas>;

export const pagamentos = pgTable("pagamentos", {
  id: serial("id").primaryKey(),
  rifaId: integer("rifa_id").notNull(),
  reservaId: integer("reserva_id"),
  compradorNome: varchar("comprador_nome", { length: 255 }).notNull(),
  compradorTelefone: varchar("comprador_telefone", { length: 50 }).notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pendente"),
  pixCode: text("pix_code"),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow(),
});

export type Pagamento = InferSelectModel<typeof pagamentos>;
export type InsertPagamento = InferInsertModel<typeof pagamentos>;
