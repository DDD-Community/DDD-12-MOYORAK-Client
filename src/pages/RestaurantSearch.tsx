import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import searchCharacter from '@/assets/searchCharacter.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import SearchInput from '@/components/Input/SearchInput';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MOCK_RESTAURANTS = [
	{
		id: 1,
		name: '육지로 간 고래 선릉점',
		address: '서울 강남구 선릉로 82길 47',
	},
	{
		id: 2,
		name: '육지로 간 고래 강남점',
		address: '서울 강남구 강남대로 25길 4',
	},
	{
		id: 3,
		name: '육지로 간 고래 논현점',
		address: '서울 강남구 강남대로 25길 4',
	},
];

const RestaurantSearch = () => {
	const navigate = useNavigate();

	const [searchValue, setSearchValue] = useState('');
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const filteredRestaurants = searchValue ? MOCK_RESTAURANTS.filter((restaurant) => restaurant.name.toLowerCase().includes(searchValue.toLowerCase())) : [];

	const handleRegister = (restaurant: (typeof MOCK_RESTAURANTS)[0]) => {
		navigate('/restaurant-registration', { state: { restaurant } });
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

				{searchValue ? (
					<div className="mt-5.5">
						{filteredRestaurants.length > 0 ? (
							<div className="flex flex-col gap-4.5 bg-white rounded-[20px] justify-between px-4.5 py-6.5">
								{filteredRestaurants.map((restaurant) => (
									<div
										key={restaurant.id}
										className="flex items-center justify-between 
									last:border-b-0
									border-b border-gray-02 
									last:pb-0
									pb-4.5"
									>
										<div className="flex items-center gap-2.5">
											<Icon name="pot" size={20} />
											<div className="flex flex-col">
												<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
													{restaurant.name}
												</Typography>
												<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
													{restaurant.address}
												</Typography>
											</div>
										</div>
										<FilterButton variant="active" borderRadius="8.75" onClick={() => handleRegister(restaurant)}>
											등록
										</FilterButton>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col gap-5 pt-5.5">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray09}>
									{searchValue}은 아직 모여락에 등록되어 있지 않습니다. 모여락에 추가하시겠습니까?
								</Typography>
								<FilterButton
									variant="general"
									borderRadius="17"
									width="125px"
									onClick={() =>
										navigate('/new-restaurant-select', {
											state: { restaurant: { name: searchValue } },
										})
									}
								>
									식당 추가하기
								</FilterButton>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-2.5 items-center justify-center pt-40">
						<img src={searchCharacter} alt="searchCharacter" className="w-[130px] h-[222px]" />
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
							어떤 식당을 찾으시나요?
						</Typography>
					</div>
				)}
			</div>
		</div>
	);
};

export default RestaurantSearch;
