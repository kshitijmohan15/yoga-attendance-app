import * as React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { type Batch, type Student } from "@prisma/client";
import Link from "next/link";
import { BsTrashFill } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import isBetween from "dayjs/plugin/isBetween";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./Tooltip";
import dayjs from "dayjs";
import { usePageStore } from "@/store/usePageNo";

dayjs.extend(isBetween);

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
export default function DataTable({
	data,
	setUpdateModalOpen,
	setDeleteModalOpen,
	setToBeDeleted,
	setToBeEdited,
	reset,
}: {
	data: Student[];
	setUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setToBeDeleted: React.Dispatch<React.SetStateAction<string>>;
	setToBeEdited: React.Dispatch<React.SetStateAction<string>>;
	reset: ({
		name,
		email,
		phone,
	}: {
		name: string;
		email: string;
		phone: string;
	}) => void;
}) {
	const [pageNo, setPageNo] = usePageStore((state) => [
		state.pageNo,
		state.setPageNo,
	]);

	const columns: GridColDef[] = [
		{
			field: "name",
			headerName: "Name",
			width: 150,

			renderCell(params) {
				return (
					<div
						className={
							"flex h-full w-full items-center justify-start"
						}
					>
						<Link
							className="flex h-full flex-1 items-center font-medium transition-all duration-300 hover:text-blue-700"
							href={`/students/${params.id}`}
						>
							{params.value}
						</Link>
					</div>
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
					<span className="flex items-center gap-2 font-medium">
						{params.value?.length > 0 ? (
							<div
								className={`h-2 w-2 rounded-full ${
									latestBatch?.paid
										? "bg-green-500"
										: "bg-red-500"
								}`}
							></div>
						) : null}
						{params.value?.length > 0 ? (
							dayjs().isBetween(
								latestBatch.startDate,
								latestBatch.endDate
							) ? (
								withTooltip({
									children: <ActiveLabel />,
									title: `${dayjs(
										latestBatch?.startDate
									).format("DD-MMM-YY")} to ${dayjs(
										latestBatch?.endDate
									).format("DD-MMM-YY")}`,
								})
							) : (
								withTooltip({
									children: <ExpiredLabel />,
									title: `${dayjs(
										latestBatch?.startDate
									).format("DD-MMM-YY")} to ${dayjs(
										latestBatch?.endDate
									).format("DD-MMM-YY")}`,
								})
							)
						) : (
							<NoBatchesLabel />
						)}
					</span>
				);
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 200,
			renderCell: (params) => (
				<div className="flex gap-3">
					<button
						onClick={() => {
							setToBeDeleted(String(params.id));
							setDeleteModalOpen(true);
						}}
					>
						<BsTrashFill size={20} />
					</button>
					<button
						onClick={() => {
							setToBeEdited(String(params.id));
							reset({
								name: params.row.name,
								phone: params.row.phone,
								email: params.row.email,
							});
							setUpdateModalOpen(true);
						}}
					>
						<FiEdit2 size={20} />
					</button>
				</div>
			),
		},
	];
	return (
		<div style={{ height: 600, width: "100%" }}>
			<DataGrid
				page={pageNo}
				onPageChange={(number) => setPageNo(number)}
				className="dark:text-gray-200"
				isCellEditable={() => false}
				isRowSelectable={() => false}
				rows={data}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10]}
			/>
		</div>
	);
}
