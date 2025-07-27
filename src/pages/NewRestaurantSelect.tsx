import { useLocation, useNavigate } from 'react-router-dom';

import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const NewRestaurantSelect = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { restaurant } = (location.state as { restaurant?: { name: string } } | undefined) ?? {};

	const handleAddRestaurant = () => {
		navigate('/new-restaurant-registration', {
			state: {
				restaurant,
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

				<div className="flex flex-col gap-4.5 items-center">
					<div className="rounded-[5px] bg-white w-full h-[100px] flex items-center justify-between px-4.5 py-3.5">
						<div className="flex flex-col gap-[5px]">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								{restaurant?.name}
							</Typography>

							<div className="flex gap-[7px] items-center">
								<div className="w-[41px] h-[26px] rounded-[4px] bg-white border border-solid border-[#E9E9E9] flex items-center justify-center">
									<Typography variant={FONT_VARIANT.label01} className="text-[#70CE13]">
										주소
									</Typography>
								</div>
								<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="max-w-[200px]">
									서울특별시 강남구 도산대로 123
								</Typography>
							</div>
						</div>

						<FilterButton borderRadius="8.75" variant="active" onClick={handleAddRestaurant}>
							추가
						</FilterButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewRestaurantSelect;
