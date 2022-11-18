import { contextProps } from "@trpc/react-query/dist/internals/context";
import { Session } from "inspector";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const organizerRouter = router({
  getEvent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return prisma?.event.findFirst({
        where:{
          id: input.id
        },
        include:{
          attendees: true
        }
      });
    }),
  getEvents: protectedProcedure.query(({ctx}) => {
    return prisma?.event.findMany({
      where: {
        creatorId: ctx.session?.user?.id
      }
    })
  }),
  createEvent: protectedProcedure
  .input(z.object({title: z.string()}))
  .mutation(async ({input, ctx}) => {
    console.log(input)
    console.log(ctx.session)
    await prisma?.event.create({
      data: {
        creatorId: ctx.session.user.id,
        title: input.title,
        points: 15,
      }
    })
  }),
});
