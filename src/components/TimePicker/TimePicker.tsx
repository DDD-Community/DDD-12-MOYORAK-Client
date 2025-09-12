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

const AM_PM_OPTIONS = ['오전', '오후'];
const HOUR_OPTIONS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

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

	const isAmpmActive = (ampm: string) => ampm === tempSelected.ampm;
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
					<div className="fixed z-40" onClick={() => setOpen(false)} aria-label="close timepicker" />
					<div
						className="absolute left-1/2 -translate-x-1/2 top-10 z-50 rounded-[12px] border border-gray-04 bg-white shadow-sm p-0 w-[196px] overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex px-2">
							{/* 오전/오후 - 고정 */}
							<div className="w-[60px] py-2">
								{AM_PM_OPTIONS.map((ampm) => (
									<div
										key={ampm}
										className={`h-[38px] text-center flex items-center justify-center ${isAmpmActive(ampm) && 'bg-lime-50'}`}
										onClick={() => handleClickAmpm(ampm)}
									>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
											{ampm}
										</Typography>
									</div>
								))}
							</div>

							{/* 시간/분 - 스크롤 가능 */}
							<div className="flex max-h-[240px] overflow-y-auto py-2">
								<div className="w-[60px]">
									{HOUR_OPTIONS.map((hour) => (
										<div
											key={hour}
											className={`h-[38px] text-center flex items-center justify-center ${isHourActive(hour) && 'bg-lime-50'}`}
											onClick={() => handleClickHour(hour)}
										>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
												{hour}
											</Typography>
										</div>
									))}
								</div>

								<div className="w-[60px]">
									{MINUTE_OPTIONS.map((minute) => (
										<div
											key={minute}
											className={`h-[38px] text-center flex items-center justify-center ${isMinuteActive(minute) && 'bg-lime-50'}`}
											onClick={() => handleClickMinute(minute)}
										>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
												{minute.toString().padStart(2, '0')}
											</Typography>
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="flex justify-between items-center border-t border-gray-02 px-4.5 py-3.5 bg-white sticky bottom-0">
							<Typography variant={FONT_VARIANT.label01} className="font-semibold" fontColor={PALETTE.gray07} onClick={() => setOpen(false)}>
								취소
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
