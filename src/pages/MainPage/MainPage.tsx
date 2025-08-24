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

const COMPANY_LOCATION = {
	center: { lat: 37.5665, lng: 126.978 },
	placeName: '디폴트 회사',
};

const MainPage = () => {
	const [showInvitation, setShowInvitation] = useState(false);
	const [copied, setCopied] = useState<boolean>(false);

	const isLogin = useLocation().state?.isLogin || Boolean(localStorage.getItem('accessToken'));
	const companyId = localStorage.getItem('companyId');
	const teamId = localStorage.getItem('teamId');

	const { data } = useQueryTeamRestaurantsLocations(Number(teamId), isLogin);
	const { data: company } = useQueryCompanyPosition(Number(companyId), isLogin);
	const { data: user } = useQueryUser(isLogin);

	const onShowInvitation = () => {
		setShowInvitation((prev) => !prev);
	};

	useEffect(() => {
		if (isLogin) {
			localStorage.setItem('companyId', String(user?.companyId));
			localStorage.setItem('teamId', String(user?.teamId));
		}
	}, [isLogin]);

	if (isLogin) {
		return (
			<div className="flex flex-col h-screen relative z-0">
				<div className="relative">
					<NavBar variant="iconWithTextAndRightIcon" leftIcon="company" leftText="WEB 2팀" rightIcon="menu" onRightIconClick={onShowInvitation} />

					{showInvitation && <MainNavSideBar onCopy={setCopied} />}
				</div>

				<KakaoMap
					companyLocation={{
						center: { lat: company?.latitude || 37.5665, lng: company?.longtitude || 126.978 },
						level: 2,
						placeName: '회사',
					}}
					optionsList={data?.locations || []}
				/>
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
			<KakaoMap companyLocation={COMPANY_LOCATION} optionsList={data?.locations || []} />
			<MainIntro />
		</>
	);
};

export default MainPage;
