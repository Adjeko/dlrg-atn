import { z } from "zod";

import { router, publicProcedure } from "../trpc";

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
  getEvents: publicProcedure.query(() => {
    return [
      { id: '1', title: 'Sanitätskurs A' },
      { id: '2', title: 'Wasserrettungshelfer' },
    ];
  }),
});
