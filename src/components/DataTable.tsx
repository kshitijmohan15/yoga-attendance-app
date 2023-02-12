import * as React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Batch, Student } from "@prisma/client";
import Link from "next/link";
import isBetween from "dayjs/plugin/isBetween";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./Tooltip";
import dayjs from "dayjs";

dayjs.extend(isBetween);
const columns: GridColDef[] = [
	{
		field: "name",
		headerName: "Name",
		width: 150,

		renderCell(params) {
			return (
				<Link
					className="font-medium hover:text-blue-700"
					href={`/students/${params.id}`}
				>
					{params.value}
				</Link>
			);
		},
	},
	{ field: "phone", headerName: "Phone", width: 150 },
	{ field: "email", headerName: "Email", width: 200 },
	{
		field: "batch",
		headerName: "Status",
		width: 200,
		renderCell(params) {
			const latestBatch = params.value[0] as Batch;
			return (
				<span className="font-medium">
					{params.value?.length > 0 ? (
						dayjs().isBetween(
							latestBatch.startDate,
							latestBatch.endDate
						) ? (
							withTooltip({
								children: <ActiveLabel />,
								title: `${dayjs(latestBatch?.startDate).format(
									"DD-MMM-YY"
								)} to ${dayjs(latestBatch?.endDate).format(
									"DD-MMM-YY"
								)}`,
							})
						) : (
							withTooltip({
								children: <ExpiredLabel />,
								title: `${dayjs(latestBatch?.startDate).format(
									"DD-MMM-YY"
								)} to ${dayjs(latestBatch?.endDate).format(
									"DD-MMM-YY"
								)}`,
							})
						)
					) : (
						<NoBatchesLabel />
					)}
				</span>
			);
		},
	},
];

const withTooltip = ({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>
					<p>{title}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
const ActiveLabel = () => (
	<div className=" rounded-lg bg-green-300 py-1 px-2  text-green-800">
		Active
	</div>
);
const ExpiredLabel = () => (
	<div className="rounded-lg bg-red-200 py-1 px-2 text-red-800">Expired</div>
);
const NoBatchesLabel = () => (
	<div className="rounded-lg bg-gray-300 py-1 px-2 text-gray-800">
		No Batches
	</div>
);
export default function DataTable({ data }: { data: Student[] }) {
	return (
		<div style={{ height: 600, width: "100%" }}>
			<DataGrid
				className="dark:text-gray-200"
				sx={{
					boxShadow: 2,
					"& .MuiToolbar-root": {
						color: "primary.main",
					},
					"& MuiDataGrid-iconButtonContainer": {
						color: "primary.main",
					},
				}}
				isRowSelectable={() => false}
				rows={data}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10]}
			/>
		</div>
	);
}
