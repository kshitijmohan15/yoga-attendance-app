import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { BarChart } from "@tremor/react";
import { Skeleton } from "@/components/Skeleton";
const Dashboard = () => {
	const { data, isLoading } = trpc.analytics.top5Attendants.useQuery();
	return (
		<Layout>
			<div className="flex flex-col gap-10 ">
				<div className="w-full flex flex-col items-center">
					<div className="flex flex-col items-start w-[70%]">
						<h1>Most Frequent Attendants In The Last 30 Days</h1>
						{isLoading ? (
							<Skeleton className="h-48 bg-gray-400" />
						) : (
							data && (
								<BarChart
									className="mt-6 w-full"
									data={data}
									index="name"
									categories={["count"]}
									colors={["blue"]}
									yAxisWidth={48}
								/>
							)
						)}
					</div>
				</div>
				{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
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
