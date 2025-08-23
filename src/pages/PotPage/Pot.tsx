import { useNavigate } from 'react-router-dom';

import { useQueryPotList } from '@/apis/useQueryPotList';
import arrow from '@/assets/arrow.png';
import divider from '@/assets/divider.png';
import noGallery from '@/assets/noGallery.png';
import potIcon from '@/assets/potIcon.png';
import potIconFinger from '@/assets/potIconFinger.png';
import voting from '@/assets/voting.png';
import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

const Pot = () => {
	const navigate = useNavigate();
	const currentTime = new Date();
	const { getCategoryDisplay } = useCategoryMapping();

	const teamId = 1;
	const size = 100;
	const currentPage = 1;

	// TanStack Query 훅 사용
	const { data: potList, isLoading, error } = useQueryPotList(teamId.toString(), size, currentPage);

	// 남은 시간 계산 함수
	const getTimeRemaining = (targetTime: Date) => {
		const diff = targetTime.getTime() - currentTime.getTime();

		if (diff <= 0) return null;

		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (hours > 0) {
			return `${hours}시간 ${remainingMinutes}분`;
		}
		return `${remainingMinutes}분`;
	};

	// 로딩 상태 처리
	if (isLoading) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					로딩 중...
				</Typography>
			</div>
		);
	}

	// 에러 상태 처리
	if (error) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					팟 목록을 불러오는데 실패했습니다.
				</Typography>
			</div>
		);
	}

	// 데이터가 없을 때 처리
	if (!potList || potList.data.length === 0) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					아직 팟이 없습니다.
				</Typography>
			</div>
		);
	}

	// 실시간 투표 상태 판단 함수
	const getRealTimeVoteStatus = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const now = currentTime;

		if (now < start) {
			// 투표 시작 전
			return {
				status: 'READY',
				timeRemaining: getTimeRemaining(start),
			};
		} else if (now >= start && now < end) {
			// 투표 진행 중
			return {
				status: 'VOTING',
				timeRemaining: getTimeRemaining(end),
			};
		} else {
			// 투표 종료
			return {
				status: 'DONE',
				timeRemaining: null,
			};
		}
	};

	// 투표 상태에 따른 텍스트 반환
	const getVoteStatusText = (voteType: string, realTimeStatus: string): string => {
		if (voteType === 'SELECT') {
			// 일반 투표
			switch (realTimeStatus) {
				case 'READY':
					return '투표 전';
				case 'VOTING':
					return '투표 중';
				case 'DONE':
					return '투표 종료';
				default:
					return '투표 전';
			}
		} else {
			// 랜덤 추첨
			switch (realTimeStatus) {
				case 'READY':
					return '랜덤 발표 전';
				case 'DONE':
					return '랜덤 추첨 종료';
				default:
					return '랜덤 발표 전';
			}
		}
	};

	// 투표 상태에 따른 스타일 클래스 반환
	const getVoteStatusStyle = (voteType: string, realTimeStatus: string): string => {
		if (voteType === 'SELECT') {
			// 일반 투표
			switch (realTimeStatus) {
				case 'READY':
					return 'bg-[rgba(190,238,5,0.30)] text-[#70CE13] border-primary-200';
				case 'VOTING':
					return 'bg-[rgba(255,107,107,0.15)] text-danger-02 border-danger-02';
				case 'DONE':
					return 'bg-gray-03 text-gray-07 border-gray-06';
				default:
					return 'bg-[rgba(255,107,107,0.15)] text-danger-02 border-danger-02';
			}
		} else {
			// 랜덤 추첨
			switch (realTimeStatus) {
				case 'READY':
					return 'bg-[rgba(255,107,107,0.15)] text-danger-02 border-danger-02';
				case 'DONE':
					return 'bg-gray-03 text-gray-07 border-gray-06';
				default:
					return 'bg-[rgba(190,238,5,0.15)] text-primary200 border-primary200';
			}
		}
	};

	// 투표 상태에 따른 설명 텍스트 반환
	const getVoteStatusDescription = (voteType: string, realTimeStatus: string, timeRemaining: string | null) => {
		if (!timeRemaining) return '';

		if (voteType === 'SELECT') {
			// 일반 투표
			switch (realTimeStatus) {
				case 'READY':
					return `${timeRemaining} 뒤 투표가 시작돼요`;
				case 'VOTING':
					return `${timeRemaining} 뒤 투표가 종료돼요`;
				case 'DONE':
					return '';
			}
		} else {
			// 랜덤 추첨
			switch (realTimeStatus) {
				case 'READY':
					return `${timeRemaining} 뒤 랜덤으로 발표돼요`;
				case 'DONE':
					return '';
			}
		}
	};

	return (
		<div className="px-4.5 bg-gray-02 h-screen overflow-y-auto mb-20">
			<div className="flex justify-center mt-29 relative">
				<img src={potIcon} alt="팟아이콘 이미지" className="w-[177px] absolute top-[-80px]" />
				<img src={potIconFinger} alt="팟아이콘 손가락 이미지" className="w-[194px] absolute top-[-36px] z-10" />
			</div>

			<div
				className="relative
			text-center
			pt-[40px] px-[20px] pb-[20px] rounded-[30px]
			mb-[26px]
			bg-[#1F2511] [box-shadow:0px_0px_10px_0px_rgba(102,_102,_102,_0.20)] h-[183px]"
			>
				<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.white} className="font-semibold mb-6">
					오늘 점심시간을 함께 할<br /> 팀원을 모아보세요!
				</Typography>

				<Button variant="active" className="rounded-[40px] flex justify-between items-center px-[12px] py-[8px]" onClick={() => navigate('/pot-make')}>
					<Icon size={31} name="potPlusButton" />
					모여락으로 팀원 모으기
					<img src={arrow} alt="arrow" />
				</Button>
			</div>

			{potList?.data && potList.data.length > 0 ? (
				<div className="mb-20">
					<div className="space-y-5.5">
						{potList.data.map((pot) => {
							const realTimeVoteInfo = getRealTimeVoteStatus(pot.startDate, pot.endDate);
							return (
								<div
									key={pot.id}
									className={`p-[22px] rounded-[30px] bg-[#FFF] relative border ${pot.isParticipating === true ? 'border-[#BEEE0540] stroke-primary-200' : 'border-gray-04'}`}
									onClick={() => navigate(`/pot-detail/${pot.id}`)}
								>
									{pot.isParticipating === true && (
										<div className="absolute top-[-16px] right-[20px]">
											<img src={voting} alt="voting" className="w-[86px] h-[38.323px]" />
										</div>
									)}
									<div className="flex items-center mb-2">
										<FilterButton variant="clicked" borderRadius="20" className={getVoteStatusStyle(pot.voteType, realTimeVoteInfo.status)}>
											{getVoteStatusText(pot.voteType, realTimeVoteInfo.status)}
										</FilterButton>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium ml-1">
											{getVoteStatusDescription(pot.voteType, realTimeVoteInfo.status, realTimeVoteInfo.timeRemaining)}
										</Typography>
									</div>
									<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold mb-6">
										{pot.title}
									</Typography>
									<div className="flex flex-col gap-2">
										{pot.partyRestaurantResponseList.map((restaurant, restaurantIdx) => (
											<div key={restaurantIdx} className="flex items-center justify-between rounded-[15px] border border-gray-03 bg-gray-01 px-4 py-2.5">
												<div className="flex items-center gap-1">
													<Typography
														variant={FONT_VARIANT.body02}
														fontColor={PALETTE.gray10}
														className="font-semibold max-w-[40vw] text-ellipsis overflow-hidden whitespace-nowrap"
													>
														{restaurant.name}
													</Typography>
													<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07} className="font-medium">
														{getCategoryDisplay(restaurant.restaurantCategory)}
													</Typography>
												</div>
												<div className="flex items-center">
													<Icon name="star" width={11} className="mr-0.5 mb-0.5" />
													<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray08} className="font-medium">
														{restaurant.reviewScore}
													</Typography>
													<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray08} className="font-medium mx-1">
														·
													</Typography>
													<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray08} className="font-medium">
														리뷰 {restaurant.reviewCount}
													</Typography>
												</div>
											</div>
										))}
									</div>

									<div className="relative">
										<div className="absolute top-[77%] left-0 w-8 h-8 bg-gray-02 rounded-r-full transform -translate-y-1/2 -translate-x-9" />
										<div className="absolute top-[77%] right-0 w-8 h-8 bg-gray-02 rounded-l-full transform -translate-y-1/2 translate-x-9" />
										<div className="flex items-center mt-7 mb-6 ">
											<img src={divider} alt="divider" className="w-full" />
										</div>
									</div>

									<div className="flex items-center gap-2 mt-7">
										<div className="flex">
											<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray09} className="font-semibold">
												{pot.attendeeCount}
											</Typography>
											<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="font-semibold">
												명이 참가중이에요!
											</Typography>
										</div>
										<div className="flex -space-x-2">
											{pot.userProfileList.map((profileImage, profileIdx) => (
												<div key={profileIdx} className="w-9 h-9 rounded-full border-[1px] border-solid border-gray-04 bg-gray-02">
													<img src={profileImage} alt="팟 참가자 이미지" className="w-full h-full rounded-full" />
												</div>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center gap-3.25 mt-28">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
						아직 등록된 팟이 없어요.
						<br />
						오늘의 첫번째 팟을 만들어보세요!
					</Typography>
					<img src={noGallery} alt="noGallery" className="w-[215px] h-[128px]" />
				</div>
			)}
		</div>
	);
};

export default Pot;
