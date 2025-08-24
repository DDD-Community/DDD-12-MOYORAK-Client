import { useQueryTeamSearchHistory } from '@/apis/useQueryTeamSearchHistory';
import { useQueryTeamViewHistory } from '@/apis/useQueryTeamViewHistory';
import IconButton from '@/components/Button/IconButton';
import Typography from '@/components/Typography';
import { FONT_VARIANT } from '@/constants/styles';

import SearchList from './SearchList/SearchList';
import ViewList from './ViewList/ViewList';

const SearchRestaurantPage = () => {
	const teamId = localStorage.getItem('teamId');
	const { data: searchList } = useQueryTeamSearchHistory(Number(teamId));
	const { data: viewList } = useQueryTeamViewHistory(Number(teamId));

	return (
		<div className="bg-gray-02 min-h-screen">
			<div className="sticky top-0 z-10 px-4 py-3 bg-gray-02 border-b-0">
				<div className="relative">
					<input type="text" placeholder="오늘은 따뜻한 국밥 어때요?" className="w-full py-[14px] pl-4 pr-10 bg-white shadow-md rounded-[20px]" />
					<IconButton iconStyle={{ name: 'search', width: 18, height: 18 }} className="absolute right-3 top-1/2 -translate-y-1/2" />
				</div>
			</div>

			{/* 컨텐츠 */}
			<div className="px-4">
				<Typography variant={FONT_VARIANT.body01} className="mt-4">
					최근 검색어
				</Typography>

				<section className="bg-white rounded-[20px] px-3.5">
					{searchList && searchList.searchHistories.length > 0 && (
						<ul>
							{searchList.searchHistories.map((item, index) => (
								<SearchList key={item.id} item={item} className={index !== searchList.searchHistories.length - 1 ? 'border-b-[1px] border-gray-06' : ''} />
							))}
						</ul>
					)}
					{(!searchList || searchList.searchHistories.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>

				<Typography variant={FONT_VARIANT.body01} className="mt-4">
					최근 조회한 식당
				</Typography>
				<section className="bg-white rounded-[20px] px-3.5">
					{viewList && viewList.viewHistories.length > 0 && (
						<ul>
							{viewList.viewHistories.map((item, index) => (
								<ViewList key={item.viewHistoryId} item={item} className={index !== viewList.viewHistories.length - 1 ? 'border-b-[1px] border-gray-06' : ''} />
							))}
						</ul>
					)}
					{(!viewList || viewList.viewHistories.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>
			</div>
		</div>
	);
};

export default SearchRestaurantPage;
