import { useState } from 'react';

import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ISelectRestaurantPopupProps {
	onClose: () => void;
}

interface Restaurant {
	id: number;
	name: string;
	category: string;
	rating: number;
	reviewCount: number;
}

const mockRestaurants: Restaurant[] = [
	{ id: 1, name: '은희네 해장국', category: '카테고리', rating: 5.0, reviewCount: 50 },
	{ id: 2, name: '식당이름', category: '카테고리', rating: 5.0, reviewCount: 50 },
	{ id: 3, name: '식당이름', category: '카테고리', rating: 5.0, reviewCount: 50 },
	{ id: 4, name: '식당이름', category: '카테고리', rating: 5.0, reviewCount: 50 },
	{ id: 5, name: '식당이름', category: '카테고리', rating: 5.0, reviewCount: 50 },
	{ id: 6, name: '식당이름', category: '카테고리', rating: 5.0, reviewCount: 50 },
];

const SelectRestaurantPopup = ({ onClose }: ISelectRestaurantPopupProps) => {
	const [filterButton, setFilterButton] = useState<string>('distance');
	const [searchValue, setSearchValue] = useState<string>('');
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [selectedOpen, setSelectedOpen] = useState<boolean>(false);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	// 선택/해제
	const handleSelect = (id: number) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((sid) => sid !== id));
		} else if (selectedIds.length < 5) {
			setSelectedIds([...selectedIds, id]);
		}
	};

	// 선택된 식당 삭제
	const handleRemoveSelected = (id: number) => {
		setSelectedIds(selectedIds.filter((sid) => sid !== id));
	};

	// 검색 필터링 + 선택된 식당 제외
	const filteredRestaurants = mockRestaurants.filter((r) => r.name.includes(searchValue) && !selectedIds.includes(r.id));

	// 선택된 식당 정보
	const selectedRestaurants = mockRestaurants.filter((r) => selectedIds.includes(r.id));

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
								<div key={r.id} className="flex items-center gap-[15px]">
									<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]" />
									<div className="flex-1">
										<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
											{r.category}
										</Typography>
										<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-1 font-semibold">
											{r.name}
										</Typography>
										<div className="flex items-center gap-1">
											<Icon name="star" width={11} />
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
												{r.rating}
											</Typography>
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
												· 리뷰 {r.reviewCount}
											</Typography>
										</div>
									</div>
									<Icon name="validInput" size={22} className="cursor-pointer mx-2" onClick={() => handleRemoveSelected(r.id)} />
								</div>
							))}
						</div>
					)}
				</div>

				{/* 식당 리스트 */}
				<div className="bg-white rounded-[20px] px-4.5 py-6.5">
					<div className="flex gap-2 mb-5">
						<FilterButton borderRadius="17" variant={filterButton === 'distance' ? 'active' : 'general'} onClick={() => setFilterButton('distance')}>
							거리순
						</FilterButton>
						<FilterButton borderRadius="17" variant={filterButton === 'rating' ? 'active' : 'general'} onClick={() => setFilterButton('rating')}>
							평점순
						</FilterButton>
						<FilterButton borderRadius="17" variant={filterButton === 'latest' ? 'active' : 'general'} onClick={() => setFilterButton('latest')}>
							최신순
						</FilterButton>
					</div>

					<div className="flex flex-col gap-5 ">
						{filteredRestaurants.map((r) => (
							<div key={r.id} className="flex items-center gap-[15px] cursor-pointer border-b border-gray-03 pb-[15px]" onClick={() => handleSelect(r.id)}>
								<div className="w-[71px] h-[71px] bg-gray-04 rounded-[6.656px]" />
								<div className="flex-1">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
										{r.category}
									</Typography>
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="mb-1">
										{r.name}
									</Typography>
									<div className="flex items-center gap-1">
										<Icon name="star" width={11} />
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
											{r.rating}
										</Typography>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
											· 리뷰 {r.reviewCount}
										</Typography>
									</div>
								</div>
								{/* 체크표시 */}
								{selectedIds.includes(r.id) ? (
									<Icon name="validInput" width={22} className="text-primary-200" />
								) : (
									<div className="w-[22px] h-[22px] border border-gray-05 rounded-full" />
								)}
							</div>
						))}
					</div>
				</div>

				<div className="fixed bottom-[30px] left-0 w-full px-4.5">
					<Button variant={selectedIds.length > 0 ? 'active' : 'disabled'} onClick={onClose}>
						선택 완료
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SelectRestaurantPopup;
