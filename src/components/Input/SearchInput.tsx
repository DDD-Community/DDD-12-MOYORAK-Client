import { forwardRef, type InputHTMLAttributes } from 'react';

import Icon from '@/components/Icon';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
	value?: string;
}

const SearchInput = forwardRef<HTMLInputElement, IInputProps>(({ id, type = 'text', onChange, placeholder, value, ...rest }, ref) => {
	return (
		<div className={`relative w-full px-4.5 py-3.5 bg-white rounded-[20px] ${value ? 'border-[1px] border-primary-200' : 'border-[1px] border-gray-03'}`}>
			<input
				ref={ref}
				id={id}
				name={id}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				type={type}
				className={` 
                ${FONT_VARIANT.header03}
                ${PALETTE.gray09}
                w-full
                placeholder:text-gray-07 placeholder:font-medium
                focus:outline-none
                cursor-text
            `}
				{...rest}
			/>
			<Icon name="search" width={22} className="absolute right-4.5 top-1/2 -translate-y-1/2 cursor-pointer" />
		</div>
	);
});

export default SearchInput;
