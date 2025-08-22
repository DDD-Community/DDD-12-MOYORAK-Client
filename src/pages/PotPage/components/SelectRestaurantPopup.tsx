import { useEffect, useState } from 'react';

import { get } from '@/apis';
import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const FILTER_TYPES = {
	DISTANCE: '거리순',
	RATING: '평점순',
	RECENT: '최신순',
} as const;

type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

interface ISelectRestaurantPopupProps {
	onClose: (
		selectedRestaurants?: Array<{
			teamRestaurantId: number;
			restaurantName: string;
			restaurantCategory: string;
			averageReviewScore: number;
			reviewCount: number;
			reviewImagePath: string;
		}>
	) => void;
	// 이미 선택된 식당 ID 목록을 받는 prop 추가
	initialSelectedIds?: number[];
}

const MAX_SELECTED_RESTAURANTS = 5;

interface ITeamRestaurantResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: Array<{
		teamRestaurantId: number;
		restaurantName: string;
		restaurantCategory: string;
		averageReviewScore: number;
		reviewCount: number;
		reviewImagePath: string;
	}>;
}

const SelectRestaurantPopup = ({ onClose, initialSelectedIds = [] }: ISelectRestaurantPopupProps) => {
	const [sortOption, setSortOption] = useState<FilterType>(FILTER_TYPES.DISTANCE);
	const [searchValue, setSearchValue] = useState<string>('');
	// 초기값으로 이미 선택된 식당 ID들을 설정
	const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
	const [selectedOpen, setSelectedOpen] = useState<boolean>(false);
	const [teamRestaurantList, setTeamRestaurantList] = useState<ITeamRestaurantResponse>();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const teamId = 1;
	const size = 10;
	const currentPage = 1;

	// API 호출 시 영어 값으로 변환하는 함수
	const getSortOptionForAPI = (filterType: FilterType): string => {
		switch (filterType) {
			case FILTER_TYPES.DISTANCE:
				return 'DISTANCE';
			case FILTER_TYPES.RATING:
				return 'RATING';
			case FILTER_TYPES.RECENT:
				return 'RECENT';
			default:
				return 'DISTANCE';
		}
	};

	const getTeamRestaurantList = async () => {
		const apiSortOption = getSortOptionForAPI(sortOption);
		const response = await get<ITeamRestaurantResponse>(`/teams/${teamId}/restaurants?size=${size}&currentPage=${currentPage}&sortOption=${apiSortOption}`);
		setTeamRestaurantList(response as ITeamRestaurantResponse);
	};

	useEffect(() => {
		getTeamRestaurantList();
	}, [sortOption]); // sortOption이 변경될 때마다 API 호출

	console.log(teamRestaurantList);

	// 선택/해제
	const handleSelect = (id: number) => {
		if (selectedIds.length >= MAX_SELECTED_RESTAURANTS && !selectedIds.includes(id)) return;

		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((sid) => sid !== id));
			return;
		}

		setSelectedIds([...selectedIds, id]);
	};
	// 선택된 식당 삭제
	const handleRemoveSelected = (id: number) => {
		setSelectedIds(selectedIds.filter((sid) => sid !== id));
	};

	// 검색 필터링 + 선택된 식당 제외 (API 데이터 사용)
	const filteredRestaurants =
		teamRestaurantList?.data?.filter((r) => r.restaurantName.includes(searchValue) && !selectedIds.includes(r.teamRestaurantId)) || [];

	// 선택된 식당 정보 (API 데이터 사용)
	const selectedRestaurants = teamRestaurantList?.data?.filter((r) => selectedIds.includes(r.teamRestaurantId)) || [];

	// 선택 완료 버튼 클릭 시 선택된 식당 데이터를 전달
	const handleComplete = () => {
		onClose(selectedRestaurants);
	};

	return (
		<div className="bg-gray-02 min-h-screen ">
			<NavBar
				variant="iconWithText"
				leftText="식당 선택하기"
				onLeftIconClick={() => {
					onClose();
				}}
			/>

			<div className="px-4.5 py-6.25">
				<SearchInput placeholder="찾으려는 식당을 검색해 주세요" id="restaurantName" onChange={handleSearch} value={searchValue} />

				<div className={`bg-white rounded-[20px] mt-5.5 mb-5.5 px-4.5 ${selectedOpen && selectedRestaurants.length > 0 ? 'py-5' : 'py-2.5'}`}>
					<div
						className={`flex items-center justify-between cursor-pointer ${selectedRestaurants.length > 0 && selectedOpen ? 'mb-5' : ''}`}
						onClick={() => setSelectedOpen((prev) => !prev)}
					>
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
							선택된 식당
							<span className="font-medium ml-1">{selectedIds.length}</span>
						</Typography>
						<Icon name={selectedOpen ? 'selectClose' : 'selectOpen'} width={16} />
					</div>
					{selectedOpen && selectedRestaurants.length > 0 && (
						<div className="flex flex-col gap-5">
							{selectedRestaurants.map((r) => (
								<div key={r.teamRestaurantId} className="flex items-center gap-[15px]">
									<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]">
										{r.reviewImagePath && <img src={r.reviewImagePath} alt={r.restaurantName} className="w-full h-full object-cover rounded-[6.656px]" />}
									</div>
									<div className="flex-1">
										<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
											{r.restaurantCategory}
										</Typography>
										<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-1 font-semibold">
											{r.restaurantName}
										</Typography>
										<div className="flex items-center gap-1">
											<Icon name="star" width={11} />
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
												{r.averageReviewScore}
											</Typography>
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
												· 리뷰 {r.reviewCount}
											</Typography>
										</div>
									</div>
									<Icon name="validInput" size={22} className="cursor-pointer" onClick={() => handleRemoveSelected(r.teamRestaurantId)} />
								</div>
							))}
						</div>
					)}
				</div>

				{/* 식당 리스트 */}
				<div className="bg-white rounded-[20px] px-4.5 py-6.5">
					<div className="flex gap-2 mb-5">
						<FilterButton
							borderRadius="17"
							variant={sortOption === FILTER_TYPES.DISTANCE ? 'active' : 'general'}
							onClick={() => setSortOption(FILTER_TYPES.DISTANCE)}
						>
							{FILTER_TYPES.DISTANCE}
						</FilterButton>
						<FilterButton
							borderRadius="17"
							variant={sortOption === FILTER_TYPES.RATING ? 'active' : 'general'}
							onClick={() => setSortOption(FILTER_TYPES.RATING)}
						>
							{FILTER_TYPES.RATING}
						</FilterButton>
						<FilterButton
							borderRadius="17"
							variant={sortOption === FILTER_TYPES.RECENT ? 'active' : 'general'}
							onClick={() => setSortOption(FILTER_TYPES.RECENT)}
						>
							{FILTER_TYPES.RECENT}
						</FilterButton>
					</div>

					<div className="flex flex-col gap-5 ">
						{filteredRestaurants.map((r) => (
							<div
								key={r.teamRestaurantId}
								className="flex items-center gap-[15px] cursor-pointer border-b border-gray-03 pb-[15px]"
								onClick={() => handleSelect(r.teamRestaurantId)}
							>
								<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]">
									{r.reviewImagePath && <img src={r.reviewImagePath} alt={r.restaurantName} className="w-full h-full object-cover rounded-[6.656px]" />}
								</div>
								<div className="flex-1">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
										{r.restaurantCategory}
									</Typography>
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-1">
										{r.restaurantName}
									</Typography>
									<div className="flex items-center gap-1">
										<Icon name="star" width={11} />
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
											{r.averageReviewScore}
										</Typography>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
											· 리뷰 {r.reviewCount}
										</Typography>
									</div>
								</div>
								{/* 체크표시 - 이미 선택된 식당도 체크 표시 */}
								{selectedIds.includes(r.teamRestaurantId) ? (
									<Icon name="validInput" width={22} className="text-primary-200" />
								) : (
									<div className="w-[22px] h-[22px] border border-gray-05 rounded-full" />
								)}
							</div>
						))}
					</div>
				</div>

				<div className="fixed bottom-[30px] left-0 w-full px-4.5">
					<Button variant={selectedIds.length > 0 ? 'active' : 'disabled'} onClick={handleComplete}>
						선택 완료
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SelectRestaurantPopup;
