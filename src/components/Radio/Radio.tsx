import React from 'react';

import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface RadioProps {
	label: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
	name: string;
	disabled?: boolean;
	className?: string;
}

const Radio = ({ label, checked, onChange, value, name, disabled = false, className = '' }: RadioProps) => {
	return (
		<label className={`flex items-center  gap-2 cursor-pointer select-none ${className}`}>
			<span className="relative flex items-center w-[19px] h-[19px] ">
				<input
					type="radio"
					className="peer appearance-none w-full h-full rounded-full border-1 border-gray-05 checked:border-primary-200 "
					checked={checked}
					onChange={onChange}
					value={value}
					name={name}
					disabled={disabled}
				/>
				<span className="pointer-events-none absolute left-1/2 top-1/2 w-[11px] h-[11px] rounded-full bg-primary-200 opacity-0 peer-checked:opacity-100 peer-checked:bg-primary-200 -translate-x-1/2 -translate-y-1/2 transition" />
			</span>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09}>
				{label}
			</Typography>
		</label>
	);
};

export default Radio;
