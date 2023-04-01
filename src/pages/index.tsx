import { useSession } from "next-auth/react";

export default function IndexPage() {
	const { data } = useSession();
	return (
		<div>
			<h1>Index Page</h1>
		</div>
	);
}
export function getServerSideProps() {
	return {
		// props for your component
		redirect: {
			destination: "/students",
		},
	};
}
