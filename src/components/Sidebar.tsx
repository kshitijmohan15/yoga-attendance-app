import React from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { DEFAULT_COLORS } from "./Layout";
import { procedureTypes } from "@trpc/server";

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
				"dark:hover:bg-light bg-primary-light text-primary-dark hover:text-primary-light dark:bg-primary-dark dark:text-primary-light dark:hover:bg-primary-light dark:hover:text-primary-dark",
				className
			)}
		>
			{children}
		</Button>
	);
};

const Sidebar = () => {
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				id="Main"
				className={twMerge(
					"top-0 left-0 hidden h-screen w-full transform  flex-col items-start justify-start transition duration-500 ease-in-out sm:w-72 md:flex xl:translate-x-0 xl:rounded-r",
					DEFAULT_COLORS()
				)}
			>
				<div className=" items-center justify-start space-x-3 whitespace-nowrap p-6 xl:flex  ">
					<p className="w-full  text-3xl leading-6">
						Yoga Attendance
					</p>
				</div>
				<div className="mt-6 flex w-full flex-col items-center justify-start space-y-3 p-6 ">
					<SidebarButton className="flex w-full items-center justify-start space-x-6 rounded ">
						<RxDashboard />
						<p className="text-lg leading-4  ">Dashboard</p>
					</SidebarButton>
					<SidebarButton className="flex w-full items-center justify-start space-x-6 rounded ">
						<FaUsers />
						<p className="text-lg leading-4">Students</p>
					</SidebarButton>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default Sidebar;
