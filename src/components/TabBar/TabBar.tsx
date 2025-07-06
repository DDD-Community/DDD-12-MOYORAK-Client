import { useLocation, useNavigate } from 'react-router-dom';

import type { IconTypes } from '../Icon';

import TabItem from './TabItem';

interface ITabItems {
	path: string;
	iconName: IconTypes;
	activeIconName: IconTypes;
	label: string;
}

const TAB_ITEMS: ITabItems[] = [
	{
		path: '/',
		iconName: 'home',
		activeIconName: 'activeHome',
		label: '홈',
	},
	{
		path: '/search',
		iconName: 'search',
		activeIconName: 'activeSearch',
		label: '검색',
	},
	{
		path: '/pot',
		iconName: 'pot',
		activeIconName: 'activePot',
		label: '팟 만들기',
	},
	{
		path: '/mypage',
		iconName: 'mypage',
		activeIconName: 'activeMypage',
		label: 'MY',
	},
];

const TabBar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleClick = (path: string) => {
		navigate(path);
	};

	return (
		<div
			className="
				fixed
				w-full
				bottom-0
				flex
				h-[70px]
				z-[9999]
				bg-primary-500
				shadow-[0px_-1px_7px_0px_rgba(0,0,0,0.10)]
				px-[30px]
				py-[15px]
				justify-between
				items-center
				rounded-[30px]
			"
		>
			{TAB_ITEMS.map((item) => (
				<TabItem
					key={item.path}
					path={item.path}
					iconName={item.iconName}
					activeIconName={item.activeIconName}
					label={item.label}
					currentPath={location.pathname}
					onClick={handleClick}
				/>
			))}
		</div>
	);
};

export default TabBar;
