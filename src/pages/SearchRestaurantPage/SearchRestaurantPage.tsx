import { useState } from 'react';

import { useQueryTeamSearchHistory } from '@/apis/useQueryTeamSearchHistory';
import { useQueryTeamViewHistory } from '@/apis/useQueryTeamViewHistory';
import noInquiryData from '@/assets/noInquiryData.png';
import noSearchData from '@/assets/noSearchData.png';
import SearchInput from '@/components/Input/SearchInput';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import SearchList from './SearchList/SearchList';
import ViewList from './ViewList/ViewList';

const SearchRestaurantPage = () => {
	const teamId = localStorage.getItem('teamId');
	const { data: searchList } = useQueryTeamSearchHistory(Number(teamId));
	const { data: viewList } = useQueryTeamViewHistory(Number(teamId));
	const [searchValue, setSearchValue] = useState('');

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	return (
		<div className="bg-gray-02 min-h-screen">
			<div className="sticky top-0 z-10 px-4 py-3 bg-gray-02 border-b-0">
				<SearchInput placeholder="찾으려는 식당을 검색해 주세요" id="restaurantName" onChange={handleSearch} value={searchValue} />
			</div>

			{/* 컨텐츠 */}
			<div className="px-4">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="mt-5.5 mb-3 font-semibold">
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
					{(!searchList || searchList.searchHistories.length === 0) && (
						<div className="h-40 flex flex-col gap-3.25 items-center justify-center text-center">
							<img src={noSearchData} alt="noSearchData" className="w-11.25 h-11.5" />
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
								최근 검색한 기록이 없어요.
							</Typography>
						</div>
					)}
				</section>

				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="mt-5.5 mb-3 font-semibold">
					최근 조회한 식당
				</Typography>
				<section className="bg-white rounded-[20px] px-4.5 py-6.5 mb-20">
					{viewList && viewList.viewHistories.length > 0 && (
						<ul className="flex flex-col gap-3.75">
							{viewList.viewHistories.map((item, index) => (
								<ViewList key={item.viewHistoryId} item={item} className={index !== viewList.viewHistories.length - 1 ? 'border-b-[1px] border-gray-02' : ''} />
							))}
						</ul>
					)}
					{(!viewList || viewList.viewHistories.length === 0) && (
						<div className="h-40 flex flex-col gap-3.25 items-center justify-center text-center">
							<img src={noInquiryData} alt="noInquiryData" className="w-10 h-11" />
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
								최근 조회한 식당이 없어요.
							</Typography>
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default SearchRestaurantPage;
