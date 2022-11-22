import { z } from "zod";
import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid'
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const indexRouter = router({
  getStats: publicProcedure
    .query(({ }) => {
      return [
        { name: 'Anzahl an Fortbildungen', stat: '5', previousStat: '7', change: `${(Math.round(5 / 7 * 100 * 100) / 100).toFixed(2)}%`, changeType: 'increase' },
        { name: 'Fortbildungsstunden', stat: '14h', previousStat: '20h', change: `${14 / 20 * 100}%`, changeType: 'increase' },
      ];
    }),
  getTimeline: protectedProcedure
    .query(({ ctx }) => {
      return prisma?.profile.findFirst(
        {
          where: {
            userId: ctx.session.user.id
          },
          select: {
            events: true
          }
        })
    }),
  joinEvent: protectedProcedure
  .input(z.object({eventId: z.string()}))
  .mutation(async ({input, ctx}) => {
    console.log(input)
    console.log(ctx.session)
    
    await prisma?.profile.update({
      where:{
        userId: ctx.session.user.id
      },
      data:{
        events:{
          connect: [{id: input.eventId}] 
        }
      }
    })

  }),
});
