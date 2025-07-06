import { type InputHTMLAttributes, useMemo } from 'react';

import { FONT_VARIANT } from '@/constants/styles';

import IconButton from '../Button/IconButton';
import { type IconTypes } from '../Icon';

export interface ISearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
	type: 'primary' | 'secondary';
	searchIconName?: IconTypes;
	className?: string;
}

const SearchBar = ({ type, searchIconName, id, value, placeholder, className, ...props }: ISearchBarProps) => {
	const searchTypeClass = useMemo(() => {
		return type === 'primary' ? 'bg-white rounded-[20px] focus:border-primary-200' : 'bg-gray-03 rounded-[6px]';
	}, [type]);

	return (
		<div className={`relative w-full`}>
			<input
				type={type}
				id={id}
				name={id}
				placeholder={placeholder}
				value={value}
				className={`
                     w-full pr-[48px] px-[18px] py-[14px] ${FONT_VARIANT.header03}
                     text-md placeholder:text-md placeholder:text-gray-07 placeholder:font-medium
                      border border-transparent
                      focus:border
                    focus:border-primary-200
                     cursor-text ${searchTypeClass} ${className}`}
				{...props}
			/>

			<IconButton
				iconStyle={{
					name: searchIconName ?? 'search',
					width: 22,
				}}
				className="absolute right-[12px] top-1/2 -translate-y-1/2 p-0"
			/>
		</div>
	);
};

export default SearchBar;
