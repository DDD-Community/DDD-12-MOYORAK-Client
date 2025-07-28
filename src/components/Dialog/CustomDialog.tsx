import { type ReactNode } from 'react';

import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { cn } from '@/utils/shadcn';

import Typography from '../Typography';

import { Dialog, DialogContent, DialogFooter, DialogHeader } from './BaseDialog';

interface ICustomDialogProps {
	headerText: {
		title: string;
		description?: string;
	};
	children?: ReactNode;
	onOpen: boolean;
	onOpenChange: (onOpen: boolean) => void;
	showCloseButton?: boolean;
	className?: string;
}

export const CustomDialog = ({ headerText, children, onOpen, onOpenChange, showCloseButton = false, className }: ICustomDialogProps) => {
	return (
		<Dialog open={onOpen} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={showCloseButton} className={cn('sm:max-w-[425px]', className)}>
				<DialogHeader>
					<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-[7px] font-semibold">
						{headerText.title}
					</Typography>
					{headerText.description && (
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
							{headerText.description}
						</Typography>
					)}
				</DialogHeader>
				<DialogFooter>{children}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CustomDialog;

/**
 * @example
 * 
 * - useDialogHandler 사용하여 핸들링
 * const { open, setOpen, handleOpen, handleClose } = useDialogHandler();
 * 
 * <CustomDialog
		onOpen={open}
		onOpenChange={setOpen}
			headerText={{
				title: '타이틀',
				description: '설명',
			}}
		>
			<Button onClick={handleClose}>닫기</Button>
			</CustomDialog>
 */
