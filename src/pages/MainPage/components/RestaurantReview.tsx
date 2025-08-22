import type { ITeamRestaurantItem } from '@/apis/useQueryTeamRestaurantList';
import IconButton from '@/components/Button/IconButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const RestaurantReview = ({ item }: { item: ITeamRestaurantItem }) => {
	return (
		<li className="flex items-start gap-3">
			<img src={item.reviewImagePath} alt="식당 사진" className="w-[71px] h-[71px] object-cover rounded-md" />

			<div className="flex flex-1 flex-col justify-between">
				<div className="flex justify-between items-center mb-1">
					<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
						카테고리
					</Typography>
					<IconButton
						iconStyle={{
							name: 'more',
						}}
					/>
				</div>

				<Typography variant={FONT_VARIANT.header03} className="font-semibold mb-[3px]">
					{item.restaurantName}
				</Typography>

				<div className="flex items-center gap-1 text-gray-600">
					<Icon name="star" width={14} height={14} />
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
						{item.averageReviewScore}
					</Typography>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
						{`· 리뷰 ${item.reviewCount}`}
					</Typography>
				</div>
			</div>
		</li>
	);
};

export default RestaurantReview;
