import { useLocation } from 'react-router-dom';

import KakaoMap from '@/components/KakaoMap';
import NavBar from '@/components/NavBar/NavBar';

import MainBottomSheet from './components/MainBottomSheet';
import MainIntro from './components/MainIntro';
import { useQueryTeamRestaurantsLocations } from '@/apis/useQueryTeamRestaurantsLocations';

const COMPANY_LOCATION = {
	center: { lat: 37.5665, lng: 126.978 },
	placeName: '서울특별시청',
};

const MainPage = () => {
	const { state } = useLocation() as { state?: { login: boolean } };

	const { data } = useQueryTeamRestaurantsLocations(8);

	if (state?.login) {
		return (
			<>
				<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="menu" />
				<KakaoMap companyLocation={COMPANY_LOCATION} optionsList={data?.locations || []} />
				<MainBottomSheet />
			</>
		);
	}

	return (
		<>
			<KakaoMap companyLocation={COMPANY_LOCATION} optionsList={data?.locations || []} />
			<MainIntro />
		</>
	);
};

export default MainPage;
