import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import CategoryDropdown from '@/components/Dropdown/CategoryDropdown';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';

const NewRestaurantRegistration = () => {
	const [restaurantAddress, setRestaurantAddress] = useState('');
	const [restaurantLink, setRestaurantLink] = useState('');
	const [restaurantCategory, setRestaurantCategory] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const { restaurant } = (location.state as { restaurant?: { name: string } } | undefined) ?? {};

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar variant="iconWithText" leftIcon="back" leftText="신규 식당 추가하기" onLeftIconClick={() => navigate(-1)} />

			<div className="px-4.5 py-6.25 ">
				<div className="px-4.5 py-6.5 rounded-[20px] bg-white flex flex-col gap-10">
					<Input label="식당 이름" id="restaurant-name" isEssential isSuccess value={restaurant?.name ?? ''} />
					<Input
						label="식당 주소"
						id="restaurant-address"
						isEssential
						isSuccess
						value={restaurantAddress}
						onChange={(e) => setRestaurantAddress(e.target.value)}
					/>
					<Input label="외부 링크" id="restaurant-link" isEssential isSuccess value={restaurantLink} onChange={(e) => setRestaurantLink(e.target.value)} />

					<div className="flex flex-col gap-3.75">
						<FormLabel label="카테고리" id="restaurant-category" isEssential />
						<CategoryDropdown
							isOpen={isOpen}
							selected={restaurantCategory}
							onChangeOpen={() => setIsOpen(!isOpen)}
							onChange={(selected) => setRestaurantCategory(selected)}
							optionList={['한식', '중식', '일식', '양식', '아시안', '분식', '패스트푸드', '치킨&피자', '기타']}
							placeholder="카테고리를 선택해 주세요."
						/>
					</div>
				</div>
				<div className={`w-full ${isOpen ? 'mt-8' : 'mt-38'}`}>
					<Button
						variant={restaurantCategory && restaurantAddress && restaurant?.name ? 'active' : 'disabled'}
						onClick={() => navigate('/restaurant-registration', { state: { restaurant } })}
					>
						추가하기
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NewRestaurantRegistration;
