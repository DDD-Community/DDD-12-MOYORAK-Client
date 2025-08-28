import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryTeamRestaurantSearch } from '@/apis/useQueryTeamRestaurantSearch';
import { useQueryTeamSearchHistory } from '@/apis/useQueryTeamSearchHistory';
import { useQueryTeamViewHistory } from '@/apis/useQueryTeamViewHistory';
import noInquiryData from '@/assets/noInquiryData.png';
import noSearchData from '@/assets/noSearchData.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

import SearchList from './SearchList/SearchList';
import ViewList from './ViewList/ViewList';

// 필터 타입 정의
const FILTER_TYPES = {
	DISTANCE: '거리순',
	RATING: '평점순',
	LATEST: '최신순',
} as const;

type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

// 필터 타입을 API 파라미터로 매핑
const getApiSortOption = (filterType: FilterType): 'DISTANCE' | 'RATING' | 'RECENT' => {
	switch (filterType) {
		case FILTER_TYPES.DISTANCE:
			return 'DISTANCE';
		case FILTER_TYPES.RATING:
			return 'RATING';
		case FILTER_TYPES.LATEST:
			return 'RECENT';
		default:
			return 'DISTANCE';
	}
};

const SearchRestaurantPage = () => {
	const navigate = useNavigate();
	const { getCategoryDisplay } = useCategoryMapping();
	const teamId = localStorage.getItem('teamId');
	const { data: searchList } = useQueryTeamSearchHistory(Number(teamId));
	const { data: viewList } = useQueryTeamViewHistory(Number(teamId));
	const [searchValue, setSearchValue] = useState('');
	const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<FilterType>(FILTER_TYPES.DISTANCE);

	// 디바운싱: 500ms 후에 검색어 업데이트
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchValue(searchValue);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchValue]);

	// 검색 요청 파라미터
	const searchRequest = useMemo(
		() => ({
			size: 10,
			currentPage: 1,
			keyword: debouncedSearchValue,
			sortOption: getApiSortOption(selectedFilter),
		}),
		[debouncedSearchValue, selectedFilter]
	);

	const { data: searchResults, isLoading: isSearchLoading } = useQueryTeamRestaurantSearch(teamId || '', searchRequest);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleFilterClick = (filterType: FilterType) => {
		setSelectedFilter(filterType);
	};

	const handleRestaurantClick = (teamRestaurantId: number) => {
		navigate(`/restaurant-detail/${teamRestaurantId}`);
	};

	// 검색어가 있으면 검색 결과를, 없으면 기존 UI를 보여줌
	const showSearchResults = searchValue.trim().length > 0;

	return (
		<div className="bg-gray-02 min-h-screen">
			<div className="sticky top-0 z-10 px-4 py-3 bg-gray-02 border-b-0">
				<SearchInput placeholder="찾으려는 식당을 검색해 주세요" id="restaurantName" onChange={handleSearch} value={searchValue} />
			</div>

			{/* 컨텐츠 */}
			<div className="px-4">
				{showSearchResults ? (
					/* 검색 결과 */
					<>
						<div className="flex items-center justify-between mt-5.5 mb-3">
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
								검색 결과
							</Typography>
						</div>

						{/* 필터 버튼들 */}
						<div className="flex gap-2 mb-4">
							{Object.entries(FILTER_TYPES).map(([key, value]) => (
								<FilterButton key={key} variant={selectedFilter === value ? 'active' : 'general'} onClick={() => handleFilterClick(value)} borderRadius="16">
									{value}
								</FilterButton>
							))}
						</div>

						<section className="bg-white rounded-[20px] px-4 py-4 mb-20">
							{isSearchLoading ? (
								<div className="h-40 flex items-center justify-center">
									<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
										검색 중...
									</Typography>
								</div>
							) : searchResults && searchResults.data.length > 0 ? (
								<ul className="flex flex-col gap-5">
									{searchResults.data.map((restaurant) => (
										<li key={restaurant.teamRestaurantId} className="flex items-start gap-3.75 pb-3.75 border-b border-gray-02 last:border-b-0 last:pb-0">
											<img
												src={restaurant.reviewImagePath || '/assets/noImage.png'}
												alt="식당 사진"
												className="w-[71px] h-[71px] object-cover rounded-md cursor-pointer"
												onClick={() => handleRestaurantClick(restaurant.teamRestaurantId)}
											/>

											<div className="flex flex-1 flex-col justify-between">
												<div className="flex justify-between items-center">
													<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
														{getCategoryDisplay(restaurant.restaurantCategory)}
													</Typography>
												</div>

												<Typography
													variant={FONT_VARIANT.header03}
													className="font-semibold mb-[3px] cursor-pointer"
													onClick={() => handleRestaurantClick(restaurant.teamRestaurantId)}
												>
													{restaurant.restaurantName}
												</Typography>

												<div className="flex items-center gap-1 text-gray-600">
													<Icon name="star" width={14} height={14} />
													<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
														{restaurant.averageReviewScore.toFixed(1)}
													</Typography>
													<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
														{`· 리뷰 ${restaurant.reviewCount}개`}
													</Typography>
												</div>
											</div>
										</li>
									))}
								</ul>
							) : (
								<div className="h-40 flex flex-col gap-3.25 items-center justify-center text-center">
									<img src={noSearchData} alt="noSearchData" className="w-11.25 h-11.5" />
									<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
										검색 결과가 없습니다.
									</Typography>
								</div>
							)}
						</section>
					</>
				) : (
					/* 기존 UI (최근 검색어, 최근 조회한 식당) */
					<>
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
										<ViewList
											key={item.viewHistoryId}
											item={item}
											className={index !== viewList.viewHistories.length - 1 ? 'border-b-[1px] border-gray-02' : ''}
										/>
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
					</>
				)}
			</div>
		</div>
	);
};

export default SearchRestaurantPage;
