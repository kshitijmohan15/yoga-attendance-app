import { z } from "zod";
export const createStudentSchema = z.object({
	name: z.string({ required_error: "Name is required" }).min(3).max(50),
	email: z
		.string({ required_error: "Entering an email address is required" })
		.email({ message: "Invalid email address" }).optional(),
	phone: z.string().min(10).max(10),
});
