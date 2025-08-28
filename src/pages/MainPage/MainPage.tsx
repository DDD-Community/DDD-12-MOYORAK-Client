import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useQueryCompanyPosition } from '@/apis/useQueryCompanyPosition';
import { useQueryTeamRestaurantsLocations } from '@/apis/useQueryTeamRestaurantsLocations';
import { useQueryUser } from '@/apis/useQueryUser';
import KakaoMap from '@/components/KakaoMap';
import NavBar from '@/components/NavBar/NavBar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/Tooltip/Tooltip';

import MainBottomSheet from './components/MainBottomSheet';
import MainIntro from './components/MainIntro';
import MainNavSideBar from './components/MainNavSideBar';

const MainPage = () => {
	const [showInvitation, setShowInvitation] = useState(false);
	const [copied, setCopied] = useState<boolean>(false);

	const isLogin = useLocation().state?.isLogin || Boolean(localStorage.getItem('accessToken'));
	const accessToken = localStorage.getItem('accessToken');

	// // 테스트용 더미데이터 설정
	// const companyId = '15'; // localStorage.getItem('companyId');
	// const teamId = '7'; // localStorage.getItem('teamId');

	localStorage.setItem('companyId', '15');
	localStorage.setItem('teamId', '7');

	const companyId = localStorage.getItem('companyId');
	const teamId = localStorage.getItem('teamId');

	const { data } = useQueryTeamRestaurantsLocations(Number(teamId), isLogin);
	const { data: company } = useQueryCompanyPosition(Number(companyId), isLogin);
	const { data: user } = useQueryUser(isLogin);

	const companyLocation = {
		center: {
			lat: company?.latitude || 0,
			lng: company?.longitude || 0,
		},
		placeName: '회사',
	};

	const onShowInvitation = () => {
		setShowInvitation((prev) => !prev);
	};

	useEffect(() => {
		if (isLogin && accessToken) {
			try {
				const payloadBase64 = accessToken.split('.')[1];
				const decodedPayload = JSON.parse(atob(payloadBase64));
				const userId = decodedPayload.sub; // JWT 표준에서 sub는 subject(사용자 ID)

				// userId가 유효한 값일 때만 저장
				if (userId && userId !== 'undefined') {
					console.log('JWT에서 추출된 userId:', userId);
					localStorage.setItem('userId', String(userId));
				}
			} catch (error) {
				console.error('AccessToken 디코딩 실패', error);
				localStorage.setItem('userId', '31');
			}
		} else {
			localStorage.setItem('userId', '31');
		}
	}, [isLogin, accessToken, user]);

	useEffect(() => {
		if (isLogin && user?.companyId && user?.teamId) {
			localStorage.setItem('companyId', String(user.companyId));
			localStorage.setItem('teamId', String(user.teamId));
		}
	}, [isLogin, user]);

	if (isLogin) {
		return (
			<div className="flex flex-col h-screen relative z-0">
				<div className="relative">
					<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="category" onRightIconClick={onShowInvitation} />

					{showInvitation && <MainNavSideBar onCopy={setCopied} />}
				</div>
				<KakaoMap companyLocation={companyLocation} optionsList={data?.locations || []} />

				<MainBottomSheet />
				{copied && (
					<Tooltip open>
						<TooltipTrigger asChild>
							<div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center" />
						</TooltipTrigger>
						<TooltipContent side="bottom">초대 링크가 복사되었습니다.</TooltipContent>
					</Tooltip>
				)}
			</div>
		);
	}

	return (
		<>
			<KakaoMap companyLocation={companyLocation} optionsList={data?.locations || []} />
			<MainIntro />
		</>
	);
};

export default MainPage;
