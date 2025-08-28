import { useState } from 'react';

import { useQueryTeamRestaurantList } from '@/apis/useQueryTeamRestaurantList';
import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

const FILTER_TYPES = {
	DISTANCE: '거리순',
	RATING: '평점순',
	RECENT: '최신순',
} as const;

type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

interface IAddRestaurantPopupProps {
	onClose: (
		newRestaurants?: Array<{
			teamRestaurantId: number;
			restaurantName: string;
			restaurantCategory: string;
			averageReviewScore: number;
			reviewCount: number;
			reviewImagePath: string;
		}>
	) => void;
	existingRestaurantIds: number[]; // 이미 추가된 식당 ID들
}

const MAX_TOTAL_RESTAURANTS = 5;

const AddRestaurantPopup = ({ onClose, existingRestaurantIds }: IAddRestaurantPopupProps) => {
	const [sortOption, setSortOption] = useState<FilterType>(FILTER_TYPES.DISTANCE);
	const [searchValue, setSearchValue] = useState<string>('');
	const [newSelectedIds, setNewSelectedIds] = useState<number[]>([]);
	const [selectedOpen, setSelectedOpen] = useState<boolean>(false);
	const { getCategoryDisplay } = useCategoryMapping();
	const [currentPage, setCurrentPage] = useState(1);

	const teamId = localStorage.getItem('teamId') ?? '';

	const size = 5;

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

	// TanStack Query 훅 사용
	const apiSortOption = getSortOptionForAPI(sortOption);
	const { data: teamRestaurantList, isLoading } = useQueryTeamRestaurantList(teamId.toString(), apiSortOption, size, currentPage);

	// 추가 가능한 식당 개수
	const remainingSlots = MAX_TOTAL_RESTAURANTS - existingRestaurantIds.length;

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		setCurrentPage(1);
	};

	// 새로운 식당 선택/해제
	const handleNewSelect = (id: number) => {
		// 이미 추가된 식당은 선택 불가
		if (existingRestaurantIds.includes(id)) return;

		// 새로 선택할 수 있는 개수 제한
		if (newSelectedIds.length >= remainingSlots && !newSelectedIds.includes(id)) return;

		if (newSelectedIds.includes(id)) {
			setNewSelectedIds(newSelectedIds.filter((sid) => sid !== id));
			return;
		}

		setNewSelectedIds([...newSelectedIds, id]);
	};

	// 새로 선택된 식당 삭제
	const handleRemoveNewSelected = (id: number) => {
		setNewSelectedIds(newSelectedIds.filter((sid) => sid !== id));
	};

	// 필터링: 검색어에 맞고, 선택되지 않은 식당들
	const filteredRestaurants =
		teamRestaurantList?.data?.filter(
			(r) => r.restaurantName.includes(searchValue) && !existingRestaurantIds.includes(r.teamRestaurantId) && !newSelectedIds.includes(r.teamRestaurantId)
		) || [];

	// 모든 선택된 식당 정보 (기존 + 새로 선택된)
	const allSelectedIds = [...existingRestaurantIds, ...newSelectedIds];
	const selectedRestaurants = teamRestaurantList?.data?.filter((r) => allSelectedIds.includes(r.teamRestaurantId)) || [];

	// 새로 선택된 식당 정보
	const newSelectedRestaurants = teamRestaurantList?.data?.filter((r) => newSelectedIds.includes(r.teamRestaurantId)) || [];

	// 완료 버튼 클릭 시 새로 선택된 식당들만 전달
	const handleComplete = () => {
		onClose(newSelectedRestaurants);
	};

	// 로딩 상태 처리
	if (isLoading) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					로딩 중...
				</Typography>
			</div>
		);
	}

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar
				variant="iconWithText"
				leftText="식당 추가하기"
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
							<span className="font-medium ml-1">{allSelectedIds.length}</span>
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
											{getCategoryDisplay(r.restaurantCategory)}
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
									{/* 기존 식당은 삭제 불가, 새로 선택된 식당만 삭제 가능 */}
									{existingRestaurantIds.includes(r.teamRestaurantId) ? (
										<div className="w-[22px] h-[22px] bg-gray-04 rounded-full flex items-center justify-center">
											<Icon name="close" size={12} className="text-gray-06" />
										</div>
									) : (
										<Icon name="validInput" size={22} className="cursor-pointer" onClick={() => handleRemoveNewSelected(r.teamRestaurantId)} />
									)}
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

					<div className="flex flex-col gap-5">
						{filteredRestaurants.map((r) => (
							<div
								key={r.teamRestaurantId}
								className="flex items-center gap-[15px] cursor-pointer border-b border-gray-03 pb-[15px]"
								onClick={() => handleNewSelect(r.teamRestaurantId)}
							>
								<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]">
									{r.reviewImagePath && <img src={r.reviewImagePath} alt={r.restaurantName} className="w-full h-full object-cover rounded-[6.656px]" />}
								</div>
								<div className="flex-1">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
										{getCategoryDisplay(r.restaurantCategory)}
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
								<div className="w-[22px] h-[22px] border border-gray-05 rounded-full" />
							</div>
						))}
					</div>
				</div>

				<div className="fixed bottom-[30px] left-0 w-full px-4.5">
					<Button variant={newSelectedIds.length > 0 ? 'active' : 'disabled'} onClick={handleComplete}>
						선택 완료
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddRestaurantPopup;
