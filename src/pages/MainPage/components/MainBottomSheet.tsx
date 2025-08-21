import { useState } from 'react';

import IconButton from '@/components/Button/IconButton';
import FilterButton from '@/components/FilterButton/FilterButton';

import CustomDrawer from './CustomDrawer';

const FILTER_TYPES = {
	DISTANCE: '거리순',
	RATING: '평점순',
	LATEST: '최신순',
} as const;

type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

const MainBottomSheet = () => {
	const [buttonType, setButtonType] = useState<FilterType>(FILTER_TYPES.DISTANCE);

	return (
		<CustomDrawer
			header={
				<>
					<div className="flex gap-2 mb-5 justify-between items-center">
						<div className="flex gap-2">
							<FilterButton
								borderRadius="17"
								variant={buttonType === FILTER_TYPES.DISTANCE ? 'active' : 'general'}
								onClick={() => setButtonType(FILTER_TYPES.DISTANCE)}
							>
								{FILTER_TYPES.DISTANCE}
							</FilterButton>
							<FilterButton
								borderRadius="17"
								variant={buttonType === FILTER_TYPES.RATING ? 'active' : 'general'}
								onClick={() => setButtonType(FILTER_TYPES.RATING)}
							>
								{FILTER_TYPES.RATING}
							</FilterButton>
							<FilterButton
								borderRadius="17"
								variant={buttonType === FILTER_TYPES.LATEST ? 'active' : 'general'}
								onClick={() => setButtonType(FILTER_TYPES.LATEST)}
							>
								{FILTER_TYPES.LATEST}
							</FilterButton>
						</div>
						<div className="w-8 h-8 rounded-full border-1 border-gray-05 flex items-center justify-center cursor-pointer">
							<IconButton
								iconStyle={{
									name: 'refresh',
									width: 18,
									height: 18,
									className: 'text-gray-06',
								}}
								onClick={undefined}
							/>
						</div>
					</div>
				</>
			}
		/>
	);
};

export default MainBottomSheet;
