import { FONT_VARIANT } from '@/constants/styles';

import Icon from '../Icon';

interface IDropdownProps<T extends string> {
	isOpen: boolean;
	selected: T;
	onChangeOpen: () => void;
	onChange: (selected: T) => void;
	optionList: T[];
}

const Dropdown = <T extends string>({ isOpen, selected, onChange, onChangeOpen, optionList }: IDropdownProps<T>) => {
	return (
		<div className="relative w-full mb-2.5">
			<button
				type="button"
				onClick={onChangeOpen}
				className="w-full px-5 py-[13px] rounded-[20px] text-left border border-gray-300 bg-white mb-[11px] flex justify-between items-center"
			>
				<span>{selected}</span>
				<Icon name={isOpen ? 'selectClose' : 'selectOpen'} width={18} height={18} />
			</button>

			{isOpen && (
				<div className="absolute z-10 w-full bg-white border border-gray-200 rounded-[20px] shadow-md">
					{optionList.map((item, index) => {
						const isLast = index === optionList.length - 1;

						return (
							<button key={item} type="button" onClick={() => onChange(item)} className={`w-full px-4 text-left hover:bg-gray-100`}>
								<div className={`flex justify-between items-center py-3 ${FONT_VARIANT.header04} text-gray-08 ${!isLast ? 'border-b border-gray-200' : ''}`}>
									{item}
									<Icon name="optionIcon" width={14} height={14} />
								</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
