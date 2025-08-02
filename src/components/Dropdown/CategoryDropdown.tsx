import { useEffect, useRef } from 'react';

import { FONT_VARIANT } from '@/constants/styles';

import Icon from '../Icon';

interface ICategoryDropdownProps<T extends string> {
	isOpen: boolean;
	selected: T;
	onChangeOpen: () => void;
	onChange: (selected: T) => void;
	optionList: T[];
	placeholder?: string;
}

const CategoryDropdown = <T extends string>({ isOpen, selected, onChange, onChangeOpen, optionList, placeholder }: ICategoryDropdownProps<T>) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
				onChangeOpen();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onChangeOpen]);

	const handleOptionClick = (item: T) => {
		onChange(item);
		onChangeOpen();
	};

	return (
		<div ref={dropdownRef} className="relative w-full mb-2.5">
			<button
				type="button"
				onClick={onChangeOpen}
				className="w-full px-5 py-[13px] rounded-[20px] text-left border border-gray-300 bg-white flex justify-between items-center"
			>
				<span className={selected ? '' : 'text-[#8A8A8A]'}>{selected || placeholder}</span>
				<Icon name={isOpen ? 'categorySelectClose' : 'selectOpen'} width={18} height={18} />
			</button>

			{isOpen && (
				<div className="w-full bg-white border border-gray-200 rounded-[20px] shadow-md mt-[7px] ">
					{optionList.map((item) => {
						return (
							<button
								key={item}
								type="button"
								onClick={() => handleOptionClick(item)}
								className={`w-full px-4 text-left hover:bg-[#F5FDDA] 
							first:rounded-t-[20px]
							last:rounded-b-[20px]
							`}
							>
								<div className={`flex justify-between items-center py-3 ${FONT_VARIANT.header04} text-gray-08 hover:text-[#70CE13] group`}>
									{item}

									<Icon name="categoryOption" size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default CategoryDropdown;
