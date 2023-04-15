import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { getSession, useSession } from "next-auth/react";

export const getServerSideProps = async (context: any) => {
	const session = await getSession(context);
	if (session) {
		return { redirect: { destination: "/students" } };
	}
	return { props: {} };
};

function Index() {
	const { data: session } = useSession();
	return (
		<Layout title="Login">
			<section className="flex h-full w-full items-center justify-center">
				{!session ? (
					<div className="mx-auto flex h-auto w-full max-w-xl flex-col rounded-xl dark:bg-primary-dark-600">
						<form
							action=""
							className="flex h-full w-full flex-col gap-3 px-8 py-12 text-xl font-semibold text-blue-600 dark:text-gray-200"
						>
							<div className="flex w-full justify-center">
								<div>Try signing in with Google</div>
							</div>
						</form>
					</div>
				) : null}
			</section>
		</Layout>
	);
}

export default Index;
