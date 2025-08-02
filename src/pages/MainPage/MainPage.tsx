import KakaoMap from '@/components/KakaoMap';
import NavBar from '@/components/NavBar/NavBar';

import CustomDrawer from './components/CustomDrawer';
import MainIntro from './components/MainIntro';

const COMPANY_LOCATION = {
	center: { lat: 37.5665, lng: 126.978 },
	placeName: '서울특별시청',
};

const MOCK_MARKER_OPTIONS = [
	{
		center: { lat: 37.57, lng: 126.9768 },
		placeName: '덕수궁',
	},
	{
		center: { lat: 37.5658, lng: 126.9753 },
		placeName: '서울광장',
	},
];

const MainPage = () => {
	// const {
	// 	state: { login },
	// } = useLocation();

	const IS_LOGIN = true;

	if (IS_LOGIN) {
		return (
			<>
				<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="menu" />
				<KakaoMap companyLocation={COMPANY_LOCATION} optionsList={MOCK_MARKER_OPTIONS} />
				<CustomDrawer />
			</>
		);
	}

	return (
		<>
			<KakaoMap companyLocation={COMPANY_LOCATION} optionsList={MOCK_MARKER_OPTIONS} />
			<MainIntro />
		</>
	);
};
export default MainPage;
