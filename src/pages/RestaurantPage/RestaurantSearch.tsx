import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryRestaurantSearch } from '@/apis/useQueryRestaurantSearch';
import searchCharacter from '@/assets/searchCharacter.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IRestaurant {
	restaurantId: number;
	restaurantName: string;
	roadAddress: string;
}

const RestaurantSearch = () => {
	const navigate = useNavigate();

	const [searchValue, setSearchValue] = useState('');

	// TanStack Query 훅 사용
	const { data: restaurantResponse, isLoading } = useQueryRestaurantSearch(searchValue);
	const restaurants = restaurantResponse?.data || [];
	const searchPerformed = !!searchValue.trim();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleRegister = (restaurant: IRestaurant) => {
		navigate('/restaurant-registration', {
			state: {
				restaurant: {
					id: restaurant.restaurantId,
					name: restaurant.restaurantName,
				},
			},
		});
	};

	const renderSearchResults = () => {
		// 로딩 상태 처리
		if (isLoading && searchValue.trim()) {
			return (
				<div className="flex flex-col gap-2.5 items-center justify-center pt-40">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
						검색 중...
					</Typography>
				</div>
			);
		}

		if (!searchPerformed) {
			return (
				<div className="flex flex-col gap-2.5 items-center justify-center pt-40">
					<img src={searchCharacter} alt="searchCharacter" className="w-[130px] h-[222px]" />
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
						어떤 식당을 찾으시나요?
					</Typography>
				</div>
			);
		}

		if (restaurants.length > 0) {
			return (
				<div className="mt-5.5">
					<div className="flex flex-col gap-4.5 bg-white rounded-[20px] justify-between px-4.5 py-6.5">
						{restaurants.map((restaurant) => (
							<div
								key={restaurant.restaurantId}
								className="flex items-center justify-between 
								last:border-b-0
								border-b border-gray-02 
								last:pb-0
								pb-4.5"
							>
								<div className="flex items-center gap-2.5">
									<Icon name="location" size={28} />
									<div className="flex flex-col">
										<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
											{restaurant.restaurantName}
										</Typography>
										<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07} className="max-w-[184px]">
											{restaurant.roadAddress}
										</Typography>
									</div>
								</div>
								<div className="flex-shrink-0">
									<FilterButton variant="active" borderRadius="8.75" onClick={() => handleRegister(restaurant)}>
										등록
									</FilterButton>
								</div>
							</div>
						))}
					</div>

					<button
						className="flex items-center gap-0.5 px-3 h-[32px] bg-white rounded-[17px] border border-gray-05 mt-5.5"
						onClick={() =>
							navigate('/new-restaurant-select', {
								state: { restaurant: { name: searchValue } },
							})
						}
					>
						<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
							다른 식당 추가하기
						</Typography>
						<Icon name="arrow" size={18} />
					</button>
				</div>
			);
		}

		// 검색 결과가 없을 때
		return (
			<div className="flex flex-col gap-5 pt-5.5">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09}>
					{searchValue}은 아직 모여락에 등록되어 있지 않습니다. 모여락에 추가하시겠습니까?
				</Typography>
				<button
					className="flex items-center gap-0.5 px-3 w-[125px] h-[32px] bg-white rounded-[17px] border border-gray-05"
					onClick={() =>
						navigate('/new-restaurant-select', {
							state: { restaurant: { name: searchValue } },
						})
					}
				>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
						식당 추가하기
					</Typography>
					<Icon name="arrow" size={18} />
				</button>
			</div>
		);
	};

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar
				variant="iconWithText"
				leftText="식당 검색하기"
				onLeftIconClick={() => {
					navigate(-1);
				}}
			/>

			<div className="px-4.5 py-6.25">
				<SearchInput placeholder="찾으려는 식당을 검색해 주세요" id="restaurantName" onChange={handleSearch} value={searchValue} />

				{renderSearchResults()}
			</div>
		</div>
	);
};

export default RestaurantSearch;
