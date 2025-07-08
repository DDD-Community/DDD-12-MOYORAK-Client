import { type ReactNode } from 'react';

interface IButtonProps {
	children: ReactNode;
	variant?: 'disabled' | 'general' | 'active' | 'clicked';
	onClick?: () => void;
	className?: string;
}

const Button = ({ children, variant = 'general', onClick, className }: IButtonProps) => {
	const getButtonClasses = () => {
		const baseClasses =
			'h-[50px] min-w-[89px] w-full font-heading text-base font-medium leading-[150%] tracking-[0.091px] rounded-[20px] transition-colors duration-200';

		switch (variant) {
			case 'disabled':
				return `${baseClasses} bg-gray-03 text-gray-05 cursor-not-allowed`;
			case 'general':
				return `${baseClasses} border border-gray-03 bg-white text-gray-07 hover:bg-gray-01`;
			case 'active':
				return `${baseClasses} bg-primary-200 text-primary-600 hover:bg-primary-300`;
			case 'clicked':
				return `${baseClasses} border border-primary-200 bg-primary-200/30 text-[#70CE13]`;
			default:
				return `${baseClasses} border border-gray-03 bg-white text-gray-07`;
		}
	};

	return (
		<button className={`${getButtonClasses()} ${className ?? ''}`} onClick={onClick} disabled={variant === 'disabled'}>
			{children}
		</button>
	);
};

export default Button;
