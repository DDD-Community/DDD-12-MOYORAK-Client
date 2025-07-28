import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { get } from '@/apis';
import noRestaurant from '@/assets/noRestaurant.png';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface INewRestaurantSelect {
	name: string;
	placeUrl: string;
	address: string;
	roadAddress: string;
	longitude: number;
	latitude: number;
}

interface INewRestaurantSelectResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: INewRestaurantSelect[];
}

const NewRestaurantSelect = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { restaurant } = (location.state as { restaurant?: { name: string } } | undefined) ?? {};
	const [newRestaurantSelect, setNewRestaurantSelect] = useState<INewRestaurantSelectResponse | null>(null);

	const getNewRestaurantSelect = async () => {
		try {
			const response = await get<INewRestaurantSelectResponse>(
				`/restaurants/external/search?query=${restaurant?.name}&longitude=127.043616&latitude=37.279838&radius=2000&page=1&size=15`
			);
			setNewRestaurantSelect(response as INewRestaurantSelectResponse);
		} catch (error) {
			console.error('식당 정보를 불러오는데 실패했습니다:', error);
		}
	};

	useEffect(() => {
		getNewRestaurantSelect();
	}, []);

	const handleAddRestaurant = (selectedRestaurant: INewRestaurantSelect) => {
		navigate('/new-restaurant-registration', {
			state: {
				restaurant: selectedRestaurant,
			},
			replace: true,
		});
	};

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar variant="iconWithText" leftIcon="back" leftText="신규 식당 추가하기" onLeftIconClick={() => navigate(-1)} />
			<div className="px-4.5 py-6.25">
				<div className="flex items-center justify-between px-4.5 py-3.5 rounded-[6px] bg-gray-03 mb-5.5">
					<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray09}>
						{restaurant?.name}
					</Typography>
					<Icon name="search" />
				</div>

				{newRestaurantSelect?.data.length === 0 ? (
					<div className="flex flex-col gap-5.25 items-center justify-center h-[calc(100vh-100px)]">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
							등록되어 있지 않은 식당이에요
						</Typography>
						<img src={noRestaurant} alt="noRestaurant" className="w-[158px] h-[152px]" />
					</div>
				) : (
					<div className="flex flex-col gap-4.5 items-center">
						{newRestaurantSelect?.data.map((item) => (
							<div key={item.name} className="rounded-[5px] bg-white w-full h-[100px] flex items-center justify-between px-4.5 py-3.5">
								<div className="flex flex-col gap-[5px]">
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
										{item.name}
									</Typography>

									<div className="flex gap-[7px] items-center">
										<div className="w-[41px] h-[26px] rounded-[4px] bg-white border border-solid border-[#E9E9E9] flex items-center justify-center">
											<Typography variant={FONT_VARIANT.label01} className="text-[#70CE13]">
												주소
											</Typography>
										</div>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="max-w-[200px]">
											{item.roadAddress}
										</Typography>
									</div>
								</div>

								<FilterButton borderRadius="8.75" variant="active" onClick={() => handleAddRestaurant(item)}>
									추가
								</FilterButton>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default NewRestaurantSelect;
