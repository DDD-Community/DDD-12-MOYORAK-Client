import Icon, { type IconTypes } from '@/components/Icon';

interface TabItemProps {
	path: string;
	iconName: IconTypes;
	activeIconName: IconTypes;
	label: string;
	currentPath: string;
	onClick: (path: string) => void;
}

const TabItem = ({ path, iconName, activeIconName, label, currentPath, onClick }: TabItemProps) => {
	const isActive = currentPath === path;

	return (
		<button onClick={() => onClick(path)}>
			<div className="flex flex-col gap-[6px] items-center">
				<Icon name={isActive ? activeIconName : iconName} />
				<span className="text-[#303030] text-center font-[Pretendard] text-[11px] not-italic font-medium leading-[11.719px]">{label}</span>
			</div>
		</button>
	);
};

export default TabItem;
