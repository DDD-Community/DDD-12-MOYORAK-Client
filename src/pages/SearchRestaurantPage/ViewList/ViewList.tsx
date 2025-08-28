import { useMutationViewHistoryDelete } from '@/apis/useMutationViewHistoryDelete';
import type { IViewHistoryItem } from '@/apis/useQueryTeamViewHistory';
import IconButton from '@/components/Button/IconButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

interface IViewListProps {
	item: IViewHistoryItem;
	className?: string;
}

const ViewList = ({ item, className }: IViewListProps) => {
	const teamId = localStorage.getItem('teamId');
	const { mutate: mutateDelViewHistory } = useMutationViewHistoryDelete(Number(teamId), item.viewHistoryId);
	const { getCategoryDisplay } = useCategoryMapping();

	return (
		<li className={`flex pb-3.75 justify-between items-center ${className ?? ''}`}>
			<div className="flex items-center gap-3.75">
				<img src={item.reviewImagePath} alt="식당 사진" className="w-[71px] h-[71px] object-cover rounded-md" />

				<div className="flex flex-1 flex-col justify-between">
					<div className="flex justify-between items-center mb-1">
						<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
							{getCategoryDisplay(item.restaurantCategory)}
						</Typography>
					</div>

					<Typography variant={FONT_VARIANT.header03} className="font-semibold mb-[3px]">
						{item.restaurantName}
					</Typography>

					<div className="flex items-center gap-1">
						<Icon name="star" width={14} height={14} />
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{item.averageReviewScore}
						</Typography>
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
							{`· 리뷰 ${item.reviewCount}`}
						</Typography>
					</div>
				</div>
			</div>

			<IconButton
				onClick={() => mutateDelViewHistory()}
				iconStyle={{
					name: 'delete',
					width: 11.11,
					height: 11.11,
				}}
			/>
		</li>
	);
};

export default ViewList;
