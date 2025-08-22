import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { get, post } from '@/apis';
import { useMutationAddRestaurantToParty } from '@/apis/useMutationAddRestaurantToParty';
import { useMutationVote } from '@/apis/useMutationVote';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';
import ParticipationButton from '@/pages/PotPage/components/ParticipationButton';

import AddRestaurantPopup from './components/AddRestaurantPopup';
import Participant from './components/Participant';
import RestaurantCarousel from './components/RestaurantCarousel';

// 타입 정의
type TimeStatus = 'before_start' | 'voting_active' | 'after_end';
type TabType = 'restaurant' | 'participant';
type ViewType = 'carousel' | 'list';

interface IPotDetailResponse {
	id: number;
	title: string;
	content: string;
	attendable: boolean;
	attended: boolean;
	vote: {
		id: number;
		voteType: string;
		voteStatus: string;
		randomSelectedCandidateId: number | null;
		mealDate: string;
		startDate: string;
		expiredDate: string;
		randomDate: string;
	};
	candidates: Array<{
		candidateId: number;
		teamRestaurantId: number;
		restaurantName: string;
		restaurantCategory: string;
		averageReviewScore: number;
		reviewCount: number;
		reviewImagePath: string;
	}>;
	voters: Array<{
		candidateId: number;
		name: string;
		profileImageUrl: string;
	}>;
}

