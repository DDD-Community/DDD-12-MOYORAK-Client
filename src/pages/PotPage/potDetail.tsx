import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import Participant from './components/Participant';
import RestaurantCarousel from './components/RestaurantCarousel';

// 상수 데이터
const SAMPLE_RESTAURANTS = [
	{
		id: 1,
		imageUrl: '/src/assets/restaurantTest.jpg',
		category: '양식',
		teamName: '비언유주얼',
		rating: 5.0,
		reviewCount: 50,
		votes: 2,
		participants: [
			{ id: 1, name: '김지민', profileImage: '/src/assets/profile1.jpg' },
			{ id: 2, name: '박서연', profileImage: '/src/assets/profile2.jpg' },
		],
	},
	{
		id: 2,
		imageUrl: '/src/assets/restaurantTest.jpg',
		category: '양식',
		teamName: '블랙랩',
		rating: 5.0,
		reviewCount: 50,
		votes: 1,
		participants: [{ id: 3, name: '이준호', profileImage: '/src/assets/profile3.jpg' }],
	},
	{
		id: 3,
		imageUrl: '/src/assets/restaurantTest.jpg',
		category: '양식',
		teamName: '심플로우',
		rating: 5.0,
		reviewCount: 50,
		votes: 0,
		participants: [],
	},
];

const VOTE_TIME = {
	start: '20:00',
	end: '19:00',
	meal: '12:30',
};

const BUTTON_TEXT = {
	participate: '참여하기',
	participated: '아직 투표가 시작되지 않았어요!',
	vote: '투표하기',
	voteAgain: '다시 투표하기',
	voteEnded: '투표가 종료되었어요',
};

// 타입 정의
type TimeStatus = 'before_start' | 'voting_active' | 'after_end';
type TabType = 'restaurant' | 'participant';
type ViewType = 'carousel' | 'list';

