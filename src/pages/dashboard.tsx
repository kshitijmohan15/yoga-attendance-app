import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
	const { data: hoursByStudents } =
		trpc.analytics.getTotalHoursForStudent.useQuery();
	return (
		<Layout>
			<div className="flex flex-col gap-10">
				<table>
					<thead>
						<tr>
							<th className="text-left text-lg">Student</th>
							<th className="text-left text-lg">Minutes</th>
						</tr>
						{hoursByStudents?.studentWithMinutes.map((student) => (
							<tr key={student.id}>
								<td>{student.name}</td>
								<td>{student.totalMinutes}</td>
							</tr>
						))}
					</thead>
				</table>
			</div>
		</Layout>
	);
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context);
	if (!session) {
		return { redirect: { destination: "/login" } };
	}
	return { props: {} };
}
export default Dashboard;
