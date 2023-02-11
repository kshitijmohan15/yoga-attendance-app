import { Skeleton } from "@mui/material";

export const ListSkeleton = () => {
	return (
		<div className="cursor-progress">
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
			<Skeleton height={50} animation="wave" />
		</div>
	);
};
