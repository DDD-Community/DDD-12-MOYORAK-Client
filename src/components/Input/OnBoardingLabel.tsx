import React from 'react';

import { FONT_COLOR, FONT_VARIANT, PALETTE } from '@/constants/styles';
import { cn } from '@/utils/shadcn';

export interface IOnBoardingLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	id?: string;
	label?: string;
	isEssential?: boolean;
	className?: string;
}

const OnBoardingLabel = ({ id, label, isEssential = false, className = '', ...props }: IOnBoardingLabelProps) => {
	return (
		<label
			htmlFor={id}
			className={cn(
				FONT_VARIANT.label01,
				FONT_COLOR[PALETTE.gray07],
				'block',
				isEssential && "after:content-['*'] after:ml-[5px] after:text-danger-01",
				className
			)}
			{...props}
		>
			{label}
		</label>
	);
};

export default OnBoardingLabel;
