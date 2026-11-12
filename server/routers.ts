import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { getUserGameSave, upsertUserGameSave } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  gameSave: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      try {
        const save = await getUserGameSave(ctx.user.id);
        if (!save) return null;
        return {
          schemaVersion: save.schemaVersion,
          payload: save.payload,
          updatedAt: save.updatedAt.getTime(),
        };
      } catch (error) {
        console.error("[GameSave] Failed to load cloud save:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "雲端存檔目前無法讀取",
          cause: error,
        });
      }
    }),
    save: protectedProcedure
      .input(
        z.object({
          schemaVersion: z.number().int().min(1).max(20),
          payload: z.string().min(2).max(2_000_000),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          await upsertUserGameSave({
            userId: ctx.user.id,
            schemaVersion: input.schemaVersion,
            payload: input.payload,
          });
          return { success: true as const };
        } catch (error) {
          console.error("[GameSave] Failed to save cloud save:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "雲端存檔目前無法保存",
            cause: error,
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
