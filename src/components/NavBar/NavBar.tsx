import Icon, { type IconTypes } from '@/components/Icon';

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

// todo : Typography 컴포넌트로 적용
const NavBar = (props: INavBarProps) => {
	const textStyle = 'text-[#121212] text-lg font-semibold leading-[144.5%] tracking-[-0.004px]';

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
						<span className={textStyle}>{props.leftText}</span>
					</div>
				);

			case 'iconWithTextAndRightIcon':
				return (
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-4">
							<Icon name={props.leftIcon || 'back'} size={24} onClick={props.onLeftIconClick} />
							<span className={textStyle}>{props.leftText}</span>
						</div>
						<Icon name={props.rightIcon} size={24} onClick={props.onRightIconClick} />
					</div>
				);

			case 'centerText':
				return (
					<div className="flex items-center justify-center w-full">
						<span className={textStyle}>{props.centerText}</span>
					</div>
				);

			default:
				return null;
		}
	};

	return <nav className="h-[60px] px-5 py-4 bg-[#FCFCFC] [box-shadow:0px_0px_7px_0px_rgba(0,_0,_0,_0.10)] flex items-center">{renderContent()}</nav>;
};

export default NavBar;
