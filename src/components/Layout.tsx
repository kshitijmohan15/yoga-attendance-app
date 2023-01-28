import { Poppins } from "@next/font/google";
import Head from "next/head";
import React, { FC } from "react";

import { twMerge } from "tailwind-merge";
type Props = {
	children: React.ReactNode;
};

export const DEFAULT_COLORS = () =>
	"bg-primary-light text-primary-dark transition-colors dark:bg-primary-dark dark:text-primary-light";
const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const Layout: FC<Props> = ({ children }) => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<main
				className={twMerge(
					"flex  min-h-screen flex-col items-center justify-center" +
						poppins.className,
					DEFAULT_COLORS()
				)}
			>
				{children}
			</main>
		</>
	);
};
export default Layout;
