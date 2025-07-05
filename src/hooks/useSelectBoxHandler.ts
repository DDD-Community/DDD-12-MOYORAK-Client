import { useCallback, useState } from 'react';

export const useSelectBoxHandler = <T extends string>(initialValue: T[number] | string, defaultOpen = false) => {
	const [selected, setSelected] = useState<T[number] | string>(initialValue);
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const onChangeOpen = useCallback(() => setIsOpen((prev) => !prev), []);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const onSelect = useCallback(
		(value: T[number]) => {
			setSelected(value);
			close();
		},
		[close]
	);

	return {
		selected,
		isOpen,
		onChangeOpen,
		open,
		close,
		onSelect,
		setSelected,
	};
};
