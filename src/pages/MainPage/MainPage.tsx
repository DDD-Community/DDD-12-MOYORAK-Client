import { useLocation } from 'react-router-dom';

import { useQueryCompanyPosition } from '@/apis/useQueryCompanyPosition';
import { useQueryTeamRestaurantsLocations } from '@/apis/useQueryTeamRestaurantsLocations';
import KakaoMap from '@/components/KakaoMap';
import NavBar from '@/components/NavBar/NavBar';

import MainBottomSheet from './components/MainBottomSheet';
import MainIntro from './components/MainIntro';

const COMPANY_LOCATION = {
	center: { lat: 37.5665, lng: 126.978 },
	placeName: '디폴트 회사',
};

const MainPage = () => {
	const isLogin = useLocation().state?.isLogin || Boolean(localStorage.getItem('accessToken'));
	const companyId = localStorage.getItem('companyId');
	const teamId = localStorage.getItem('teamId');

	const { data } = useQueryTeamRestaurantsLocations(Number(teamId));
	const { data: company } = useQueryCompanyPosition(Number(companyId));

	if (isLogin) {
		return (
			<>
				<div className="flex flex-col h-screen">
					<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="menu" onRightIconClick={() => console.log('')} />
					<KakaoMap
						companyLocation={{
							center: { lat: company?.latitude || 37.5665, lng: company?.longtitude || 126.978 },
							level: 2,
							placeName: '회사',
						}}
						optionsList={data?.locations || []}
					/>
					<MainBottomSheet />
				</div>
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
