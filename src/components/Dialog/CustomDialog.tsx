import { useState } from 'react';
import { DialogPortal } from '@radix-ui/react-dialog';

import Button from '../Button/Button';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './BaseDialog';

export const CustomDialog = () => {
	const [open, setOpen] = useState<boolean>(false);

	const handleOpen = () => {
		setOpen((prev) => !prev);
	};

	console.log(open);

	return (
		<Dialog open={open}>
			<form>
				<DialogTrigger asChild>
					<button onClick={handleOpen}>Open Dialog</button>
				</DialogTrigger>
				<DialogPortal>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit profile</DialogTitle>
							<DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4">
							<div className="grid gap-3" />
							<div className="grid gap-3" />
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button onClick={handleOpen}>Cancel</Button>
							</DialogClose>
							<Button>Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</DialogPortal>
			</form>
		</Dialog>
	);
};

export default CustomDialog;
