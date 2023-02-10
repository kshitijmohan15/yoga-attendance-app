import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const ListItem = ({
	intent,
	children,
	classNames,
	...props
}: VariantProps<typeof listStyles> & {
	children: React.ReactNode;
	classNames?: string;
}) => {
	return (
		<div {...props} className={twMerge(listStyles({ intent }), classNames)}>
			{children}
		</div>
	);
};
const listStyles = cva(
	"flex h-28 cursor-pointer flex-row items-center rounded-md  px-4 py-6 transition duration-300 ease-in-out",
	{
		variants: {
			intent: {
				default:
					"bg-primary-light text-primary-dark hover:bg-primary-light-600/30 dark:bg-primary-dark dark:text-primary-light dark:hover:bg-primary-dark-600",
				paid: "text-green-700 bg-green-200 hover:bg-green-300 dark:text-green-200 dark:bg-green-700 dark:hover:bg-green-800",
				unpaid: "text-red-700 bg-red-200 hover:bg-red-300 dark:text-red-200 dark:bg-red-700 dark:hover:bg-red-800",
				paused: "text-yellow-700 bg-yellow-200 hover:bg-yellow-300 dark:text-yellow-200 dark:bg-yellow-700 dark:hover:bg-yellow-800",
			},
		},
	}
);

export default ListItem;
