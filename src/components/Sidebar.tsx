import React from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { procedureTypes } from "@trpc/server";
import { Inter } from "@next/font/google";

const SidebarButton = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<Button
			className={twMerge(
				"bg-primary-light text-primary-dark hover:text-primary-light dark:bg-primary-dark dark:text-primary-light dark:hover:bg-primary-light dark:hover:text-primary-dark",
				className
			)}
		>
			{children}
		</Button>
	);
};

export const SIDEBAR_DEFAULT_COLORS = () =>
	"text-primary-dark transition-colors dark:text-primary-light";

const inter = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const Sidebar = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			id="Sidebar"
			className={twMerge(
				"top-0 left-0 hidden h-screen w-full transform flex-col items-start justify-start bg-transparent shadow-md transition duration-500 ease-in-out sm:w-80 md:flex xl:translate-x-0 xl:rounded-r",
				SIDEBAR_DEFAULT_COLORS()
			)}
		>
			<div className="items-center justify-start space-x-3 whitespace-nowrap px-6 py-4 xl:flex  ">
				<p
					className={
						"w-full  text-3xl font-semibold leading-6" +
						inter.className
					}
				>
					Yoga Attendance
				</p>
			</div>
			<div className="mt-6 flex w-full flex-col items-center justify-start space-y-3 p-6 ">
				<SidebarButton className="flex w-full items-center justify-start space-x-6 rounded ">
					<RxDashboard />
					<p className="text-lg font-normal leading-4  ">Dashboard</p>
				</SidebarButton>
				<SidebarButton className="flex w-full items-center justify-start space-x-6 rounded ">
					<FaUsers />
					<p className="text-lg font-normal leading-4">Students</p>
				</SidebarButton>
			</div>
		</motion.div>
	);
};

export default Sidebar;
