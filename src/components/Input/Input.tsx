import { forwardRef, type InputHTMLAttributes, type ReactNode, useMemo } from 'react';

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
	className?: string;
	rightButton?: ReactNode;
}

const BORDER_COLOR = {
	[PALETTE.danger01]: 'border-b-danger-01',
	[PALETTE.gray03]: 'border-b-gray-03',
	[PALETTE.primary200]: 'border-b-primary-200',
};

const Input = forwardRef<HTMLInputElement, IInputProps & Omit<IFormLabelProps, 'onChange'>>(
	(
		{ isEssential, label, id, type = 'text', isSuccess = false, onChange, isError = false, message, placeholder, value, className, rightButton, ...rest },
		ref
	) => {
		const borderClass = useMemo(() => {
			if (isError) return BORDER_COLOR[PALETTE.danger01];
			if (!value) return BORDER_COLOR[PALETTE.gray03];
			return BORDER_COLOR[PALETTE.primary200];
		}, [isError, value]);

		return (
			<div className={className}>
				{label && <FormLabel id={id} isEssential={isEssential} label={label} />}
				<div className="relative mb-[10px] flex">
					<input
						ref={ref}
						id={id}
						name={id}
						onChange={onChange}
						placeholder={placeholder}
						value={value}
						type={type}
						className={`
              w-full ${FONT_VARIANT.header02} py-[7px] pr-[48px]
              placeholder:text-xl placeholder:text-gray-05 placeholder:font-medium
              border-b-[1px] ${borderClass}
              cursor-text
            `}
						{...rest}
					/>

					{(isError || isSuccess) && (
						<Icon name={isSuccess ? 'validInput' : 'invalidInput'} width={22} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
					)}

					{rightButton && rightButton}
				</div>

				{message && (
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
						{message}
					</Typography>
				)}
			</div>
		);
	}
);

export default Input;
