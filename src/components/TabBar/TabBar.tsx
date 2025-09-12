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
		iconName: 'homeTab',
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
		<div className="fixed bottom-0 w-full px-2 z-[10000] max-w-[480px] mx-auto mb-3.5">
			<div
				className="
				flex
				h-[70px]
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
		</div>
	);
};

export default TabBar;
