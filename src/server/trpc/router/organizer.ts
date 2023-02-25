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
  getAttendees: protectedProcedure
  .input(z.object({eventId: z.string()}))
  .query(({input, ctx}) => {
    try {
      return prisma?.event.findFirst({
        where: {
          creatorId: ctx.session?.user?.id,
          id: input.eventId,          
        },
        select: {
          attendees: {
            select: {
              user: true
            }
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }),
  createEvent: protectedProcedure
    .input(z.object({ title: z.string(), organizer: z.string(), 
    contact: z.string(),  points: z.number()}))
    .mutation(async ({ input, ctx }) => {
      console.log(input)
      console.log(ctx.session)

      try {
        await prisma?.event.create({
          data: {
            creatorId: ctx.session.user.id,
            contact: input.contact,
            organizer: input.organizer,
            title: input.title,
            points: input.points,
          }
        })
      } catch (error) {
        console.error(error)
      }
    }),
});
