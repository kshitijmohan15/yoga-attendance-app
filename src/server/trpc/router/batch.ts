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
				isPaused: z.boolean().nullable(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { studentId, startDate, endDate, amount, paid, isPaused } =
				input;
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
						isPaused,
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
	// latestById: protectedProcedure
	// 	.input(
	// 		z.object({
	// 			id: z.string(),
	// 		})
	// 	)
	// 	.query(async ({ input, ctx }) => {
	// 		const { prisma } = ctx;
	// 		const { id } = input;
	// 		try {
	// 			const batch = await prisma.batch.findFirst({
	// 				where: {
	// 					studentId: id,
	// 				},
	// 				orderBy: {
	// 					startDate: "desc",
	// 				},
	// 			});
	// 			return batch;
	// 		} catch (err: any) {
	// 			throw new TRPCError({
	// 				code: "INTERNAL_SERVER_ERROR",
	// 				message: err?.message,
	// 			});
	// 		}
	// 	}),
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
					orderBy: {
						startDate: "desc",
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
	editBatch: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				startDate: z.date(),
				endDate: z.date(),
				amount: z.number(),
				isPaused: z.boolean().nullable(),
				paid: z.boolean(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { prisma } = ctx;
			const { id, startDate, endDate, amount, paid, isPaused } = input;
			try {
				const batch = await prisma.batch.update({
					where: {
						id,
					},
					data: {
						startDate,
						endDate,
						amount,
						paid,
						isPaused,
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
	deleteBatch: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { prisma } = ctx;
			const { id } = input;
			try {
				const batch = await prisma.batch.delete({
					where: {
						id,
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
});
