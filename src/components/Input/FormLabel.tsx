import React from 'react';

import { FONT_COLOR, FONT_VARIANT, PALETTE } from '@/constants/styles';

export interface IFormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	id: string;
	label: string;
	isEssential?: boolean;
}

const FormLabel = ({ id, label, isEssential = false, className = '', ...props }: IFormLabelProps) => {
	return (
		<label
			htmlFor={id}
			className={`
        ${FONT_VARIANT.header04} 
        ${FONT_COLOR[PALETTE.gray09]} 
        my-[3px] 
        ${isEssential ? "after:content-['*'] after:ml-[5px] after:text-danger-01" : ''}
        ${className}
      `}
			{...props}
		>
			{label}
		</label>
	);
};

export default FormLabel;
