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
  getTimeline: publicProcedure
    .query(({ }) => {
      return [
        {
          id: 1,
          content: 'Applied to',
          target: 'Front End Developer',
          href: '#',
          date: 'Sep 20',
          datetime: '2020-09-20',
          icon: UserIcon,
          iconBackground: 'bg-gray-400',
        },
        {
          id: 2,
          content: 'Advanced to phone screening by',
          target: 'Bethany Blake',
          href: '#',
          date: 'Sep 22',
          datetime: '2020-09-22',
          icon: HandThumbUpIcon,
          iconBackground: 'bg-blue-500',
        },
        {
          id: 3,
          content: 'Completed phone screening with',
          target: 'Martha Gardner',
          href: '#',
          date: 'Sep 28',
          datetime: '2020-09-28',
          icon: CheckIcon,
          iconBackground: 'bg-green-500',
        },
        {
          id: 4,
          content: 'Advanced to interview by',
          target: 'Bethany Blake',
          href: '#',
          date: 'Sep 30',
          datetime: '2020-09-30',
          icon: HandThumbUpIcon,
          iconBackground: 'bg-blue-500',
        },
        {
          id: 5,
          content: 'Completed interview with',
          target: 'Katherine Snyder',
          href: '#',
          date: 'Oct 4',
          datetime: '2020-10-04',
          icon: CheckIcon,
          iconBackground: 'bg-green-500',
        },
      ];
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
