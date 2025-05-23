import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const attendanceRouter = router({
	createAttendance: protectedProcedure
		.input(
			z.object({
				studentId: z.string(),
				startDate: z.date(),
				endDate: z.date(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx;
			const { studentId, startDate, endDate } = input;

			try {
				const attendance = await prisma.attendance.create({
					data: {
						startDate: startDate,
						endDate: endDate,
						studentId: studentId,
					},
				});
				return { attendance };
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	deleteAttendance: protectedProcedure
		.input(
			z.object({
				studentId: z.string(),
				startDate: z.date(),
				endDate: z.date(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx;
			const { studentId, endDate, startDate } = input;

			try {
				const attendance = await prisma.attendance.deleteMany({
					where: {
						studentId: studentId,
						startDate: startDate,
						endDate: endDate,
					},
				});
				return { attendance };
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	uploadCsv: protectedProcedure
		.input(
			z.object({
				participants: z.array(
					z.object({
						name: z.string(),
						startDate: z.date(),
						endDate: z.date(),
					})
				),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Create a new participant when the name does not exist in the database
			// and create attendance records for all participants

			try {
				const { prisma } = ctx;
				const { participants } = input;

				// check which participants are already in the database
				const existingParticipants = await prisma.student.findMany({
					where: {
						name: {
							in: participants.map((p) => p.name),
						},
						teacherId: ctx.session.user.id,
					},
				});

				// check which participants are not in the database
				const newParticipants = participants.filter(
					(p) =>
						!existingParticipants.some((ep) => ep.name === p.name)
				);

				// create new participants
				if (newParticipants.length > 0) {
					await prisma.student.createMany({
						data: newParticipants.map((p) => ({
							name: p.name,
							teacherId: ctx.session.user.id,
						})),
					});
				}

				// get all participants
				const allParticipants = await prisma.student.findMany({
					where: {
						name: {
							in: participants.map((p) => p.name),
						},
						teacherId: ctx.session.user.id,
					},
				});

				// create attendance records
				const allIds = allParticipants.map((p) => p.id); // all ids of participants

				// create attendance records
				await prisma.attendance.createMany({
					data: participants.map((p) => ({
						startDate: p.startDate,
						endDate: p.endDate,
						studentId: allIds.find(
							(id) =>
								p.name ===
								allParticipants.find((ap) => ap.id === id)?.name
						),
					})),
				});
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	getAttendanceByStudent: protectedProcedure
		.input(
			z.object({
				studentId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx;
			const { studentId } = input;
			try {
				const attendance = await prisma.attendance.findMany({
					where: { studentId: studentId },
				});
				return { attendance };
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
});
