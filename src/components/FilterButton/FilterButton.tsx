import React from 'react';

interface IFilterButtonProps {
	children: React.ReactNode;
	variant?: 'general' | 'active' | 'clicked';
	onClick?: () => void;
	borderRadius: string;
}

const FilterButton = ({ children, variant = 'general', onClick, borderRadius }: IFilterButtonProps) => {
	const getFilterButtonClasses = () => {
		const baseClasses = 'h-[32px] w-auto font-[Pretendard] text-sm not-italic font-medium leading-[143%] tracking-[0.14px]; px-[14px]';

		//  todo : tailwind.config.js에서 theme.extend.colors에 추가한 후 사용
		switch (variant) {
			case 'general':
				return `${baseClasses} border-[1px] border-solid border-[var(--Grayscale-C4C4C4,#C4C4C4)] bg-[#FFF] text-[#8A8A8A] }`;
			case 'active':
				return `${baseClasses} bg-[#BEEE05] text-[#1F2511] 5)] }`;
			case 'clicked':
				return `${baseClasses} border-[1px] border-solid border-[var(--Primary-82DC28,#BEEE05)] bg-[#9FD92626] text-[#70CE13] }`;
		}
	};

	return (
		<button className={getFilterButtonClasses()} style={{ borderRadius: `${borderRadius}px` }} onClick={onClick}>
			{children}
		</button>
	);
};

export default FilterButton;
