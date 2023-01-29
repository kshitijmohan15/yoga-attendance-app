import { Poppins } from "@next/font/google";
import Head from "next/head";
import React, { FC } from "react";

import { twMerge } from "tailwind-merge";
type Props = {
	children: React.ReactNode;
};

export const DEFAULT_COLORS = () =>
	"text-primary-dark transition-colors dark:text-primary-light";
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
					"flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-primary-light to-primary-light-600 dark:from-primary-dark-600 dark:to-primary-dark-500 " +
						poppins.className
				)}
			>
				{children}
			</main>
		</>
	);
};
export default Layout;
