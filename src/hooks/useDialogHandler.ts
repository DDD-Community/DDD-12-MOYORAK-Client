import { useCallback, useState } from 'react';

const useDialogHandler = () => {
	const [open, setOpen] = useState<boolean>(false);

	const handleOpen = useCallback(() => setOpen(true), []);

	const handleClose = useCallback(() => setOpen(false), []);

	return {
		open,
		setOpen,
		handleOpen,
		handleClose,
	};
};

export default useDialogHandler;
