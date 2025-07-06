import Icon, { type IconTypes } from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IconOnlyProps {
	variant: 'iconOnly';
	leftIcon?: IconTypes;
	onLeftIconClick?: () => void;
}

interface IconWithTextProps {
	variant: 'iconWithText';
	leftIcon?: IconTypes;
	leftText: string;
	onLeftIconClick?: () => void;
}

interface IconWithTextAndRightIconProps {
	variant: 'iconWithTextAndRightIcon';
	leftIcon?: IconTypes;
	leftText: string;
	rightIcon: IconTypes;
	onLeftIconClick?: () => void;
	onRightIconClick?: () => void;
}

interface CenterTextProps {
	variant: 'centerText';
	centerText: string;
}

type INavBarProps = IconOnlyProps | IconWithTextProps | IconWithTextAndRightIconProps | CenterTextProps;

const NavBar = (props: INavBarProps) => {
	const renderContent = () => {
		switch (props.variant) {
			case 'iconOnly':
				return (
					<div className="flex items-center">
						<Icon name={props.leftIcon || 'back'} size={24} onClick={props.onLeftIconClick} />
					</div>
				);

			case 'iconWithText':
				return (
					<div className="flex items-center gap-4">
						<Icon name={props.leftIcon || 'back'} size={24} onClick={props.onLeftIconClick} />
						<Typography as="span" variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold tracking-[-0.004px]">
							{props.leftText}
						</Typography>
					</div>
				);

			case 'iconWithTextAndRightIcon':
				return (
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-4">
							<Icon name={props.leftIcon || 'back'} size={24} onClick={props.onLeftIconClick} />
							<Typography as="span" variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold tracking-[-0.004px]">
								{props.leftText}
							</Typography>
						</div>
						<Icon name={props.rightIcon} size={24} onClick={props.onRightIconClick} />
					</div>
				);

			case 'centerText':
				return (
					<div className="flex items-center justify-center w-full">
						<Typography as="span" variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold tracking-[-0.004px]">
							{props.centerText}
						</Typography>
					</div>
				);

			default:
				return null;
		}
	};

	return <nav className="h-[60px] px-5 py-4 bg-gray-01 shadow-[0px_0px_7px_0px_rgba(0,0,0,0.10)] flex items-center">{renderContent()}</nav>;
};

export default NavBar;
