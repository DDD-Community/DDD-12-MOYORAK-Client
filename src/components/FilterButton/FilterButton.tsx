import React from 'react';

import { cn } from '@/utils/shadcn';

interface IFilterButtonProps {
	children: React.ReactNode;
	variant?: 'general' | 'active' | 'clicked';
	onClick?: () => void;
	type?: 'button';
	borderRadius?: string;
	className?: string;
}

const FilterButton = ({ children, variant = 'general', onClick, className, borderRadius, type = 'button' }: IFilterButtonProps) => {
	const getFilterButtonClasses = () => {
		const baseClasses = `rounded-[${borderRadius}px] h-[32px] w-auto font-[Pretendard] text-sm not-italic font-medium leading-[143%] tracking-[0.14px]; px-[14px]`;

		//  todo : tailwind.config.js에서 theme.extend.colors에 추가한 후 사용
		switch (variant) {
			case 'general':
				return `${baseClasses} border-[1px] border-solid border-gray-05 bg-white text-gray-07 }`;
			case 'active':
				return `${baseClasses} bg-primary-200 text-primary-600`;
			case 'clicked':
				return `${baseClasses} border-[1px] border-solid border-primary-200 bg-[#9FD92626] text-[#70CE13] }`;
		}
	};

	return (
		<button className={cn(getFilterButtonClasses(), className)} onClick={onClick} type={type} tabIndex={-1}>
			{children}
		</button>
	);
};

export default FilterButton;
