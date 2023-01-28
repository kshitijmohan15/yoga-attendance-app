import React from "react";
import ThemeToggle from "../components/ThemeToggleButton";
import ListItem from "../components/ListItem";
import Layout from "../components/Layout";
import { Button } from "../components/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AvatarHovered from "../components/AvatarHovered";

function Index() {
	const { data: session } = useSession();

	return (
		<Layout>
			<section className="relative flex w-full">
				{session ? <Sidebar /> : null}
				<div className="relative flex h-screen flex-1 flex-col items-center justify-center">
					<nav className=" absolute left-0 top-0 flex w-full items-center justify-between px-6 py-4">
						<ThemeToggle />
						<ul className="flex items-center justify-center gap-4 text-primary-dark-500 dark:text-primary-light-500">
							<Button
								size={"sm"}
								className=" flex items-center justify-center gap-2"
								onClick={() =>
									session ? signOut() : signIn("google")
								}
							>
								{!session ? (
									<>
										<FaGoogle />
										<div>SIGN IN WITH GOOGLE</div>
									</>
								) : (
									<div>SIGN OUT</div>
								)}
							</Button>
							{session?.user?.image && (
								<AvatarHovered
									user={session.user}
									imgURL={session.user.image}
								/>
							)}
						</ul>
					</nav>
				</div>
			</section>
		</Layout>
	);
}

export default Index;
