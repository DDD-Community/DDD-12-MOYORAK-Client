import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useQueryCompanyPosition } from '@/apis/useQueryCompanyPosition';
import { useQueryTeamRestaurantsLocations } from '@/apis/useQueryTeamRestaurantsLocations';
import { useQueryUser } from '@/apis/useQueryUser';
import KakaoMap from '@/components/KakaoMap';
import NavBar from '@/components/NavBar/NavBar';
import { CustomToast } from '@/components/Toast/BaseToaster';

import MainBottomSheet from './components/MainBottomSheet';
import MainIntro from './components/MainIntro';
import MainNavSideBar from './components/MainNavSideBar';

const MainPage = () => {
	const [showInvitation, setShowInvitation] = useState(false);
	const [copied, setCopied] = useState<boolean>(false);
	const [isLogin, setIsLogin] = useState(false);
	const accessToken = localStorage.getItem('accessToken');

	const location = useLocation();

	useEffect(() => {
		// 기본값 설정 (테스트용)
		const defaultCompanyId = '15';
		const defaultTeamId = '7';
		const defaultUserId = '33';

		// companyId 설정
		localStorage.setItem('companyId', defaultCompanyId);

		// teamId 설정
		localStorage.setItem('teamId', defaultTeamId);

		// userId 설정
		localStorage.setItem('userId', defaultUserId);

		// JWT에서 userId 추출하여 설정
		try {
			const payloadBase64 = accessToken?.split('.')[1];
			const decodedPayload = JSON.parse(atob(payloadBase64 || ''));
			const userId = decodedPayload.sub; // JWT 표준에서 sub는 subject(사용자 ID)

			// userId가 유효한 값일 때만 저장
			if (userId && userId !== 'undefined') {
				localStorage.setItem('userId', String(userId));
			}
		} catch (error) {
			console.error('AccessToken 디코딩 실패', error);
			localStorage.setItem('userId', defaultUserId);
		}
	}, []);

	// 로그인 상태 확인 - 하드코딩된 토큰이 있으면 자동 로그인
	useEffect(() => {
		const loginFromState = location.state?.isLogin;
		const loginFromToken = Boolean(accessToken && accessToken.length > 0);
		const loginStatus = loginFromState || loginFromToken;

		setIsLogin(loginStatus);
		console.log('로그인 상태:', loginStatus, '토큰 존재:', loginFromToken);
	}, [location.state?.isLogin, accessToken]);

	// companyId와 teamId를 로컬스토리지에서 가져오기
	const companyId = localStorage.getItem('companyId');
	const teamId = localStorage.getItem('teamId');

	const { data } = useQueryTeamRestaurantsLocations(Number(teamId), isLogin);
	const { data: company } = useQueryCompanyPosition(Number(companyId), isLogin);
	const { data: user } = useQueryUser(isLogin);

	const companyLocation = {
		center: {
			lat: company?.latitude || 37.54419744589,
			lng: company?.longitude || 126.95121385337,
		},
		placeName: '회사',
	};

	const onShowInvitation = () => {
		setShowInvitation((prev) => !prev);
	};

	useEffect(() => {
		if (isLogin && user?.companyId && user?.teamId) {
			localStorage.setItem('companyId', String(user.companyId));
			localStorage.setItem('teamId', String(user.teamId));
		}
	}, [isLogin, user]);

	if (isLogin) {
		return (
			<div className="relative w-full h-screen pb-[86px]">
				{/* 지도를 풀 스크린으로 표시 (TabBar 공간 제외) */}
				<KakaoMap companyLocation={companyLocation} optionsList={data?.locations || []} />

				{/* 상단 네비게이션 */}
				<div className="absolute top-0 left-0 right-0 z-10">
					<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="category" onRightIconClick={onShowInvitation} />
					{showInvitation && <MainNavSideBar onCopy={setCopied} />}
				</div>

				{/* BottomSheet를 지도 위에 절대 위치로 오버레이 (TabBar 위에) */}
				<div className="absolute bottom-20 left-0 right-0 z-10">
					<MainBottomSheet />
				</div>

				{copied && <CustomToast title="초대 링크가 복사되었습니다." icon="check" />}
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen pb-[86px]">
			{/* 비로그인 상태에서도 풀 스크린 지도 (TabBar 공간 제외) */}
			<KakaoMap companyLocation={companyLocation} optionsList={data?.locations || []} />

			{/* MainIntro를 지도 위에 오버레이 */}
			<div className="absolute inset-0 z-10">
				<MainIntro />
			</div>
		</div>
	);
};

export default MainPage;
