import { z } from "zod";
import { UserSchema } from "./User";


export const CategoriesEnum = z.enum(["Ausbildung", "Fortbildung", "Training", "Tagung", "Online"]);

// Course Schema
export const CourseSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title cannot be empty"),       // Titel des Kurses
    description: z.string().min(1, "Description cannot be empty"), // Lange Beschreibung
    shortdescription: z.string(),                 // Optional: Kurzbeschreibung
    category: CategoriesEnum,                                   // Single Select Kategorien
    created: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid created date format",
      }),
    updated: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid updated date format",
      }),
    expand: z.object({
        creator: UserSchema,
    }).optional(),
}).transform((data) => ({
    id: data.id,
    title: data.title,
    description: data.description,
    shortDescription: data.shortdescription,
    creator: data.expand?.creator, // Extrahiere `expand.creator` in `creator`
    category: data.category,
    created: new Date(data.created),
    updated: new Date(data.updated),
}));

// TypeScript-Typ aus dem Schema ableiten
export type Course = z.infer<typeof CourseSchema>;


export function toCourse(object: any): Course | null {
    try {
        const course: Course = CourseSchema.parse(object);
        return course;
    } catch (error) {
        console.error("Validation failed:", error);
        return null;
    }
}

//used to return something instead of undefined or null
export const emptyCourse: Course = {
    id: "",
    title: "",
    description: "",
    shortDescription: "",
    category: "Online",
    creator: {
        id: "",
        email: "",
        emailVisibility: false,
        verified: false,
        name: "",
        created: new Date(),
        updated: new Date(),
        role: "Mitglied",
    },
    created: new Date(),
    updated: new Date(),
}