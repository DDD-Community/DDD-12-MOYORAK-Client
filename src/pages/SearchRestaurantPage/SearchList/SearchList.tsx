import { useMutationSeachHistoryDelete } from '@/apis/useMutationSeachHistoryDelete';
import type { ISearchItem } from '@/apis/useQueryTeamSearchHistory';
import IconButton from '@/components/Button/IconButton';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ISearchListProps {
	item: ISearchItem;
	className?: string;
}

const SearchList = ({ item, className }: ISearchListProps) => {
	const teamId = localStorage.getItem('teamId');
	const { mutate: mutateDelSearchHistory } = useMutationSeachHistoryDelete(Number(teamId), item.id);

	return (
		<li>
			<div className={`flex items-center pt-3 pb-4 py-[26px] ${className ?? ''}`}>
				<Typography variant={FONT_VARIANT.body01}>{item.keyword}</Typography>
				<div className="flex items-center ml-auto gap-2">
					<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
						{item.createdDate}
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
