import { getDb, getNumerosRifa, updateNumeroStatus, getReservasPendentes, updateReserva } from "./db";

/**
 * Job para expirar reservas que passaram do tempo limite
 * Deve ser executado periodicamente (ex: a cada 5 minutos)
 */
export async function expireReservations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Jobs] Database not available");
    return;
  }

  try {
    const now = new Date();
    const reservas = await getReservasPendentes();

    for (const reserva of reservas) {
      // Check if reservation has expired
      if (new Date(reserva.expiraEm) < now) {
        // Update reservation status to expired
        await updateReserva(reserva.id, { status: "expirada" });

        // Reactivate the number
        await updateNumeroStatus(reserva.numeroId, "disponivel", {
          reservaExpiraEm: null,
          reservaNome: null,
          reservaWhatsapp: null,
        });

        console.log(`[Jobs] Reservation ${reserva.id} expired and number ${reserva.numeroId} reactivated`);
      }
    }
  } catch (error) {
    console.error("[Jobs] Error expiring reservations:", error);
  }
}

/**
 * Start the jobs scheduler
 */
export function startJobsScheduler() {
  // Run every 5 minutes
  const interval = setInterval(() => {
    expireReservations();
  }, 5 * 60 * 1000);

  console.log("[Jobs] Scheduler started - running every 5 minutes");

  // Run once on startup
  expireReservations();

  return interval;
}
