import React from 'react';

interface IButtonProps {
	children: React.ReactNode;
	variant?: 'disabled' | 'general' | 'active' | 'clicked';
	onClick?: () => void;
}

const Button = ({ children, variant = 'general', onClick }: IButtonProps) => {
	const getButtonClasses = () => {
		const baseClasses = 'h-[50px] min-w-[120px] w-full font-[Pretendard] text-base font-medium leading-[150%] tracking-[0.091px] rounded-[10px]';

		//  todo : tailwind.config.js에서 theme.extend.colors에 추가한 후 사용
		switch (variant) {
			case 'disabled':
				return `${baseClasses} bg-[#ECECEC] text-[#B0B0B0] cursor-not-allowed`;
			case 'general':
				return `${baseClasses} border-[1px] border-solid border-[var(--Grayscale-C4C4C4,#DCDCDC)] bg-[#FFF] text-[#5C5C5C]`;
			case 'active':
				return `${baseClasses} bg-[#BEEE05] text-[#1F2511]`;
			case 'clicked':
				return `${baseClasses} border-[1px] border-solid border-[var(--Primary-82DC28,#BEEE05)] bg-[#9FD92626] text-[#70CE13]`;
		}
	};

	return (
		<button className={getButtonClasses()} onClick={onClick} disabled={variant === 'disabled'}>
			{children}
		</button>
	);
};

export default Button;
