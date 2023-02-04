import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./Modal";
import { FC } from "react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./Button";
type Props = {
	setOpen: Dispatch<SetStateAction<boolean>>;
	onAccept: any;
	open: boolean;
};

const DeleteModal: FC<Props> = ({ setOpen, onAccept, open }) => {
	return (
		<Dialog open={open}>
			<DialogContent setOpen={setOpen}>
				<DialogHeader>
					<DialogTitle>Are you sure absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<Button
					onClick={() => onAccept()}
					className="bg-red-600 text-primary-light hover:bg-red-400  dark:bg-red-100 dark:text-red-700 dark:hover:bg-red-500"
				>
					Yes{" "}
				</Button>
			</DialogContent>
		</Dialog>
	);
};
export default DeleteModal;
