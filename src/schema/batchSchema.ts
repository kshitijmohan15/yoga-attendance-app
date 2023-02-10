import { z } from "zod";

export const batchSchema = z.object({
	startDate: z.date(),
	endDate: z.date(),
	paid: z.boolean(),
	amount: z.number(),
	isPaused: z.boolean().nullable(),
});
