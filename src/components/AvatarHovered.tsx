import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";
import { type FC } from "react";
type Props = {
	imgURL: string;
	user: {
		id: string;
	} & {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
};

const AvatarHovered: FC<Props> = ({ imgURL, user }) => {
	return (
		<HoverCard>
			<HoverCardTrigger className="cursor-pointer">
				<img
					width={40}
					height={40}
					src={imgURL}
					className="rounded-full"
				/>
			</HoverCardTrigger>
			<HoverCardContent className="relative">
				<div className=" space-y-2">
					<p className="text-sm font-semibold">Hey {user.name}!</p>
					<p className="text-sm text-gray-300">{user.email}</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default AvatarHovered;
