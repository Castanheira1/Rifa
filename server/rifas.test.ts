import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

/**
 * Tests for rifas functionality
 * Note: These are integration tests that require a database connection
 */

describe("Rifas API", () => {
  describe("getRifasAtivas", () => {
    it("should return active raffles", async () => {
      const rifas = await db.getRifasAtivas();
      expect(Array.isArray(rifas)).toBe(true);
    });
  });

  describe("createRifa", () => {
    it("should create a new raffle", async () => {
      const result = await db.createRifa({
        titulo: "Test Rifa",
        descricao: "Test Description",
        regras: "Test Rules",
        valorNumero: "10.00",
        totalNumeros: 100,
        pixChave: "test@pix",
        criadoPor: 1,
        status: "ativa",
      });

      expect(result).toBeDefined();
    });
  });

  describe("createNumerosRifa", () => {
    it("should create numbers for a raffle", async () => {
      const result = await db.createNumerosRifa(1, 10);
      expect(result).toBeDefined();
    });
  });

  describe("getNumerosRifa", () => {
    it("should return numbers for a raffle", async () => {
      const numeros = await db.getNumerosRifa(1);
      expect(Array.isArray(numeros)).toBe(true);
    });
  });

  describe("updateNumeroStatus", () => {
    it("should update number status", async () => {
      const numeros = await db.getNumerosRifa(1);
      if (numeros.length > 0) {
        const result = await db.updateNumeroStatus(numeros[0].id, "reservado");
        expect(result).toBeDefined();
      }
    });
  });
});

describe("Reservas API", () => {
  describe("createReserva", () => {
    it("should create a reservation", async () => {
      const result = await db.createReserva({
        rifaId: 1,
        numeroId: 1,
        clienteNome: "Test Client",
        clienteWhatsapp: "11999999999",
        status: "pendente",
        expiraEm: new Date(Date.now() + 30 * 60 * 1000),
      });

      expect(result).toBeDefined();
    });
  });

  describe("getReservasPendentes", () => {
    it("should return pending reservations", async () => {
      const reservas = await db.getReservasPendentes();
      expect(Array.isArray(reservas)).toBe(true);
    });
  });
});

describe("Pagamentos API", () => {
  describe("createPagamento", () => {
    it("should create a payment", async () => {
      const result = await db.createPagamento({
        rifaId: 1,
        numeroId: 1,
        reservaId: 1,
        clienteNome: "Test Client",
        clienteWhatsapp: "11999999999",
        status: "pendente",
      });

      expect(result).toBeDefined();
    });
  });

  describe("getPagamentosPendentes", () => {
    it("should return pending payments", async () => {
      const pagamentos = await db.getPagamentosPendentes();
      expect(Array.isArray(pagamentos)).toBe(true);
    });
  });

  describe("updatePagamento", () => {
    it("should update payment status", async () => {
      const pagamentos = await db.getPagamentosPendentes();
      if (pagamentos.length > 0) {
        const result = await db.updatePagamento(pagamentos[0].id, {
          status: "aprovado",
          confirmadoEm: new Date(),
        });
        expect(result).toBeDefined();
      }
    });
  });
});
