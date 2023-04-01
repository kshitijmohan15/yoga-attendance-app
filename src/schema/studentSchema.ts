import { z } from "zod";
export const createStudentSchema = z.object({
	name: z.string({ required_error: "Name is required" }).min(3).max(50),
	// email should be optional, but if the user does give it, it should be a valid email
	email: z.string().optional(),
	phone: z.string().optional(),
});
