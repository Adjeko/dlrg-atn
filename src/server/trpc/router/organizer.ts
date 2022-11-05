import { contextProps } from "@trpc/react-query/dist/internals/context";
import { Session } from "inspector";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const organizerRouter = router({
  getEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return {
        id: input?.id,
        title: `Hello ${input?.id ?? "world"}`,
        organizer: 'ICH',
        email: 'ich@du.de',
        date: 'heute',
        description: 'Hier steht eine tolle Beschreibung'
      };
    }),
  getEvents: protectedProcedure.query((ctx) => {
    console.log('USER ID: ' + ctx.ctx.session.user.id);
    return prisma?.event.findMany({
      where: {
        creatorId: ctx.ctx.session?.user?.id
      }
    })
  }),
});
