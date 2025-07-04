import type { InputHTMLAttributes } from 'react';

import Icon, { type IconTypes } from '../Icon';

interface ISearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
	type: 'primary' | 'secondary';
	searchIconName?: IconTypes;
	className?: string;
}

const SearchBar = ({ type, searchIconName, id, value, placeholder, className, ...props }: ISearchBarProps) => {
	return (
		<div className="flex">
			<input
				id={id}
				name={id}
				placeholder={placeholder}
				value={value}
				className={`w-full px-[18px] py-[14px] placeholder:text-xl placeholder:font-semibold 
                    ${type === 'primary' ? '' : 'bg-gray-03'}
                    ${className}`}
				{...props}
			/>
			<Icon name={searchIconName ?? 'search'} />
		</div>
	);
};

export default SearchBar;
