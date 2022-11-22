import { z } from "zod";
import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid'
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const indexRouter = router({
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
