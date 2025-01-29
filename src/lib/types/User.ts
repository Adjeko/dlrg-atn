import { z } from "zod";

// Definiere das Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  name: z.string(),
  created: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid created date format",
  }),
  updated: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid updated date format",
  }),
  role: z.enum(["Admin", "Moderator", "Mitglied"]),
}).transform((data) => ({
    ...data,
    created: new Date(data.created),
    updated: new Date(data.updated),
  }));

// Typ aus dem Schema ableiten
export type User = z.infer<typeof UserSchema>; // Der Typ wird automatisch abgeleitet

export function toUser(object : any) : User | undefined {
    try {
        const user: User = UserSchema.parse(object);
        return user;
      } catch (error) {
        console.error("Validation failed:", error);
      }
}

//used to return something instead of undefined or null
export const emptyUser: User = {
    id: "",
    email: "",
    emailVisibility: false,
    verified: false,
    name: "",
    role: "Mitglied",
    created: new Date(),
    updated: new Date(),
  };
