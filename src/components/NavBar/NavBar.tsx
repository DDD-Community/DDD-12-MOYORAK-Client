import Icon, { type IconTypes } from '@/components/Icon';

interface BaseNavBarProps {
	variant: 'iconOnly' | 'iconWithText' | 'iconWithTextAndRightIcon' | 'centerText';
}

interface IconOnlyProps extends BaseNavBarProps {
	variant: 'iconOnly';
	leftIcon?: IconTypes;
	onLeftIconClick?: () => void;
}

interface IconWithTextProps extends BaseNavBarProps {
	variant: 'iconWithText';
	leftIcon?: IconTypes;
	leftText: string;
	onLeftIconClick?: () => void;
}

interface IconWithTextAndRightIconProps extends BaseNavBarProps {
	variant: 'iconWithTextAndRightIcon';
	leftIcon?: IconTypes;
	leftText: string;
	rightIcon: IconTypes;
	onLeftIconClick?: () => void;
	onRightIconClick?: () => void;
}

interface CenterTextProps extends BaseNavBarProps {
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
						<span className="text-[#121212] text-lg font-semibold leading-[144.5%] tracking-[-0.004px]">{props.leftText}</span>
					</div>
				);

			case 'iconWithTextAndRightIcon':
				return (
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-4">
							<Icon name={props.leftIcon || 'back'} size={24} onClick={props.onLeftIconClick} />
							<span className="text-[#121212] text-lg font-semibold leading-[144.5%] tracking-[-0.004px]">{props.leftText}</span>
						</div>
						<Icon name={props.rightIcon} size={24} onClick={props.onRightIconClick} />
					</div>
				);

			case 'centerText':
				return (
					<div className="flex items-center justify-center w-full">
						<span className="text-[#121212] text-lg font-semibold leading-[144.5%] tracking-[-0.004px]">{props.centerText}</span>
					</div>
				);

			default:
				return null;
		}
	};

	return <nav className="h-[60px] px-5 py-4 bg-[#FCFCFC] [box-shadow:0px_0px_7px_0px_rgba(0,_0,_0,_0.10)] flex items-center">{renderContent()}</nav>;
};

export default NavBar;

// const NavBarShowcase = () => {
// 	return (
// 		<div className="space-y-4 bg-gray-50 min-h-screen">
// 			{/* Case 1: 왼쪽 아이콘만 */}
// 			<NavBar variant="iconOnly" leftIcon="back" onLeftIconClick={() => console.log('Back clicked')} />

// 			{/* Case 2: 왼쪽 아이콘 + 왼쪽 글씨 */}
// 			<NavBar variant="iconWithText" leftIcon="back" leftText="제목" onLeftIconClick={() => console.log('Back clicked')} />

// 			{/* Case 3: 왼쪽 아이콘 + 왼쪽 글씨 + 오른쪽 아이콘 */}
// 			<NavBar
// 				variant="iconWithTextAndRightIcon"
// 				leftIcon="back"
// 				leftText="제목"
// 				rightIcon="close"
// 				onLeftIconClick={() => console.log('Back clicked')}
// 				onRightIconClick={() => console.log('Close clicked')}
// 			/>

// 			{/* Case 4: 가운데 글씨 */}
// 			<NavBar variant="centerText" centerText="제목" />
// 		</div>
// 	);
// };

// export default NavBarShowcase;
