import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";
import { generateQRCode } from "./qrcode";

/**
 * Admin procedure - only admins can access
 */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can access this" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  /**
   * Auth routes
   */
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { getUserByUsername, updateUserLastSignedIn } = await import('./auth-db');
        const { verifyPassword } = await import('./auth');
        const { getDb } = await import('./db');
        const { getSessionCookieOptions } = await import('./_core/cookies');
        const { COOKIE_NAME } = await import('@shared/const');

        const username = input.username.trim();
        if (!username) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Username is required' });
        }

        const database = await getDb();
        if (!database) {
          console.error('[Auth] Login failed: database is not available');
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database connection unavailable' });
        }

        const user = await getUserByUsername(username);
        if (!user || !user.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        await updateUserLastSignedIn(user.id);

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, user.id.toString(), { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return { success: true, user };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Rifas routes
   */
  rifas: router({
    /**
     * Get all active raffles (public)
     */
    listar: publicProcedure.query(async () => {
      return db.getRifasAtivas();
    }),

    /**
     * Get raffle by ID (public)
     */
    obter: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const rifa = await db.getRifaById(input.id);
      if (!rifa) throw new TRPCError({ code: "NOT_FOUND" });
      return rifa;
    }),

    /**
     * Get numbers for a raffle (public)
     */
    numeros: publicProcedure.input(z.object({ rifaId: z.number() })).query(async ({ input }) => {
      return db.getNumerosRifa(input.rifaId);
    }),

    /**
     * Create raffle (admin only)
     */
    criar: adminProcedure
      .input(
        z.object({
          titulo: z.string().min(3),
          descricao: z.string().optional(),
          regras: z.string().optional(),
          valorNumero: z.string(),
          totalNumeros: z.number().min(1),
          pixChave: z.string().optional(),
          pixQrCode: z.string().optional(),
          tempoReservaMinutos: z.number().default(30),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const rifaResult = await db.createRifa({
          titulo: input.titulo,
          descricao: input.descricao,
          regras: input.regras,
          valorNumero: input.valorNumero,
          totalNumeros: input.totalNumeros,
          pixChave: input.pixChave,
          pixQrCode: input.pixQrCode,
          tempoReservaMinutos: input.tempoReservaMinutos,
          criadoPor: ctx.user.id,
          status: "ativa",
        });

        // Get the created rifa ID
        const rifas = await db.getRifasByAdmin(ctx.user.id);
        const rifaId = rifas[rifas.length - 1]?.id;

        if (rifaId) {
          // Create numbers for the raffle
          await db.createNumerosRifa(rifaId, input.totalNumeros);
        }

        return { id: rifaId };
      }),

    /**
     * Update raffle (admin only)
     */
    atualizar: adminProcedure
      .input(
        z.object({
          id: z.number(),
          titulo: z.string().optional(),
          descricao: z.string().optional(),
          regras: z.string().optional(),
          valorNumero: z.string().optional(),
          pixChave: z.string().optional(),
          pixQrCode: z.string().optional(),
          imagemUrl: z.string().optional(),
          status: z.enum(["ativa", "finalizada", "cancelada"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const rifa = await db.getRifaById(input.id);
        if (!rifa) throw new TRPCError({ code: "NOT_FOUND" });
        if (rifa.criadoPor !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const { id, ...data } = input;
        await db.updateRifa(id, data);
        return { success: true };
      }),

    /**
     * Delete raffle (admin only)
     */
    deletar: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const rifa = await db.getRifaById(input.id);
        if (!rifa) throw new TRPCError({ code: "NOT_FOUND" });
        if (rifa.criadoPor !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.deleteRifa(input.id);
        return { success: true };
      }),

    /**
     * Upload raffle image
     */
    uploadImagem: adminProcedure
      .input(
        z.object({
          rifaId: z.number(),
          arquivo: z.instanceof(Buffer),
          nomeArquivo: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const rifa = await db.getRifaById(input.rifaId);
        if (!rifa) throw new TRPCError({ code: "NOT_FOUND" });
        if (rifa.criadoPor !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const fileKey = `rifas/${input.rifaId}/${Date.now()}-${input.nomeArquivo}`;
        const { url } = await storagePut(fileKey, input.arquivo, "image/jpeg");

        await db.updateRifa(input.rifaId, { imagemUrl: url });
        return { url };
      }),

    /**
     * Get admin's raffles
     */
    meusRifas: adminProcedure.query(async ({ ctx }) => {
      return db.getRifasByAdmin(ctx.user.id);
    }),
  }),

  /**
   * Reservas routes
   */
  reservas: router({
    /**
     * Reserve a number (public)
     */
    reservar: publicProcedure
      .input(
        z.object({
          rifaId: z.number(),
          numeroId: z.number(),
          clienteNome: z.string().min(3),
          clienteWhatsapp: z.string().min(11),
          clienteEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const rifa = await db.getRifaById(input.rifaId);
        if (!rifa) throw new TRPCError({ code: "NOT_FOUND" });
        if (rifa.status !== "ativa") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Raffle is not active" });
        }

        const numero = await db.getNumeroById(input.numeroId);
        if (!numero) throw new TRPCError({ code: "NOT_FOUND" });
        if (numero.status !== "disponivel") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Number is not available" });
        }

        // Reserve the number
        const expiraEm = new Date(Date.now() + rifa.tempoReservaMinutos * 60 * 1000);

        await db.updateNumeroStatus(input.numeroId, "reservado", {
          reservaExpiraEm: expiraEm,
          reservaNome: input.clienteNome,
          reservaWhatsapp: input.clienteWhatsapp,
        });

        // Create reservation
        await db.createReserva({
          rifaId: input.rifaId,
          numeroId: input.numeroId,
          clienteNome: input.clienteNome,
          clienteWhatsapp: input.clienteWhatsapp,
          clienteEmail: input.clienteEmail,
          status: "pendente",
          expiraEm,
        });

        // Get the created reservation
        const reservas = await db.getReservasPendentes();
        const reserva = reservas[reservas.length - 1];
        const reservaId = reserva?.id || 0;

        // Create payment record
        await db.createPagamento({
          rifaId: input.rifaId,
          numeroId: input.numeroId,
          reservaId: reservaId,
          clienteNome: input.clienteNome,
          clienteWhatsapp: input.clienteWhatsapp,
          status: "pendente",
        });

        // Get the created payment
        const pagamentos = await db.getPagamentosPendentes();
        const pagamento = pagamentos[pagamentos.length - 1];
        const pagamentoId = pagamento?.id || 0;

        // Generate QR Code
        const qrCodeData = `PIX:${rifa.pixChave}|Rifa:${rifa.titulo}|Numero:${numero.numero}|Valor:${rifa.valorNumero}`;
        const qrCode = await generateQRCode(qrCodeData);

        return {
          reservaId: reservaId,
          pagamentoId: pagamentoId,
          expiraEm,
          pixChave: rifa.pixChave,
          pixQrCode: rifa.pixQrCode || qrCode,
          valor: rifa.valorNumero,
        };
      }),

    /**
     * Get pending payments (admin only)
     */
    pagamentosPendentes: adminProcedure.query(async () => {
      return db.getPagamentosPendentes();
    }),
  }),

  /**
   * Pagamentos routes
   */
  pagamentos: router({
    /**
     * Approve payment (admin only)
     */
    aprovar: adminProcedure
      .input(
        z.object({
          pagamentoId: z.number(),
          observacao: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const pagamento = await db.getPagamentoById(input.pagamentoId);
        if (!pagamento) throw new TRPCError({ code: "NOT_FOUND" });

        // Update payment
        await db.updatePagamento(input.pagamentoId, {
          status: "aprovado",
          confirmadoEm: new Date(),
          confirmadoPor: ctx.user.id,
          observacaoAdmin: input.observacao,
        });

        // Update number status to paid
        await db.updateNumeroStatus(pagamento.numeroId, "pago");

        // Update reservation status
        const reserva = await db.getReservaById(pagamento.reservaId);
        if (reserva) {
          await db.updateReserva(pagamento.reservaId, { status: "confirmada" });
        }

        return { success: true };
      }),

    /**
     * Reject payment (admin only)
     */
    rejeitar: adminProcedure
      .input(
        z.object({
          pagamentoId: z.number(),
          observacao: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const pagamento = await db.getPagamentoById(input.pagamentoId);
        if (!pagamento) throw new TRPCError({ code: "NOT_FOUND" });

        // Update payment
        await db.updatePagamento(input.pagamentoId, {
          status: "rejeitado",
          confirmadoEm: new Date(),
          confirmadoPor: ctx.user.id,
          observacaoAdmin: input.observacao,
        });

        // Reactivate number
        await db.updateNumeroStatus(pagamento.numeroId, "disponivel", {
          reservaExpiraEm: null,
          reservaNome: null,
          reservaWhatsapp: null,
        });

        // Update reservation status
        const reserva = await db.getReservaById(pagamento.reservaId);
        if (reserva) {
          await db.updateReserva(pagamento.reservaId, { status: "cancelada" });
        }

        return { success: true };
      }),

    /**
     * Get payments by raffle (admin only)
     */
    porRifa: adminProcedure
      .input(z.object({ rifaId: z.number() }))
      .query(async ({ input }) => {
        return db.getPagamentosByRifa(input.rifaId);
      }),
  }),

  /**
   * Dashboard routes
   */
  dashboard: router({
    /**
     * Get dashboard stats (admin only)
     */
    stats: adminProcedure.query(async ({ ctx }) => {
      return db.getDashboardStats(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
