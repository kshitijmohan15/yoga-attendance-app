import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Student } from "@prisma/client";
import Link from "next/link";

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
];

export default function DataTable<T>({ data }: { data: Student[] }) {
	return (
		<div style={{ height: 600, width: "100%" }}>
			<DataGrid
				isRowSelectable={() => false}
				rows={data}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[5]}
			/>
		</div>
	);
}
