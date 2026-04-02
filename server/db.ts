import { eq, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  InsertUser,
  users,
  InsertRifa,
  InsertNumeroRifa,
  InsertReserva,
  InsertPagamento,
  numerosRifa,
  reservas,
  pagamentos,
  rifas,
  Rifa,
  NumeroRifa,
  Reserva,
  Pagamento,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL as string);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Users queries
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAdmins() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "admin"));
}

/**
 * Rifas queries
 */
export async function getRifasAtivas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rifas).where(eq(rifas.status, "ativa"));
}

export async function getRifaById(rifaId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rifas).where(eq(rifas.id, rifaId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRifasByAdmin(adminId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rifas).where(eq(rifas.criadoPor, adminId));
}

export async function createRifa(data: InsertRifa) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rifas).values(data);
  return result;
}

export async function updateRifa(rifaId: number, data: Partial<InsertRifa>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(rifas).set(data).where(eq(rifas.id, rifaId));
}

export async function deleteRifa(rifaId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(rifas).where(eq(rifas.id, rifaId));
}

/**
 * Números Rifa queries
 */
export async function getNumerosRifa(rifaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(numerosRifa).where(eq(numerosRifa.rifaId, rifaId));
}

export async function getNumeroById(numeroId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(numerosRifa).where(eq(numerosRifa.id, numeroId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNumerosRifa(rifaId: number, totalNumeros: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const valores = Array.from({ length: totalNumeros }, (_, i) => ({
    rifaId,
    numero: i + 1,
    status: "disponivel" as const,
  }));
  return db.insert(numerosRifa).values(valores);
}

export async function updateNumeroStatus(numeroId: number, status: string, data?: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(numerosRifa).set({ status, ...data }).where(eq(numerosRifa.id, numeroId));
}

export async function getNumeroDisponivel(rifaId: number, numero: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(numerosRifa)
    .where(and(eq(numerosRifa.rifaId, rifaId), eq(numerosRifa.numero, numero)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Reservas queries
 */
export async function createReserva(data: InsertReserva) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reservas).values(data);
}

export async function getReservasPendentes(rifaId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (rifaId) {
    return db.select().from(reservas).where(eq(reservas.status, "pendente"));
  }
  return db.select().from(reservas).where(eq(reservas.status, "pendente"));
}

export async function getReservaById(reservaId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reservas).where(eq(reservas.id, reservaId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateReserva(reservaId: number, data: Partial<InsertReserva>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(reservas).set(data).where(eq(reservas.id, reservaId));
}

/**
 * Pagamentos queries
 */
export async function createPagamento(data: InsertPagamento) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(pagamentos).values(data);
}

export async function getPagamentosPendentes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pagamentos).where(eq(pagamentos.status, "pendente"));
}

export async function getPagamentoById(pagamentoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pagamentos).where(eq(pagamentos.id, pagamentoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePagamento(pagamentoId: number, data: Partial<InsertPagamento>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(pagamentos).set(data).where(eq(pagamentos.id, pagamentoId));
}

export async function getPagamentosByRifa(rifaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pagamentos).where(eq(pagamentos.rifaId, rifaId));
}

/**
 * Dashboard queries
 */
export async function getDashboardStats(adminId: number) {
  const db = await getDb();
  if (!db) return null;

  const adminRifas = await db.select().from(rifas).where(eq(rifas.criadoPor, adminId));
  const rifaIds = adminRifas.map((r) => r.id);

  if (rifaIds.length === 0) {
    return {
      totalRifas: 0,
      rifasAtivas: 0,
      numerosVendidos: 0,
      receitaTotal: 0,
      pagamentosPendentes: 0,
    };
  }

  // Count active raffles
  const rifasAtivas = adminRifas.filter((r) => r.status === "ativa").length;

  // Count sold numbers
  const todosNumeros = await db
    .select()
    .from(numerosRifa)
    .where(eq(numerosRifa.rifaId, rifaIds[0]));

  const numerosPagos = todosNumeros.filter((n) => n.status === "pago").length;

  // Calculate revenue
  let receitaTotal = 0;
  for (const rifa of adminRifas) {
    const numerosRifaPagos = await db
      .select()
      .from(numerosRifa)
      .where(and(eq(numerosRifa.rifaId, rifa.id), eq(numerosRifa.status, "pago")));
    receitaTotal += numerosRifaPagos.length * parseFloat(rifa.valorNumero.toString());
  }

  // Count pending payments
  const pagamentosPendentes = await db
    .select()
    .from(pagamentos)
    .where(eq(pagamentos.status, "pendente"));

  return {
    totalRifas: adminRifas.length,
    rifasAtivas,
    numerosVendidos: numerosPagos,
    receitaTotal,
    pagamentosPendentes: pagamentosPendentes.length,
  };
}

export type {
  Rifa,
  NumeroRifa,
  Reserva,
  Pagamento,
};
