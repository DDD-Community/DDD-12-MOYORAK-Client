import { forwardRef, type InputHTMLAttributes, useMemo } from 'react';

import { FONT_COLOR, FONT_VARIANT, PALETTE } from '@/constants/styles';

import Icon from '../Icon';
import Typography from '../Typography';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
	isEssential?: boolean;
	label?: string;
	value?: string;
	isSuccess?: boolean;
	isError?: boolean;
	message?: string;
}

const BORDER_COLOR = {
	[PALETTE.danger01]: 'border-b-danger-01',
	[PALETTE.gray03]: 'border-b-gray-03',
	[PALETTE.primary200]: 'border-b-primary-200',
};

const Input = forwardRef<HTMLInputElement, IInputProps>(
	({ isEssential, label, id, isSuccess = false, isError = false, message, placeholder, value, ...rest }, ref) => {
		const borderClass = useMemo(() => {
			if (isError) return BORDER_COLOR[PALETTE.danger01];
			if (!value) return BORDER_COLOR[PALETTE.gray03];
			return BORDER_COLOR[PALETTE.primary200];
		}, [isError, value]);

		return (
			<div>
				{label && (
					<label
						htmlFor={id}
						className={`${FONT_VARIANT.header04} ${FONT_COLOR[PALETTE.gray09]} my-[3px] ${isEssential ? `after:content-['*'] after:ml-[5px] after:text-danger-01` : ''}`}
					>
						{label}
					</label>
				)}

				<div className="relative">
					<input
						ref={ref}
						id={id}
						placeholder={placeholder}
						value={value}
						name={id}
						{...rest}
						className={`w-full ${FONT_VARIANT.header02} py-[7px] mb-[10px] placeholder:text-xl placeholder:text-gray-05 placeholder:font-semibold border-b-[1px] ${borderClass}`}
					/>

					{(isError || isSuccess) && (
						<Icon name={isSuccess ? 'validInputIcon' : 'invalidInputIcon'} width={22} className="absolute -translate-y-1/2 right-2 top-1/2" />
					)}
				</div>
				{message && <Typography variant={FONT_VARIANT.body02}>{message}</Typography>}
			</div>
		);
	}
);

export default Input;
