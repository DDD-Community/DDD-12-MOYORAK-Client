import { useState } from 'react';

import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ITimePickerProps {
	value: string;
	onChange: (value: string) => void;
	displayValue?: string;
	disabled?: boolean;
}

const AM_PM_LIST: { ampm?: string; hour: number; minute: number }[] = [
	{ ampm: '오전', hour: 12, minute: 0 },
	{ ampm: '오후', hour: 1, minute: 5 },
	{ hour: 2, minute: 10 },
	{ hour: 3, minute: 15 },
	{ hour: 4, minute: 20 },
	{ hour: 5, minute: 25 },
	{ hour: 6, minute: 30 },
	{ hour: 7, minute: 35 },
	{ hour: 8, minute: 40 },
	{ hour: 9, minute: 45 },
	{ hour: 10, minute: 50 },
	{ hour: 11, minute: 55 },
];

const TimePicker = ({ value, onChange, disabled, displayValue }: ITimePickerProps) => {
	const [open, setOpen] = useState(false);

	const [ampm, time] = value.split(' ');
	const [hour, minute] = time.split(':');
	const selectedValue = {
		ampm,
		hour: Number(hour),
		minute: Number(minute),
	};

	const [tempSelected, setTempSelected] = useState(selectedValue);

	const handleOpen = () => {
		setTempSelected(selectedValue);
		setOpen(true);
	};

	const handleClickAmpm = (ampm: string) => setTempSelected((prev) => ({ ...prev, ampm }));
	const handleClickHour = (hour: number) => setTempSelected((prev) => ({ ...prev, hour }));
	const handleClickMinute = (minute: number) => setTempSelected((prev) => ({ ...prev, minute }));

	const handleApply = () => {
		onChange(`${tempSelected.ampm} ${tempSelected.hour}:${tempSelected.minute.toString().padStart(2, '0')}`);
		setOpen(false);
	};

	const isAmpmActive = (ampm?: string) => ampm && ampm === tempSelected.ampm;
	const isHourActive = (hour: number) => hour === tempSelected.hour;
	const isMinuteActive = (minute: number) => minute === tempSelected.minute;

	return (
		<div className="relative">
			<button type="button" className="flex items-center justify-between gap-2" onClick={() => !disabled && handleOpen()} disabled={disabled}>
				<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09}>
					{displayValue ?? value}
				</Typography>
				<Icon name="selectOpen" size={18} />
			</button>
			{open && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-label="close timepicker" />
					<div
						className="absolute left-1/2 -translate-x-1/2 top-10 z-50 bg-white rounded-2xl shadow-lg border p-0 w-[196px] overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="max-h-[240px] overflow-y-auto py-2">
							{AM_PM_LIST.map((row) => (
								<div key={`${row.ampm ?? ''}-${row.hour}-${row.minute}`} className="flex items-center px-2">
									<Typography
										variant={FONT_VARIANT.body02}
										fontColor={PALETTE.gray10}
										onClick={row.ampm ? () => handleClickAmpm(row.ampm!) : undefined}
										className={`w-[60px] h-[38px] text-center flex items-center justify-center ${isAmpmActive(row.ampm) && 'bg-lime-50'}`}
									>
										{row.ampm ? row.ampm : ''}
									</Typography>

									<span
										className={`w-[60px] h-[38px] text-center flex items-center justify-center ${isHourActive(row.hour) && 'bg-lime-50'}`}
										onClick={() => handleClickHour(row.hour)}
									>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
											{row.hour}
										</Typography>
									</span>
									<span
										className={`w-[60px] h-[38px] text-center flex items-center justify-center ${isMinuteActive(row.minute) && 'bg-lime-50'}`}
										onClick={() => handleClickMinute(row.minute)}
									>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
											{row.minute.toString().padStart(2, '0')}
										</Typography>
									</span>
								</div>
							))}
						</div>
						<div className="flex justify-between items-center border-t px-5 py-2 bg-white sticky bottom-0">
							<Typography variant={FONT_VARIANT.label01} className="font-semibold" fontColor={PALETTE.gray07}>
								현재
							</Typography>
							<button onClick={handleApply}>
								<Typography variant={FONT_VARIANT.label01} className="text-[#70CE13] font-semibold">
									적용
								</Typography>
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default TimePicker;