const PotDetail = () => {
	const navigate = useNavigate();

	// 상태 관리
	const [activeTab, setActiveTab] = useState<TabType>('restaurant');
	const [showToast, setShowToast] = useState(false);
	const [viewType, setViewType] = useState<ViewType>('carousel');
	const [isParticipated, setIsParticipated] = useState(false);
	const [isVoted, setIsVoted] = useState(false);
	const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
	const [hoveredRestaurantId, setHoveredRestaurantId] = useState<number | null>(null);

	// 시간 관련 유틸리티 함수들
	const getCurrentTimeStatus = (): TimeStatus => {
		const now = new Date();
		const startTime = new Date();
		startTime.setHours(19, 0, 0, 0);

		const endTime = new Date();
		endTime.setHours(19, 0, 0, 0);

		if (now < startTime) return 'before_start';
		if (now >= startTime && now < endTime) return 'voting_active';
		return 'after_end';
	};

	const getVoteStatusText = (): string => {
		const timeStatus = getCurrentTimeStatus();
		const statusMap = {
			before_start: '투표 전',
			voting_active: '투표 중',
			after_end: '투표 종료',
		};
		return statusMap[timeStatus];
	};

	// 버튼 관련 로직
	const getButtonText = (): string => {
		const timeStatus = getCurrentTimeStatus();

		// 투표가 종료된 경우, 참여 여부와 관계없이 종료 메시지 표시
		if (timeStatus === 'after_end') {
			return BUTTON_TEXT.voteEnded;
		}

		// 참여하지 않은 경우
		if (!isParticipated) {
			return BUTTON_TEXT.participate;
		}

		// 이미 참여한 경우
		const buttonTextMap = {
			before_start: BUTTON_TEXT.participated,
			voting_active: isVoted ? BUTTON_TEXT.voteAgain : BUTTON_TEXT.vote,
		};

		return buttonTextMap[timeStatus] || BUTTON_TEXT.participate;
	};

	const isButtonDisabled = (): boolean => {
		const timeStatus = getCurrentTimeStatus();

		if (timeStatus === 'after_end') return true;
		if (!isParticipated) return false;
		if (timeStatus === 'before_start') return true;
		if (timeStatus === 'voting_active') {
			if (isVoted) return false;
			return selectedRestaurantId === null;
		}
		return true;
	};

	const shouldShowAddRestaurantButton = (): boolean => {
		const timeStatus = getCurrentTimeStatus();
		return isParticipated && timeStatus === 'before_start';
	};

	// 이벤트 핸들러들
	const handleParticipateClick = (): void => {
		if (isButtonDisabled()) return;

		const timeStatus = getCurrentTimeStatus();

		if (!isParticipated) {
			handleParticipate();
		} else if (timeStatus === 'voting_active') {
			handleVoteAction();
		}
	};

	const handleParticipate = (): void => {
		setShowToast(true);
		setIsParticipated(true);
		setTimeout(() => setShowToast(false), 3000);
	};

	const handleVoteAction = (): void => {
		if (!isVoted) {
			if (selectedRestaurantId) {
				setIsVoted(true);
				// TODO: 실제 투표 API 호출 로직 추가
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
		return isParticipated && getCurrentTimeStatus() === 'voting_active' && !isVoted;
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

	const getButtonClassName = (): string => {
		return isButtonDisabled() ? 'bg-gray-03 text-gray-08' : 'bg-[#BEEE05] text-gray-10';
	};

	// 렌더링 헬퍼 함수들
	const renderVoteBadge = (restaurant: any) => (
		<div className="relative" onMouseEnter={() => setHoveredRestaurantId(restaurant.id)} onMouseLeave={() => setHoveredRestaurantId(null)}>
			<div className="absolute bottom-1 left-1 border border-primary-200 rounded-[6px] flex items-center gap-1 px-1.25 py-0.75 bg-black/60 backdrop-blur-2px shadow-[0_0_3.161px_0_rgba(255,255,255,0.25)]">
				<Icon name="vote" />
				<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.primary200} className="font-semibold">
					{restaurant.votes}표
				</Typography>
			</div>

			{/* Hover 시 참여자 정보 오버레이 */}
			{hoveredRestaurantId === restaurant.id && restaurant.participants.length > 0 && (
				<div className="absolute bottom-11 left-1 bg-black/60 backdrop-blur-2px rounded-[10px] px-3.75 py-2.75 shadow-lg border border-gray-600 min-w-[100px] z-10">
					<div className="flex flex-col gap-1.5">
						{restaurant.participants.map((participant: any) => (
							<div key={participant.id} className="flex items-center gap-2">
								<div className="w-4.5 h-4.5 rounded-[400px] bg-gray-02 border border-gray-04">
									<img src={participant.profileImage} alt={participant.name} className="w-full h-full object-cover" />
								</div>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray03} className="font-medium">
									{participant.name}
								</Typography>
							</div>
						))}
					</div>
					<div className="absolute top-full left-3.5 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-transparent border-t-gray-800/95" />
				</div>
			)}
		</div>
	);

	const renderRestaurantCheckbox = (restaurantId: number) => {
		if (!canSelectRestaurant()) return null;

		if (isVoted) {
			return <></>;
		}

		if (selectedRestaurantId === restaurantId) {
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
			{SAMPLE_RESTAURANTS.map((restaurant) => (
				<div
					key={restaurant.id}
					className={`rounded-[15px] p-2.5 flex items-center gap-3.5 transition-all ${
						canSelectRestaurant() ? 'cursor-pointer' : 'cursor-default'
					} ${getRestaurantCardStyle(restaurant.id)}`}
					onClick={() => handleRestaurantSelect(restaurant.id)}
				>
					<div className="relative">
						<img src={restaurant.imageUrl} alt={restaurant.teamName} className="w-20.75 h-20.75 rounded-[12px] object-cover" />
						{renderVoteBadge(restaurant)}
					</div>

					<div className="flex-1">
						<Typography
							variant={FONT_VARIANT.caption01}
							fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray07}
							className="font-medium"
						>
							{restaurant.category}
						</Typography>
						<Typography
							variant={FONT_VARIANT.header03}
							fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray10}
							className="font-semibold mb-0.75"
						>
							{restaurant.teamName}
						</Typography>
						<div className="flex items-center gap-1">
							<Icon name="star" size={14} />
							<Typography
								variant={FONT_VARIANT.label01}
								fontColor={getCurrentTimeStatus() === 'after_end' ? PALETTE.white : PALETTE.gray08}
								className="font-medium"
							>
								{restaurant.rating.toFixed(1)}
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
								리뷰 {restaurant.reviewCount}
							</Typography>
						</div>
					</div>

					{renderRestaurantCheckbox(restaurant.id)}
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
						팟에 참여하였습니다.
					</Typography>
				</div>
			</div>
		);

	return (
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
						오늘 양식 같이 먹으러 가요!
					</Typography>
					<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
						저는 1번 식당을 완전 강추합니다
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
								{VOTE_TIME.start}
							</Typography>
						</div>
						<div className="flex flex-col">
							<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
								투표마감
							</Typography>
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
								{VOTE_TIME.end}
							</Typography>
						</div>
						<div className="flex flex-col">
							<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08}>
								식사시간
							</Typography>
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="font-semibold">
								{VOTE_TIME.meal}
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
									{SAMPLE_RESTAURANTS.length}개
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
								<button className="flex items-center gap-1 px-3 py-1.5 rounded-[17px] bg-gray-01 border border-gray-03">
									<Icon name="restaurantPlus" size={16} className="text-gray-08" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-semibold">
										식당 추가
									</Typography>
								</button>
							)}
						</div>

						{/* 식당 목록 */}
						{viewType === 'carousel' && (
							<RestaurantCarousel
								restaurants={SAMPLE_RESTAURANTS}
								selectedRestaurantId={selectedRestaurantId}
								canSelectRestaurant={canSelectRestaurant()}
								timeStatus={getCurrentTimeStatus()}
								onCardClick={(restaurant) => handleRestaurantSelect(restaurant.id)}
								isVoted={isVoted}
							/>
						)}
						{viewType === 'list' && renderRestaurantList()}

						{/* 하단 버튼 */}
						<div className="fixed bottom-7.5 w-full left-0 px-4.5">
							<Button
								variant={isButtonDisabled() ? 'disabled' : 'active'}
								onClick={handleParticipateClick}
								disabled={isButtonDisabled()}
								className={getButtonClassName()}
							>
								{getButtonText()}
							</Button>
						</div>

						{/* 토스트 메시지 */}
						{renderToast()}
					</div>
				)}

				{/* 참여자 탭 */}
				{activeTab === 'participant' && <Participant />}
			</div>
		</>
	);
};

export default PotDetail;
