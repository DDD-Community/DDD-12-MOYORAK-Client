import { forwardRef, type ReactNode, useImperativeHandle, useState } from 'react';

import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Typography from '../Typography';

import { Dialog, DialogContent, DialogFooter, DialogHeader } from './BaseDialog';

export interface ICustomDialogRef {
	open: () => void;
	close: () => void;
}

interface ICustomDialogProps {
	headerText: {
		title: string;
		description?: string;
	};
	children?: ReactNode;
}

export const CustomDialog = forwardRef<ICustomDialogRef, ICustomDialogProps>(({ headerText, children }, ref) => {
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
		close: () => setOpen(false),
	}));

	return (
		<Dialog open={open}>
			<form>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-[7px]">
							{headerText.title}
						</Typography>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray05}>
							{headerText.description}
						</Typography>
					</DialogHeader>
					<DialogFooter>{children}</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
});

export default CustomDialog;
