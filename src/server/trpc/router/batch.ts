import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const batchRouter = router({
	createBatch: protectedProcedure
		.input(
			z.object({
				studentId: z.string(),
				startDate: z.date(),
				endDate: z.date(),
				amount: z.number(),
				paid: z.boolean(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { studentId, startDate, endDate, amount, paid } = input;
			const {
				prisma,
				session: {
					user: { id: teacherId },
				},
			} = ctx;

			try {
				const batch = await prisma.batch.create({
					data: {
						paid,
						amount,
						startDate,
						endDate,
						student: { connect: { id: studentId } },
						teacher: { connect: { id: teacherId } },
					},
				});
				return batch;
			} catch (err: any) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: err?.message,
				});
			}
		}),
	getBatchesForStudent: protectedProcedure
		.input(z.object({ studentId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { prisma } = ctx;
			const { studentId } = input;
			try {
				const batches = await prisma.batch.findMany({
					where: {
						studentId,
					},
				});
				return batches;
			} catch (err: any) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: err?.message,
				});
			}
		}),
});