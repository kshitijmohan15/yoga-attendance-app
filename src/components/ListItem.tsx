import { cva, type VariantProps } from "class-variance-authority";
import React, { MouseEvent } from "react";
import { twMerge } from "tailwind-merge";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

function getHoverColor(intent: string) {
	switch (intent) {
		case "unpaid":
			return "#fabfbf";
		case "paid":
			return "#d1fae5";
		case "info":
			return "#dbeafe";
		case "paused":
			return "#fefcbf";
		case "default":
			return "#e5e7eb";
		default:
			return "#d1fae5";
	}
}

const ListItem = ({
	intent,
	children,
	classNames,
	...props
}: VariantProps<typeof listStyles> & {
	children: React.ReactNode;
	classNames?: string;
}) => {
	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);
	function handleMouseMove({ clientX, clientY, currentTarget }: MouseEvent) {
		let { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}
	return (
		<div className={twMerge(listStyles({ intent }), classNames)}>
			<motion.div
				style={{
					background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${getHoverColor(
						intent ?? "default"
					)}, transparent 80%)`,
				}}
				className="absolute inset-0 px-4 opacity-0 transition duration-300 group-hover:opacity-80"
				onMouseMove={handleMouseMove}
				{...props}
			></motion.div>
			<div
				onMouseMove={handleMouseMove}
				className="z-10 flex w-full items-center px-6"
			>
				{children}
			</div>
		</div>
	);
};
const listStyles = cva(
	"flex h-28 flex-row group items-center overflow-hidden rounded-md relative flex-row transition duration-300 ease-in-out group",
	{
		variants: {
			intent: {
				default:
					"bg-primary-light-600 text-primary-dark dark:bg-primary-dark dark:text-primary-light dark:hover:bg-primary-dark-600",
				paid: "text-green-700 bg-green-300 dark:text-green-200 dark:bg-green-700 dark:hover:bg-green-800",
				unpaid: "text-red-700 bg-red-200 dark:text-red-200 dark:bg-red-700 dark:hover:bg-red-800",
				paused: "text-yellow-700 bg-yellow-200 dark:text-yellow-200 dark:bg-yellow-700 dark:hover:bg-yellow-800",
			},
		},
	}
);

export default ListItem;
