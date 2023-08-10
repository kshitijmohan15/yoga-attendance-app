import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { constants } from "fs/promises";

export const analyticsRouter = router({
	top5Attendants: protectedProcedure.query(async ({ ctx }) => {
		// get the student with the most number of attendances in the last week
		const {
			prisma,
			session: { user },
		} = ctx;

		try {
			const students = await prisma.student.findMany({
				where: {
					teacherId: user.id,
				},
				select: {
					id: true,
					name: true,
				},
			});
			const attendances = await prisma.attendance.groupBy({
				by: ["studentId"],
				_count: {
					studentId: true,
				},
				where: {
					startDate: { gte: dayjs().subtract(30, "day").toDate() },
					studentId: { in: students.map((student) => student.id) },
				},
				orderBy: {
					_count: {
						studentId: "desc",
					},
				},
				take: 8,
			});

			const finalStudents: { count: number; name: string }[] = [];
			for (const attendance of attendances) {
				const student = students.find(
					(student) => student.id === attendance.studentId
				);
				if (student) {
					finalStudents.push({
						count: attendance._count.studentId,
						name: student.name.split(" ")[0] ?? student.name,
					});
				}
			}
			return finalStudents;
		} catch (error: any) {
			throw new TRPCError({
				message: error,
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	}),
});
