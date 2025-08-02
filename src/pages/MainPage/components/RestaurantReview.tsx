import IconButton from '@/components/Button/IconButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IRestaurantProps {
	id: number;
	name: string;
	score: number;
	review: number;
}

const RestaurantReview = ({ item }: { item: IRestaurantProps }) => {
	return (
		<li className="flex items-start gap-3">
			<img src="" alt="식당 사진" className="w-[71px] h-[71px] object-cover rounded-md" />

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
					{item.name}
				</Typography>

				{/* 별점과 리뷰는 하단 한 줄 */}
				<div className="flex items-center gap-1 text-gray-600">
					<Icon name="star" width={14} height={14} />
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
						{item.score}
					</Typography>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
						{`· 리뷰 ${item.review}`}
					</Typography>
				</div>
			</div>
		</li>
	);
};

export default RestaurantReview;
