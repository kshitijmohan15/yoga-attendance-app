import { Inter } from "@next/font/google";
import ThemeToggle from "../components/ThemeToggleButton";
import Layout from "../components/Layout";
import { Button } from "../components/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AvatarHovered from "../components/AvatarHovered";

function Index() {
	const { data: session } = useSession();

	return (
		<Layout title="Login">
			<section className="flex h-full w-full items-center justify-center">
				{!session ? (
					<div className="mx-auto flex h-auto w-full max-w-xl flex-col rounded-xl bg-white dark:bg-primary-dark-600">
						<form
							action=""
							className="flex h-full w-full flex-col gap-3 px-8 py-12 text-xl font-semibold text-blue-600 dark:text-gray-200"
						>
							{/* <h1 className="mb-4 text-4xl text-primary-dark dark:text-white">
								Login
							</h1> */}
							{/* <label className="block ">
							<span className="text-md font-medium text-gray-500 dark:text-gray-200">
								Email
							</span>
							<input
								type="text"
								className="text-md mt-1 w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
							/>
						</label>
						<label className="block ">
							<span className="text-md font-medium text-gray-500 dark:text-gray-200">
								Password
							</span>
							<input
								type="text"
								className="text-md mt-1 w-full rounded-md py-2 px-2 font-normal text-primary-dark shadow-md focus:border-blue-400 focus:ring-0 dark:border-[1px] dark:border-primary-light-500/10 dark:bg-primary-dark-600 dark:text-primary-light-500 dark:shadow-sm"
							/>
						</label> */}
							<div className="flex w-full justify-center">
								<div>TRY LOGGING IN!</div>
							</div>
						</form>
					</div>
				) : null}
			</section>
		</Layout>
	);
}

export default Index;
