import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get } from '@/apis';
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

interface IRestaurantResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: IRestaurant[];
}

const RestaurantSearch = () => {
	const navigate = useNavigate();

	const [searchValue, setSearchValue] = useState('');
	const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
	const [searchPerformed, setSearchPerformed] = useState(false);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		if (!e.target.value.trim()) {
			setRestaurants([]);
			setSearchPerformed(false);
		}
	};

	const getRestaurants = async (keyword: string) => {
		if (!keyword.trim()) return;
		try {
			const response = await get<IRestaurantResponse>(`/restaurants/search?keyword=${keyword}&size=10&currentPage=1`);
			setRestaurants((response as IRestaurantResponse).data || []);
			setSearchPerformed(true);
		} catch (error) {
			console.error('식당 검색 API 에러:', error);
			setRestaurants([]);
			setSearchPerformed(true);
		}
	};

	useEffect(() => {
		if (!searchValue.trim()) {
			setRestaurants([]);
			setSearchPerformed(false);
			return;
		}

		const timeoutId = setTimeout(() => {
			getRestaurants(searchValue);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchValue]);

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
					className="flex items-center gap-0.5 px-3 w-[125px] h-[32px] bg-white rounded-[17px] pborder border-gray-05"
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
