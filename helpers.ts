import { RouterOutputs } from "@/utils/trpc";
import { QueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";

export function updateAttendanceCache({
	client,
	variables,
	data,
}: {
	client: QueryClient;
	variables: { studentId: string };
	data: { startDate: Date; endDate: Date };
}) {
	const randomID = Math.random().toString(36).slice(2, 8);
	client.setQueryData(
		[
			["attendance", "getAttendanceByStudent"],
			{
				input: {
					studentId: variables.studentId,
				},
				type: "query",
			},
		],
		(oldData: any) => {
			let newData =
				oldData as RouterOutputs["attendance"]["getAttendanceByStudent"];
			const newAttendance = {
				id: randomID,
				studentId: variables.studentId,
				startDate: data.startDate,
				endDate: data.endDate,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			newData.attendance.push(newAttendance);
			// console.log("NEW ATTENDANCE", newData);
			return newData;
		}
	);
}
export const deleteAttendanceCache = ({
	client,
	variables,
	data,
}: {
	client: QueryClient;
	variables: { studentId: string };
	data: { startDate: Date; endDate: Date };
}) => {
	client.setQueryData(
		[
			["attendance", "getAttendanceByStudent"],
			{
				input: {
					studentId: variables.studentId,
				},
				type: "query",
			},
		],
		(oldData: any) => {
			let newData =
				oldData as RouterOutputs["attendance"]["getAttendanceByStudent"];
			newData.attendance = newData.attendance.filter(
				(attendance: any) =>
					attendance.startDate !== data.startDate &&
					attendance.endDate !== data.endDate
			);
			return newData;
		}
	);
};
