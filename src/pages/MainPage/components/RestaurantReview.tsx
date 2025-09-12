import { useNavigate } from 'react-router-dom';

import type { ITeamRestaurantItem } from '@/apis/useQueryTeamRestaurantList';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

const RestaurantReview = ({ item }: { item: ITeamRestaurantItem }) => {
	const navigate = useNavigate();
	const { getCategoryDisplay } = useCategoryMapping();

	const handleRestaurantClick = () => {
		navigate(`/restaurant-detail/${item.teamRestaurantId}`);
	};

	return (
		<>
			<li className="flex items-center gap-3.75 pb-3.75 border-b border-gray-02">
				<img src={item.reviewImagePath} alt="식당 사진" className="w-[71px] h-[71px] object-cover rounded-md cursor-pointer" onClick={handleRestaurantClick} />

				<div className="flex flex-1 flex-col justify-between">
					<div className="flex justify-between items-center">
						<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
							{getCategoryDisplay(item.restaurantCategory)}
						</Typography>
					</div>

					<Typography variant={FONT_VARIANT.header04} className="font-semibold mb-[3px] cursor-pointer" onClick={handleRestaurantClick}>
						{item.restaurantName}
					</Typography>

					<div className="flex items-center gap-1 text-gray-600">
						<Icon name="star" width={14} height={14} />
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{item.averageReviewScore}
						</Typography>
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{`· 리뷰 ${item.reviewCount}`}
						</Typography>
					</div>
				</div>
			</li>
		</>
	);
};

export default RestaurantReview;
