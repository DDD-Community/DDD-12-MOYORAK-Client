import { useLocation, useNavigate } from 'react-router-dom';

import { type IconTypes } from '@/components/Icon';

import TabItem from './TabItem';

const tabItems = [
	{
		path: '/',
		iconName: 'home' as IconTypes,
		activeIconName: 'activeHome' as IconTypes,
		label: '홈',
	},
	{
		path: '/search',
		iconName: 'search' as IconTypes,
		activeIconName: 'activeSearch' as IconTypes,
		label: '검색',
	},
	{
		path: '/pot',
		iconName: 'pot' as IconTypes,
		activeIconName: 'activePot' as IconTypes,
		label: '팟 만들기',
	},
	{
		path: '/mypage',
		iconName: 'mypage' as IconTypes,
		activeIconName: 'activeMypage' as IconTypes,
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
				flex
				h-[60px]
				z-[9999]
				bg-white
				shadow-[0px_-1px_7px_0px_rgba(0,0,0,0.10)]
				px-[20px]
				justify-between
				items-center
			"
		>
			{tabItems.map((item) => (
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
