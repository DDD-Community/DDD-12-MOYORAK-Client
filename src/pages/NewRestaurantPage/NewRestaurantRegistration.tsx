import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMutationAddRestaurant } from '@/apis/useMutationAddRestaurant';
import Button from '@/components/Button/Button';
import CategoryDropdown from '@/components/Dropdown/CategoryDropdown';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';
import { CATEGORY_API_MAPPING, CATEGORY_DISPLAY_LIST, type TCategoryDisplay } from '@/constants/data.constant';

interface INewRestaurantRegistrationRequest {
	placeUrl: string;
	name: string;
	address: string;
	roadAddress: string;
	category: string;
	longitude: number;
	latitude: number;
}

const NewRestaurantRegistration = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const { restaurant } = (location.state as { restaurant?: { name: string; placeUrl: string; address: string; roadAddress: string } } | undefined) ?? {};

	const [newRestaurantRegistration, setNewRestaurantRegistration] = useState<INewRestaurantRegistrationRequest>({
		placeUrl: restaurant?.placeUrl ?? '',
		name: restaurant?.name ?? '',
		address: restaurant?.address ?? '',
		roadAddress: restaurant?.roadAddress ?? '',
		category: '',
		longitude: 127.04268860648028,
		latitude: 37.27612295897271,
	});

	const { mutate: addRestaurant, isPending: isAddingRestaurant } = useMutationAddRestaurant();

	const postNewRestaurantRegistration = () => {
		const apiData = {
			...newRestaurantRegistration,
			category: CATEGORY_API_MAPPING[newRestaurantRegistration.category as TCategoryDisplay],
		};

		addRestaurant(apiData, {
			onSuccess: (response) => {
				navigate('/restaurant-registration', {
					state: {
						restaurant: {
							id: response.restaurantId,
							name: newRestaurantRegistration.name,
						},
					},
				});
			},
			onError: (error) => {
				console.error('식당 등록에 실패했습니다:', error);
				alert('식당 등록에 실패했습니다.');
			},
		});
	};

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar variant="iconWithText" leftIcon="back" leftText="신규 식당 추가하기" onLeftIconClick={() => navigate(-1)} />

			<div className="px-4.5 py-6.25 ">
				<div className="px-4.5 py-6.5 rounded-[20px] bg-white flex flex-col gap-10">
					<Input label="식당 이름" id="restaurant-name" isEssential isSuccess value={newRestaurantRegistration.name} disabled />
					<Input label="식당 주소" id="restaurant-address" isEssential isSuccess value={newRestaurantRegistration.roadAddress} disabled />
					<Input label="외부 링크" id="restaurant-link" isEssential isSuccess value={newRestaurantRegistration.placeUrl} disabled />

					<div className="flex flex-col gap-3.75">
						<FormLabel label="카테고리" id="restaurant-category" isEssential />
						<CategoryDropdown
							isOpen={isOpen}
							selected={newRestaurantRegistration.category}
							onChangeOpen={() => setIsOpen(!isOpen)}
							onChange={(selected) => setNewRestaurantRegistration({ ...newRestaurantRegistration, category: selected })}
							optionList={[...CATEGORY_DISPLAY_LIST]}
							placeholder="카테고리를 선택해 주세요."
						/>
					</div>
				</div>
				<div className={`w-full ${isOpen ? 'mt-8' : 'mt-38'}`}>
					<Button
						variant={newRestaurantRegistration.category && newRestaurantRegistration.address && newRestaurantRegistration.name ? 'active' : 'disabled'}
						onClick={() => postNewRestaurantRegistration()}
						disabled={isAddingRestaurant}
					>
						{isAddingRestaurant ? '추가 중...' : '추가하기'}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NewRestaurantRegistration;
