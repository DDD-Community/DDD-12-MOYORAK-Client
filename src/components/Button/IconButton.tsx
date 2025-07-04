import type { ButtonHTMLAttributes } from 'react';

import Icon, { type IconProps } from '../Icon';

interface IIConButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	iconStyle: IconProps;
}

const IconButton = ({ iconStyle, onClick, ...props }: IIConButtonProps) => {
	return (
		<button onClick={onClick} {...props}>
			<Icon {...iconStyle} />
		</button>
	);
};

export default IconButton;
