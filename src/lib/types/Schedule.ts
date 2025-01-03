import { z } from "zod";
import { UserSchema } from "./User";
import { CourseSchema } from "./Course";

// Schedule Schema
export const ScheduleSchema = z.object({
    id: z.string(),
    location: z.string(),
    points: z.number(),
    startDateTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid startDateTime date format",
    }),
    endDateTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid endDateTime date format",
    }),
    created: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid created date format",
    }),
    updated: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid updated date format",
    }),
    expand: z.object({
        attendees: z.array(UserSchema),
        organizers: z.array(UserSchema),
        course: CourseSchema,
    }),
})
    .transform((data) => ({
        id: data.id,
        location: data.location,
        points: data.points,
        participants: data.expand.attendees,
        organizers: data.expand.organizers, // Extrahiere `expand.organizer` in `organizer`
        course: data.expand.course,
        startDateTime: new Date(data.startDateTime),
        endDateTime: new Date(data.endDateTime),
        created: new Date(data.created),
        updated: new Date(data.updated),

    }));

// TypeScript-Typ aus dem Schema ableiten
export type Schedule = z.infer<typeof ScheduleSchema>;

export function toSchedule(object: any): Schedule | undefined{
    try {
        const schedule: Schedule = ScheduleSchema.parse(object);
        return schedule;
    } catch (error) {
        console.error("Validation failed:", error);
    }
}