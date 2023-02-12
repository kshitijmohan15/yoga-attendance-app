import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const studentRouter = router({
	createStudent: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				phone: z.string(),
				teacherId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { name, email, phone } = input;
			const { prisma } = ctx;
			try {
				const student = await prisma.student.create({
					data: {
						email,
						name,
						phone,
						teacher: { connect: { id: input.teacherId } },
					},
				});
				return {
					student,
				};
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	editStudent: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				phone: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx;
			try {
				const student = await prisma.student.update({
					where: {
						id: input.id,
					},
					data: {
						email: input.email,
						name: input.name,
						phone: input.phone,
					},
				});
				return {
					student,
				};
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	deleteStudent: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx;
			try {
				const student = await prisma.student.delete({
					where: {
						id: input.id,
					},
				});

				return {
					student,
				};
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
	getStudents: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;
		try {
			const students = await prisma.student.findMany({
				where: {
					teacherId: ctx.session.user.id,
				},
				include: {
					batch: {
						orderBy: {
							startDate: "desc",
						},
						take: 1,
					},
				},
			});
			return {
				students,
			};
		} catch (error: any) {
			// handle error
			throw new TRPCError({
				message: error,
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	}),
	getStudent: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { prisma } = ctx;
			try {
				const student = await prisma.student.findUnique({
					where: {
						id: input.id,
					},
				});
				return student;
			} catch (error: any) {
				// handle error
				throw new TRPCError({
					message: error,
					code: "INTERNAL_SERVER_ERROR",
				});
			}
		}),
});
