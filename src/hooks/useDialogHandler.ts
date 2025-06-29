import { useRef } from 'react';

import type { ICustomDialogRef } from '@/components/Dialog/CustomDialog';

const useDialogHandler = () => {
	const dialogRef = useRef<ICustomDialogRef>(null);

	const handleOpen = () => {
		dialogRef.current?.open();
	};

	const handleClose = () => {
		dialogRef.current?.close();
	};

	return {
		dialogRef,
		handleOpen,
		handleClose,
	};
};

export default useDialogHandler;