const PotDetail = () => {
	const navigate = useNavigate();
	const [potDetail, setPotDetail] = useState<IPotDetailResponse | null>(null);
	const { getCategoryDisplay } = useCategoryMapping();
	const { mutate: voteRestaurant, isPending: isVoting } = useMutationVote();
	const { mutate: addRestaurantToParty, isPending: isAddingRestaurant } = useMutationAddRestaurantToParty();

	// 상태 관리
	const [activeTab, setActiveTab] = useState<TabType>('restaurant');
	const [showToast, setShowToast] = useState(false);
	const [viewType, setViewType] = useState<ViewType>('carousel');
	const [isVoted, setIsVoted] = useState(false);
	const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
	const [hoveredRestaurantId, setHoveredRestaurantId] = useState<number | null>(null);
	const [showAddRestaurantPopup, setShowAddRestaurantPopup] = useState(false);

	const teamId = 1;
	const { id } = useParams();

	const getPotDetail = async () => {
		try {
			const response = await get<IPotDetailResponse>(`/teams/${teamId}/parties/${id}`);
			setPotDetail(response as IPotDetailResponse);
		} catch (error) {
			console.error('팟 목록 조회 실패:', error);
		}
	};

	useEffect(() => {
		getPotDetail();
	}, []);

	// 시간 관련 유틸리티 함수들
	const getCurrentTimeStatus = (): TimeStatus => {
		if (!potDetail) return 'before_start';

		const now = new Date();
		const startTime = new Date(potDetail.vote.startDate);
		const endTime = new Date(potDetail.vote.expiredDate);

		if (now < startTime) return 'before_start';
		if (now >= startTime && now < endTime) return 'voting_active';
		return 'after_end';
	};

	const getVoteStatusText = (): string => {
		if (!potDetail) return '로딩 중...';

		const timeStatus = getCurrentTimeStatus();
		const statusMap = {
			before_start: '투표 전',
			voting_active: '투표 중',
			after_end: '투표 종료',
		};
		return statusMap[timeStatus];
	};

	const shouldShowAddRestaurantButton = (): boolean => {
		if (!potDetail) return false;

		const timeStatus = getCurrentTimeStatus();
		// 참여했고, 투표 전 또는 투표 중일 때 식당 추가 가능
		return potDetail.attended && (timeStatus === 'before_start' || timeStatus === 'voting_active');
	};

	const partyAttendance = async () => {
		try {
			const response = await post(`/teams/${teamId}/parties/${id}`);
			console.log(response);
		} catch (error) {
			console.error('팟 참여자 목록 조회 실패:', error);
		}
	};

	// 이벤트 핸들러들
	const handleParticipateClick = (): void => {
		if (!potDetail?.attended) {
			// 참여하지 않은 경우 참여 API 호출
			partyAttendance();
			handleParticipate();
		} else if (getCurrentTimeStatus() === 'voting_active') {
			// 이미 참여한 경우 투표 액션
			handleVoteAction();
		}
	};

	const handleParticipate = (): void => {
		setShowToast(true);
		// API 성공 후 데이터를 다시 가져오므로 상태는 업데이트하지 않음
		setTimeout(() => setShowToast(false), 3000);
		// 팟 상세 정보 다시 가져오기
		getPotDetail();
	};

	const handleVoteAction = (): void => {
		if (!isVoted) {
			if (selectedRestaurantId && potDetail) {
				// 투표 API 호출
				voteRestaurant(
					{
						teamId,
						partyId: Number(id),
						voteId: potDetail.vote.id,
						candidateId: selectedRestaurantId,
					},
					{
						onSuccess: () => {
							setIsVoted(true);
							getPotDetail();
						},
						onError: (error) => {
							console.error('투표 실패:', error);
						},
					}
				);
			}
		} else {
			resetVote();
		}
	};

	const resetVote = (): void => {
		setIsVoted(false);
		setSelectedRestaurantId(null);
	};

	const handleRestaurantSelect = (restaurantId: number): void => {
		if (!canSelectRestaurant()) return;

		if (selectedRestaurantId === restaurantId) {
			setSelectedRestaurantId(null);
		} else {
			setSelectedRestaurantId(restaurantId);
		}
	};

	const canSelectRestaurant = (): boolean => {
		return potDetail?.attended === true && getCurrentTimeStatus() === 'voting_active' && !isVoted;
	};

	// 식당 추가 핸들러
	const handleAddRestaurant = (
		selectedRestaurants?: Array<{
			teamRestaurantId: number;
			restaurantName: string;
			restaurantCategory: string;
			averageReviewScore: number;
			reviewCount: number;
			reviewImagePath: string;
		}>
	) => {
		if (selectedRestaurants && selectedRestaurants.length > 0 && potDetail) {
			addRestaurantToParty(
				{
					teamId,
					partyId: Number(id),
					teamRestaurantId: selectedRestaurants[0].teamRestaurantId,
					voteId: potDetail.vote.id,
				},
				{
					onSuccess: () => {
						// 식당 추가 성공 시 팟 상세 정보 다시 가져오기
						getPotDetail();
						setShowToast(true);
						setTimeout(() => setShowToast(false), 3000);
					},
					onError: (error) => {
						console.error('식당 추가 실패:', error);
					},
				}
			);
		}
		setShowAddRestaurantPopup(false);
	};

	// UI 스타일 관련 함수들
	const getRestaurantCardStyle = (restaurantId: number): string => {
		const timeStatus = getCurrentTimeStatus();

		if (timeStatus === 'after_end') {
			return 'bg-[#484848] text-white';
		}

		if (isVoted && selectedRestaurantId === restaurantId) {
			return 'border border-[#BEEE05] bg-[rgba(190,238,5,0.15)]';
		}

		return 'bg-white';
	};

	// 시간 포맷팅 함수
	const formatTime = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	// 투표 배지 렌더링
	const renderVoteBadge = (candidate: any) => {
		// voters 배열에서 해당 candidateId를 가진 투표자 수 계산
		const voteCount = potDetail?.voters.filter((voter) => voter.candidateId === candidate.candidateId).length || 0;

		return (
			<div className="relative" onMouseEnter={() => setHoveredRestaurantId(candidate.candidateId)} onMouseLeave={() => setHoveredRestaurantId(null)}>
				<div className="absolute bottom-1 left-1 border border-primary-200 rounded-[6px] flex items-center gap-1 px-1.25 py-0.75 bg-black/60 backdrop-blur-2px shadow-[0_0_3.161px_0_rgba(255,255,255,0.25)]">
					<Icon name="vote" />
					<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.primary200} className="font-semibold">
						{voteCount}표
					</Typography>
				</div>

				{/* Hover 시 참여자 정보 오버레이 */}
				{hoveredRestaurantId === candidate.candidateId && voteCount > 0 && (
					<div className="absolute bottom-11 left-1 bg-black/60 backdrop-blur-2px rounded-[10px] px-3.75 py-2.75 shadow-lg border border-gray-600 min-w-[100px] z-10">
						<div className="flex flex-col gap-1.5">
							{potDetail?.voters
								.filter((voter) => voter.candidateId === candidate.candidateId)
								.map((voter) => (
									<div key={voter.name} className="flex items-center gap-2">
										<div className="w-4.5 h-4.5 rounded-[400px] bg-gray-02 border border-gray-04">
											<img src={voter.profileImageUrl} alt={voter.name} className="w-full h-full object-cover" />
										</div>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray03} className="font-medium">
											{voter.name}
										</Typography>
									</div>
								))}
						</div>
						<div className="absolute top-full left-3.5 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-transparent border-t-gray-800/95" />
					</div>
				)}
			</div>
		);
	};

	const renderRestaurantCheckbox = (candidateId: number) => {
		if (!canSelectRestaurant()) return null;

		if (isVoted) {
			return <></>;
		}

		if (selectedRestaurantId === candidateId) {
			return (
				<div className="w-7.5 h-7.5 bg-[#BEEE05] rounded-lg flex items-center justify-center">
					<Icon name="check" size={16} className="text-white" />
				</div>
			);
		}

		return (
			<div className="w-7.5 h-7.5 border-2 border-gray-04 rounded-lg bg-gray-02 flex items-center justify-center">
				<Icon name="noCheck" size={16} />
			</div>
		);
	};

	const renderRestaurantList = () => (
		<div className="space-y-3.25 mb-6">
			{potDetail?.candidates.map((candidate) => (
				<div
					key={candidate.candidateId}
					className={`rounded-[15px] p-2.5 flex items-center gap-3.5 transition-all ${
						canSelectRestaurant() ? 'cursor-pointer' : 'cursor-default'
					} ${getRestaurantCardStyle(candidate.candidateId)}`}
					onClick={() => handleRestaurantSelect(candidate.candidateId)}
				>
					<div className="relative">
						<img src={candidate.reviewImagePath} alt={candidate.restaurantName} className="w-20.75 h-20.75 rounded-[12px] object-cover" />
						{renderVoteBadge(candidate)}
					</div>

					<div className="flex-1">
						<Typography
							variant={FONT_VARIANT.caption01}
							fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray07}
							className="font-medium"
						>
							{getCategoryDisplay(candidate.restaurantCategory)}
						</Typography>
						<Typography
							variant={FONT_VARIANT.header03}
							fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray10}
							className="font-semibold mb-0.75"
						>
							{candidate.restaurantName}
						</Typography>
						<div className="flex items-center gap-1">
							<Icon name="star" size={14} />
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray08}
								className="font-medium"
							>
								{candidate.averageReviewScore.toFixed(1)}
							</Typography>
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray08}
								className="font-medium"
							>
								·
							</Typography>
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray08}
								className="font-medium"
							>
								리뷰 {candidate.reviewCount}
							</Typography>
						</div>
					</div>

					{renderRestaurantCheckbox(candidate.candidateId)}
				</div>
			))}
		</div>
	);

	const renderToast = () =>
		showToast && (
			<div className="fixed bottom-24 left-0 w-full px-4.5 z-20">
				<div className="px-5 py-2.5 rounded-[10px] bg-black/70 backdrop-blur-2px shadow-md flex items-center gap-1.25">
					<Icon name="check" size={14} />
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.white} className="font-medium">
						{isAddingRestaurant ? '식당을 추가하였습니다.' : '팟에 참여하였습니다.'}
					</Typography>
				</div>
			</div>
		);

	// 로딩 상태 처리
	if (!potDetail) {
		return (
			<>
				<NavBar variant="iconWithText" leftText="팟 상세보기" leftIcon="back" onLeftIconClick={() => navigate('/pot')} />
				<div className="h-full bg-white pt-6.25 flex items-center justify-center">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
						로딩 중...
					</Typography>
				</div>
			</>
		);
	}

	return (
		<>
			{showAddRestaurantPopup ? (
				<AddRestaurantPopup onClose={handleAddRestaurant} existingRestaurantIds={potDetail.candidates.map((candidate) => candidate.teamRestaurantId)} />
			) : (
				<>
					<NavBar variant="iconWithText" leftText="팟 상세보기" leftIcon="back" onLeftIconClick={() => navigate('/pot')} />

					<div className="h-full bg-white pt-6.25">
						{/* 헤더 섹션 */}
						<div className="flex flex-col items-center mb-5">
							<FilterButton
								variant="clicked"
								borderRadius="20"
								className={
									getCurrentTimeStatus() === 'after_end'
										? 'bg-gray-03 text-gray-07 border-gray-06'
										: getCurrentTimeStatus() === 'before_start'
											? 'bg-[rgba(190,238,5,0.30)] text-[#70CE13] border-primary-200'
											: 'bg-[rgba(255,107,107,0.15)] text-danger-02 border-danger-02'
								}
							>
								{getVoteStatusText()}
							</FilterButton>
							<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold mt-2.25 mb-1.25">
								{potDetail.title}
							</Typography>
							<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
								{potDetail.content}
							</Typography>
						</div>

						{/* 시간 정보 섹션 */}
						<div className="px-4.5 mb-5.5">
							<div className="px-11.25 py-2.75 rounded-[20px] border border-gray-03 bg-gray-01 flex justify-between">
								<div className="flex flex-col">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
										투표시작
									</Typography>
									<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
										{formatTime(potDetail.vote.startDate)}
									</Typography>
								</div>
								<div className="flex flex-col">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
										투표마감
									</Typography>
									<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
										{formatTime(potDetail.vote.expiredDate)}
									</Typography>
								</div>
								<div className="flex flex-col">
									<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
										식사시간
									</Typography>
									<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
										{formatTime(potDetail.vote.mealDate)}
									</Typography>
								</div>
							</div>
						</div>

						{/* 탭 네비게이션 */}
						<div className="flex border-b border-gray-03">
							<button
								onClick={() => setActiveTab('restaurant')}
								className={`flex-1 py-2.5 transition-all ${activeTab === 'restaurant' ? 'border-b-2 border-gray-10' : ''}`}
							>
								<Typography
									variant={FONT_VARIANT.body01}
									fontColor={activeTab === 'restaurant' ? PALETTE.gray10 : PALETTE.gray08}
									className={activeTab === 'restaurant' ? 'font-semibold' : 'font-normal'}
								>
									식당 정보
								</Typography>
							</button>
							<button
								onClick={() => setActiveTab('participant')}
								className={`flex-1 pb-3 transition-all ${activeTab === 'participant' ? 'border-b-2 border-gray-10' : ''}`}
							>
								<Typography
									variant={FONT_VARIANT.body01}
									fontColor={activeTab === 'participant' ? PALETTE.gray10 : PALETTE.gray08}
									className={activeTab === 'participant' ? 'font-semibold' : 'font-normal'}
								>
									참여자
								</Typography>
							</button>
						</div>

						{/* 식당 정보 탭 */}
						{activeTab === 'restaurant' && (
							<div className="bg-[#f5f5f5] pt-5 h-screen">
								{/* 상단 컨트롤 */}
								<div className="flex justify-between items-center mb-5 px-4.5 ">
									<div className="flex items-center">
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08} className="font-medium mr-0.75">
											식당
										</Typography>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10} className="font-semibold">
											{potDetail.candidates.length}개
										</Typography>
										<Icon
											name={viewType === 'carousel' ? 'activeCard' : 'card'}
											size={18}
											className="ml-2.5 mr-2.25"
											onClick={() => setViewType(viewType === 'carousel' ? 'list' : 'carousel')}
										/>
										<Icon name={viewType === 'list' ? 'activeList' : 'list'} size={18} onClick={() => setViewType(viewType === 'list' ? 'carousel' : 'list')} />
									</div>
									{shouldShowAddRestaurantButton() && (
										<button
											className="flex items-center gap-1 px-3 py-1.5 rounded-[17px] bg-gray-01 border border-gray-03"
											onClick={() => setShowAddRestaurantPopup(true)}
											disabled={isAddingRestaurant}
										>
											<Icon name="restaurantPlus" size={16} className="text-gray-08" />
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-semibold">
												{isAddingRestaurant ? '추가 중...' : '식당 추가'}
											</Typography>
										</button>
									)}
								</div>

								{/* 식당 목록 */}
								{viewType === 'carousel' && (
									<RestaurantCarousel
										restaurants={potDetail.candidates}
										selectedRestaurantId={selectedRestaurantId}
										canSelectRestaurant={canSelectRestaurant()}
										timeStatus={getCurrentTimeStatus()}
										onCardClick={(candidate) => handleRestaurantSelect(candidate.candidateId)}
										isVoted={isVoted}
										voters={potDetail.voters}
									/>
								)}
								{viewType === 'list' && renderRestaurantList()}

								{/* 하단 버튼 */}
								<ParticipationButton
									timeStatus={getCurrentTimeStatus()}
									attended={potDetail.attended}
									attendable={potDetail.attendable}
									isVoted={isVoted}
									selectedRestaurantId={selectedRestaurantId}
									isLoading={isVoting}
									onParticipateClick={handleParticipateClick}
								/>

								{/* 토스트 메시지 */}
								{renderToast()}
							</div>
						)}

						{/* 참여자 탭 */}
						{activeTab === 'participant' && (
							<div className="bg-[#f5f5f5] pt-5 h-screen">
								<Participant />
								<ParticipationButton
									timeStatus={getCurrentTimeStatus()}
									attended={potDetail.attended}
									attendable={potDetail.attendable}
									isLoading={isVoting}
									onParticipateClick={handleParticipateClick}
								/>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default PotDetail;
