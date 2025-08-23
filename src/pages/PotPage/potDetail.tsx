import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMutationAddRestaurantToParty } from '@/apis/useMutationAddRestaurantToParty';
import { useMutationJoinParty } from '@/apis/useMutationJoinParty';
import { useMutationVote } from '@/apis/useMutationVote';
import { useQueryPotDetail } from '@/apis/useQueryPotDetail';
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

const PotDetail = () => {
	const navigate = useNavigate();
	const { getCategoryDisplay } = useCategoryMapping();
	const { mutate: voteRestaurant, isPending: isVoting } = useMutationVote();
	const { mutate: addRestaurantToParty, isPending: isAddingRestaurant } = useMutationAddRestaurantToParty();
	const teamId = 1;
	const { id } = useParams();

	const { data: potDetail, isLoading: isLoadingPotDetail, error: potDetailError } = useQueryPotDetail(teamId.toString(), id || '');
	const { mutate: joinParty } = useMutationJoinParty(teamId.toString(), id || '');

	const userId = 5;
	const [activeTab, setActiveTab] = useState<TabType>('restaurant');

	const isPotCreator = potDetail?.voters.some((voter) => voter.userId === userId);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [viewType, setViewType] = useState<ViewType>('carousel');
	const [isVoted, setIsVoted] = useState(false);
	const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
	const [hoveredRestaurantId, setHoveredRestaurantId] = useState<number | null>(null);
	const [showAddRestaurantPopup, setShowAddRestaurantPopup] = useState(false);

	useEffect(() => {
		if (potDetail) {
			const userVote = potDetail.voters.find((voter) => voter.userId === userId);
			if (userVote) {
				setIsVoted(true);
				setSelectedRestaurantId(userVote.candidateId);
			} else {
				setIsVoted(false);
				setSelectedRestaurantId(null);
			}
		}
	}, [potDetail, userId]);

	const getCurrentTimeStatus = (): TimeStatus => {
		if (!potDetail) return 'before_start';

		const now = new Date();

		// 디버깅을 위한 로그 (개발 완료 후 제거)
		console.log('Current time:', now.toISOString());
		console.log('Vote type:', potDetail.vote.voteType);

		// RANDOM 타입일 때는 randomDate를 기준으로 상태 판단
		if (potDetail.vote.voteType === 'RANDOM') {
			const randomTime = new Date(potDetail.vote.randomDate);
			console.log('Random time:', randomTime.toISOString());

			if (now < randomTime) return 'before_start';
			return 'after_end'; // RANDOM 타입에서는 voting_active 상태가 없음
		}

		// 일반 투표일 때
		const startTime = new Date(potDetail.vote.startDate);
		const endTime = new Date(potDetail.vote.expiredDate);
		console.log('Start time:', startTime.toISOString());
		console.log('End time:', endTime.toISOString());

		// 시간 비교를 더 정확하게 하기 위해 시간을 0으로 설정
		const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
		const startDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes());
		const endDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), endTime.getHours(), endTime.getMinutes());

		console.log('Normalized current time:', nowDate.toISOString());
		console.log('Normalized start time:', startDate.toISOString());
		console.log('Normalized end time:', endDate.toISOString());

		if (nowDate < startDate) {
			console.log('Status: before_start');
			return 'before_start';
		}
		if (nowDate >= startDate && nowDate < endDate) {
			console.log('Status: voting_active');
			return 'voting_active';
		}
		console.log('Status: after_end');
		return 'after_end';
	};

	// RANDOM 타입일 때 시간 표시 텍스트 반환
	const getTimeDisplayText = () => {
		if (!potDetail) return { start: '', end: '', meal: '', random: '', mealTime: '' };

		if (potDetail.vote.voteType === 'RANDOM') {
			return {
				start: '',
				end: '',
				meal: '',
				random: formatTime(potDetail.vote.randomDate),
				mealTime: formatTime(potDetail.vote.mealDate),
			};
		}

		return {
			start: formatTime(potDetail.vote.startDate),
			end: formatTime(potDetail.vote.expiredDate),
			meal: formatTime(potDetail.vote.mealDate),
			random: '',
			mealTime: '',
		};
	};

	const getVoteStatusText = (): string => {
		if (!potDetail) return '로딩 중...';

		const timeStatus = getCurrentTimeStatus();

		// RANDOM 타입일 때 다른 텍스트 표시
		if (potDetail.vote.voteType === 'RANDOM') {
			const statusMap = {
				before_start: '랜덤 발표 전',
				voting_active: '랜덤 발표 전', // 추첨 중 상태는 없음
				after_end: '랜덤 추첨 종료',
			};
			return statusMap[timeStatus];
		}

		// 일반 투표일 때
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

		if (potDetail.vote.voteType === 'RANDOM') {
			return potDetail.attended && timeStatus === 'before_start';
		}
		return potDetail.attended && (timeStatus === 'before_start' || timeStatus === 'voting_active');
	};

	const partyAttendance = async () => {
		try {
			joinParty();
		} catch (error) {
			console.error('팟 참여자 목록 조회 실패:', error);
		}
	};

	const handleParticipateClick = (): void => {
		if (!potDetail?.attended) {
			partyAttendance();
			handleParticipate();
		} else if (getCurrentTimeStatus() === 'voting_active') {
			// RANDOM 타입일 때는 투표 불가
			if (potDetail.vote.voteType === 'RANDOM') {
				return;
			}

			// 일반 투표일 때
			if (isVoted) {
				// 이미 투표한 경우 -> 다시 투표하기 (로컬 상태만 변경)
				setIsVoted(false);
				setSelectedRestaurantId(null);
			} else {
				// 아직 투표하지 않은 경우 -> 투표 액션
				handleVoteAction();
			}
		}
	};

	const handleParticipate = (): void => {
		setToastMessage('팟에 참여하였습니다.');
		setShowToast(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const handleVoteAction = (): void => {
		if (selectedRestaurantId && potDetail) {
			voteRestaurant(
				{
					teamId,
					partyId: Number(id),
					voteId: potDetail.vote.id,
					candidateId: selectedRestaurantId,
				},
				{
					onSuccess: () => {
						// 투표 성공 시 로컬 상태 즉시 업데이트
						setIsVoted(true);
						setToastMessage('투표가 완료되었습니다.');
						setShowToast(true);
						setTimeout(() => setShowToast(false), 3000);
					},
					onError: (error) => {
						console.error('투표 실패:', error);
						setToastMessage('투표에 실패했습니다.');
						setShowToast(true);
						setTimeout(() => setShowToast(false), 3000);
					},
				}
			);
		}
	};

	// 로딩 상태 처리
	if (isLoadingPotDetail) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					로딩 중...
				</Typography>
			</div>
		);
	}

	// 에러 상태 처리
	if (potDetailError) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					팟 정보를 불러오는데 실패했습니다.
				</Typography>
			</div>
		);
	}

	// 데이터가 없을 때 처리
	if (!potDetail) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					팟 정보가 없습니다.
				</Typography>
			</div>
		);
	}

	const handleRestaurantSelect = (restaurantId: number): void => {
		if (!canSelectRestaurant()) return;

		if (selectedRestaurantId === restaurantId) {
			setSelectedRestaurantId(null);
		} else {
			setSelectedRestaurantId(restaurantId);
		}
	};

	const canSelectRestaurant = (): boolean => {
		// RANDOM 타입일 때는 식당 선택 불가
		if (potDetail?.vote.voteType === 'RANDOM') {
			return false;
		}
		return potDetail?.attended === true && getCurrentTimeStatus() === 'voting_active';
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
						// TanStack Query가 자동으로 데이터를 다시 가져옴
						setToastMessage('식당을 추가하였습니다.');
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

	// 우승 식당들 찾기 (동점자 포함)
	const getWinningRestaurants = () => {
		if (!potDetail?.candidates || !potDetail?.voters) return [];

		// 각 후보별 투표 수 계산
		const voteCounts = potDetail.candidates.map((candidate) => ({
			...candidate,
			voteCount: potDetail.voters.filter((voter) => voter.candidateId === candidate.candidateId).length,
		}));

		// 가장 많은 표를 받은 식당 찾기
		const maxVotes = Math.max(...voteCounts.map((c) => c.voteCount));

		// 최고 득표수가 0이면 모든 식당이 우승자 (모두 검정색)
		if (maxVotes === 0) return voteCounts;

		// 최고 득표수를 받은 모든 식당들 반환 (동점자 포함)
		return voteCounts.filter((c) => c.voteCount === maxVotes);
	};

	// UI 스타일 관련 함수들
	const getRestaurantCardStyle = (restaurantId: number): string => {
		const timeStatus = getCurrentTimeStatus();

		if (timeStatus === 'after_end') {
			// 투표 종료 후 우승자들만 어두운 배경 (동점자 포함, 0표 전부도 포함)
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === restaurantId);
			if (isWinner) {
				return 'bg-[#484848] text-white';
			}
			return 'bg-white';
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
							fontColor={
								getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId)
									? PALETTE.white
									: PALETTE.gray07
							}
							className="font-medium"
						>
							{getCategoryDisplay(candidate.restaurantCategory)}
						</Typography>
						<Typography
							variant={FONT_VARIANT.header03}
							fontColor={
								getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId)
									? PALETTE.white
									: PALETTE.gray10
							}
							className="font-semibold mb-0.75"
						>
							{candidate.restaurantName}
						</Typography>
						<div className="flex items-center gap-1">
							<Icon
								name="star"
								size={14}
								className={
									getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId) ? 'text-white' : ''
								}
							/>
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={
									getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId)
										? PALETTE.white
										: PALETTE.gray08
								}
								className="font-medium"
							>
								{candidate.averageReviewScore.toFixed(1)}
							</Typography>
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={
									getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId)
										? PALETTE.white
										: PALETTE.gray08
								}
								className="font-medium"
							>
								·
							</Typography>
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={
									getCurrentTimeStatus() === 'after_end' && getWinningRestaurants().some((r) => r.candidateId === candidate.candidateId)
										? PALETTE.white
										: PALETTE.gray08
								}
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
						{toastMessage}
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
							<div
								className={`px-11.25 py-2.75 rounded-[20px] border border-gray-03 bg-gray-01 flex ${potDetail.vote.voteType === 'RANDOM' ? 'justify-center gap-20' : 'justify-between'}`}
							>
								{potDetail.vote.voteType === 'RANDOM' ? (
									<>
										<div className="flex flex-col">
											<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
												랜덤추첨
											</Typography>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
												{getTimeDisplayText().random}
											</Typography>
										</div>
										<div className="flex flex-col">
											<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
												식사시간
											</Typography>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
												{getTimeDisplayText().mealTime}
											</Typography>
										</div>
									</>
								) : (
									<>
										<div className="flex flex-col">
											<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
												투표시작
											</Typography>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
												{getTimeDisplayText().start}
											</Typography>
										</div>
										<div className="flex flex-col">
											<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
												투표마감
											</Typography>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
												{getTimeDisplayText().end}
											</Typography>
										</div>
										<div className="flex flex-col">
											<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
												식사시간
											</Typography>
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
												{getTimeDisplayText().meal}
											</Typography>
										</div>
									</>
								)}
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
									voteType={potDetail.vote.voteType}
									isPotCreator={isPotCreator}
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
									voteType={potDetail.vote.voteType}
									isPotCreator={isPotCreator}
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
