import { Poppins } from "@next/font/google";
import Head from "next/head";
import React, { type FC } from "react";

import { twMerge } from "tailwind-merge";
import ThemeToggle from "./ThemeToggleButton";
import { Button } from "./Button";
import { FaGoogle } from "react-icons/fa";
import AvatarHovered from "./AvatarHovered";
import { signIn, signOut, useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
type Props = {
	children: React.ReactNode;
	title?: string;
};

export const DEFAULT_COLORS = () =>
	"text-primary-dark transition-colors dark:text-primary-light";
const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const Layout: FC<Props> = ({ children, title }) => {
	const { data: session } = useSession();
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<div className="flex bg-primary-light text-primary-dark-500 dark:bg-primary-dark-500 dark:text-primary-light-500">
				{session ? <Sidebar /> : null}
				<div className="relative flex h-screen flex-1 flex-col items-center justify-center">
					<nav className="left-0 top-0 flex w-full items-center justify-between px-6 py-4 shadow-md">
						<ThemeToggle />
						<ul className="flex items-center justify-center gap-4 text-primary-dark-500 dark:text-primary-light-500">
							<Button
								size={"sm"}
								className=" flex items-center justify-center gap-2 font-semibold"
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
					<main
						className={twMerge(
							"mx-auto flex w-full flex-1 flex-col bg-gradient-to-r px-6 py-4 " +
								poppins.className
						)}
					>
						{children}
					</main>
				</div>
			</div>
		</>
	);
};
export default Layout;
