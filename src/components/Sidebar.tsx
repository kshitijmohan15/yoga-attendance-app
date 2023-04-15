import React from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { SiZoom } from "react-icons/si";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { Inter } from "@next/font/google";
import Link from "next/link";

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
const Sidebar = ({
	setShowSidebar,
}: {
	setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			id="Sidebar"
			className={twMerge(
				" sticky top-0 left-0 hidden h-screen w-full transform flex-col items-start justify-start bg-transparent transition duration-500 ease-in-out sm:w-80 md:flex xl:translate-x-0 xl:rounded-r",
				SIDEBAR_DEFAULT_COLORS()
			)}
		>
			<div className="items-center justify-between space-x-3 whitespace-nowrap px-6 py-4 xl:flex  ">
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
				<Link
					className="flex w-full items-center justify-start  "
					href={"/dashboard"}
				>
					<SidebarButton className="flex w-full items-center justify-start space-x-6 ">
						<RxDashboard />
						<p className="text-lg font-normal leading-4  ">
							Dashboard
						</p>
					</SidebarButton>
				</Link>
				<Link
					className="flex w-full items-center justify-start space-x-6"
					href={"/students"}
				>
					<SidebarButton className="flex w-full items-center justify-start space-x-6 ">
						<FaUsers />
						<p className="text-lg font-normal leading-4">
							Students
						</p>
					</SidebarButton>
				</Link>
				<Link
					className="flex w-full items-center justify-start space-x-6"
					href={"/csv"}
				>
					<SidebarButton className="flex w-full items-center justify-start space-x-6 ">
						<SiZoom fontSize={25} />
						<p className="text-lg font-normal leading-4">
							Upload Zoom Report
						</p>
					</SidebarButton>
				</Link>
			</div>
		</motion.div>
	);
};

export default Sidebar;
