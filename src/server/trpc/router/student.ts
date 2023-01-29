import { TRPCError } from "@trpc/server";
import { createStudentSchema } from "../../../schema/studentSchema";
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
	getStudents: protectedProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;
		try {
			const students = await prisma.student.findMany({
				where: {
					teacherId: ctx.session.user.id,
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
});
