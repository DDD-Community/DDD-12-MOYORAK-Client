'use client';

import * as React from 'react';

import IconButton from '../Button/IconButton';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';

import { Calendar } from './Calendar';

interface IDatePickerProps {
	date: string;
	onChangeDate: (birth: string) => void;
}

export const DatePicker = ({ date, onChangeDate }: IDatePickerProps) => {
	const [open, setOpen] = React.useState<boolean>(false);

	const handleSelectDate = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			const year = selectedDate.getFullYear();
			const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
			const day = selectedDate.getDate().toString().padStart(2, '0');
			const localDateStr = `${year}/${month}/${day}`;
			onChangeDate(localDateStr);
		}
	};

	return (
		<div className="flex flex-col gap-3 absolute right-2 top-1/2 -translate-y-1/2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<IconButton
						iconStyle={{
							name: 'calendar',
						}}
					/>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0 bg-white shadow-lg border border-gray-200 z-50" align="start">
					<Calendar
						mode="single"
						selected={date ? new Date(date) : undefined}
						captionLayout="dropdown"
						onSelect={(date) => {
							handleSelectDate(date);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default DatePicker;
