import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getUserById } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookieHeader = opts.req.headers.cookie ?? "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    const sessionValue = match?.[1];
    if (sessionValue) {
      const userId = parseInt(sessionValue, 10);
      if (!isNaN(userId)) {
        user = (await getUserById(userId)) ?? null;
      }
    }
  } catch {
    user = null;
  }

  return { req: opts.req, res: opts.res, user };
}
