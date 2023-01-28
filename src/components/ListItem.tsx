import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
interface Props {
	className?: string;
	children: React.ReactNode;
}
const ListItem = ({ className, children }: Props) => {
	return (
		<li className={twMerge("flex items-center font-semibold", className)}>
			{children}
		</li>
	);
};

export default ListItem;
