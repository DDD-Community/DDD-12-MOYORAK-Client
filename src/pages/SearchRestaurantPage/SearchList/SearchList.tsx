import { useMutationSeachHistoryDelete } from '@/apis/useMutationSeachHistoryDelete';
import type { ISearchItem } from '@/apis/useQueryTeamSearchHistory';
import IconButton from '@/components/Button/IconButton';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ISearchListProps {
	item: ISearchItem;
	className?: string;
	isLast?: boolean;
}

const SearchList = ({ item, className, isLast = false }: ISearchListProps) => {
	const teamId = localStorage.getItem('teamId');
	const { mutate: mutateDelSearchHistory } = useMutationSeachHistoryDelete(Number(teamId), item.id);

	return (
		<li>
			<div className={`flex items-center ${isLast ? '' : 'pb-3.75'} ${className ?? ''}`}>
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09} className="font-medium">
					{item.keyword}
				</Typography>
				<div className="flex items-center ml-auto gap-2">
					<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
						{item.createdDate.split('T')[0]}
					</Typography>
					<IconButton
						onClick={() => mutateDelSearchHistory()}
						iconStyle={{
							name: 'delete',
							width: 10,
							height: 10,
						}}
					/>
				</div>
			</div>
		</li>
	);
};

export default SearchList;
