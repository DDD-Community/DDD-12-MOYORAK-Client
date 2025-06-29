import Icon, { type IconTypes } from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
interface ITabItemProps {
	path: string;
	iconName: IconTypes;
	activeIconName: IconTypes;
	label: string;
	currentPath: string;
	onClick: (path: string) => void;
}

const TabItem = ({ path, iconName, activeIconName, label, currentPath, onClick }: ITabItemProps) => {
	const isActive = currentPath === path;

	return (
		<button onClick={() => onClick(path)}>
			<div className="flex flex-col gap-[6px] items-center">
				<Icon name={isActive ? activeIconName : iconName} />
				<Typography as="span" variant={FONT_VARIANT.caption02} fontColor={isActive ? PALETTE.primary200 : PALETTE.gray07}>
					{label}
				</Typography>
			</div>
		</button>
	);
};

export default TabItem;
