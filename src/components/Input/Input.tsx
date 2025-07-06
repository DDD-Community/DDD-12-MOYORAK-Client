import { forwardRef, type InputHTMLAttributes, useMemo } from 'react';

import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Icon from '../Icon';
import Typography from '../Typography';

import FormLabel, { type IFormLabelProps } from './FormLabel';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
	isEssential?: boolean;
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

const Input = forwardRef<HTMLInputElement, IInputProps & IFormLabelProps>(
	({ isEssential, label, id, type = 'text', isSuccess = false, isError = false, message, placeholder, value, ...rest }, ref) => {
		const borderClass = useMemo(() => {
			if (isError) return BORDER_COLOR[PALETTE.danger01];
			if (!value) return BORDER_COLOR[PALETTE.gray03];
			return BORDER_COLOR[PALETTE.primary200];
		}, [isError, value]);

		return (
			<div>
				{label && <FormLabel id={id} isEssential={isEssential} label={label} />}
				<div className="relative">
					<input
						ref={ref}
						id={id}
						name={id}
						placeholder={placeholder}
						value={value}
						type={type}
						className={`
              w-full ${FONT_VARIANT.header02} py-[7px] pr-[48px] mb-[10px]
              placeholder:text-xl placeholder:text-gray-05 placeholder:font-semibold
              border-b-[1px] ${borderClass}
              cursor-text
            `}
						{...rest}
					/>

					{(isError || isSuccess) && (
						<Icon name={isSuccess ? 'validInputIcon' : 'invalidInputIcon'} width={22} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
					)}
				</div>

				{message && <Typography variant={FONT_VARIANT.body02}>{message}</Typography>}
			</div>
		);
	}
);

export default Input;
