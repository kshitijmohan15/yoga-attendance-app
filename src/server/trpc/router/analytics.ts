import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { constants } from "fs/promises";

export const analyticsRouter = router({
	getTotalHoursForStudent: protectedProcedure.query(async ({ ctx }) => {
		const { prisma, session } = ctx;
		const { user } = session;

		try {
			const students = await prisma.student.findMany({
				where: {
					teacherId: user.id,
				},
				include: {
					attendance: {
						select: {
							startDate: true,
							endDate: true,
						},
					},
				},
				take: 10,
			});
			const studentWithMinutes = students.map((student) => {
				const totalMinutes = student.attendance.reduce((acc, curr) => {
					const start = dayjs(curr.startDate);
					const end = dayjs(curr.endDate);
					const diff = end.diff(start, "minute");
					return acc + diff;
				}, 0);
				return {
					name: student.name,
					totalMinutes: totalMinutes,
					id: student.id,
				};
			});
			return {
				studentWithMinutes: studentWithMinutes.sort(
					(a, b) => b.totalMinutes - a.totalMinutes
				),
			};
		} catch (error: any) {
			throw new TRPCError({
				message: error,
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	}),
});
