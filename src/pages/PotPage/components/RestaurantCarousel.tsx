import { useState } from 'react';
import Slider from 'react-slick';

import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Candidate {
	candidateId: number;
	teamRestaurantId: number;
	restaurantName: string;
	restaurantCategory: string;
	averageReviewScore: number;
	reviewCount: number;
	reviewImagePath: string;
}

interface Voter {
	candidateId: number;
	name: string;
	profileImageUrl: string;
}

interface RestaurantCarouselProps {
	restaurants: Candidate[];
	onCardClick?: (candidate: Candidate) => void;
	selectedRestaurantId?: number | null;
	canSelectRestaurant?: boolean;
	timeStatus?: 'before_start' | 'voting_active' | 'after_end';
	isVoted?: boolean;
	voters?: Voter[];
}

const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9.5 h-9.5 bg-[#303030B3] rounded-full flex items-center justify-center transition-all"
		aria-label="이전 식당 보기"
	>
		<Icon name="arrow" size={22} className="rotate-180 text-white" />
	</button>
);

const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9.5 h-9.5 bg-[#303030B3] rounded-full flex items-center justify-center transition-all"
		aria-label="다음 식당 보기"
	>
		<Icon name="arrow" size={22} className="text-white" />
	</button>
);

const RestaurantCarousel = ({
	restaurants,
	onCardClick,
	selectedRestaurantId,
	canSelectRestaurant = false,
	timeStatus = 'before_start',
	isVoted = false,
	voters = [],
}: RestaurantCarouselProps) => {
	const [hoveredRestaurantId, setHoveredRestaurantId] = useState<number | null>(null);
	const { getCategoryDisplay } = useCategoryMapping();

	// 투표 배지 렌더링
	const renderVoteBadge = (candidate: Candidate) => {
		// voters 배열에서 해당 candidateId를 가진 투표자 수 계산
		const voteCount = voters.filter((voter) => voter.candidateId === candidate.candidateId).length;

		return (
			<div className="relative" onMouseEnter={() => setHoveredRestaurantId(candidate.candidateId)} onMouseLeave={() => setHoveredRestaurantId(null)}>
				<div className="absolute bottom-4 left-4 border border-primary-200 rounded-[6px] flex items-center gap-1 px-1.25 py-0.75 bg-black/60 backdrop-blur-2px shadow-[0_0_3.161px_0_rgba(255,255,255,0.25)]">
					<Icon name="vote" />
					<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.primary200} className="font-semibold">
						{voteCount}표
					</Typography>
				</div>
				{/* Hover 시 참여자 정보 오버레이 */}
				{hoveredRestaurantId === candidate.candidateId && voteCount > 0 && (
					<div className="absolute bottom-11 left-1 bg-black/60 backdrop-blur-2px rounded-[10px] px-3.75 py-2.75 shadow-lg border border-gray-600 min-w-[100px] z-20">
						<div className="flex flex-col gap-1.5">
							{voters
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

	// 선택 상태 체크박스 렌더링
	const renderSelectionCheckbox = (candidate: Candidate) => {
		if (!canSelectRestaurant || isVoted) return null;

		const isSelected = selectedRestaurantId === candidate.candidateId;

		return (
			<div className="absolute top-4 right-4 z-10">
				{isSelected ? (
					<div className="w-7.5 h-7.5 bg-[#BEEE05] rounded-lg flex items-center justify-center">
						<Icon name="check" size={16} className="text-white" />
					</div>
				) : (
					<div className="w-7.5 h-7.5 border-1 border-gray-04 rounded-lg bg-gray-02 flex items-center justify-center">
						<Icon name="noCheck" size={16} />
					</div>
				)}
			</div>
		);
	};

	// 우승 식당들 찾기 (동점자 포함)
	const getWinningRestaurants = () => {
		if (!restaurants || !voters) return [];

		// 각 후보별 투표 수 계산
		const voteCounts = restaurants.map((candidate) => ({
			...candidate,
			voteCount: voters.filter((voter) => voter.candidateId === candidate.candidateId).length,
		}));

		// 가장 많은 표를 받은 식당 찾기
		const maxVotes = Math.max(...voteCounts.map((c) => c.voteCount));

		// 최고 득표수가 0이면 모든 식당이 우승자 (모두 검정색)
		if (maxVotes === 0) return voteCounts;

		// 최고 득표수를 받은 모든 식당들 반환 (동점자 포함)
		return voteCounts.filter((c) => c.voteCount === maxVotes);
	};

	// 투표 상태에 따른 카드 스타일
	const getCardStyle = (candidate: Candidate) => {
		const baseStyle = `bg-white rounded-[20px] overflow-hidden ${!isVoted ? 'cursor-pointer' : 'cursor-default'} transition-all duration-300 relative mx-auto restaurant-card`;

		if (timeStatus === 'after_end') {
			// 투표 종료 후 우승자들만 어두운 배경 (동점자 포함, 0표 전부도 포함)
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
			if (isWinner) {
				return `${baseStyle} bg-[#484848]`;
			}
			return `${baseStyle}`;
		}

		if (isVoted && selectedRestaurantId === candidate.candidateId) {
			return `${baseStyle} border border-[#BEEE05] bg-[rgba(190,238,5,0.15)] box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.05)`;
		}

		return `${baseStyle}`;
	};

	// 투표 상태에 따른 텍스트 색상
	const getTextColor = (candidate: Candidate, type: 'category' | 'name' | 'rating' | 'review') => {
		if (timeStatus === 'after_end') {
			// 투표 종료 후 우승자들만 흰색 텍스트 (동점자 포함, 0표 전부도 포함)
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
			if (isWinner) {
				return PALETTE.white;
			}
		}

		switch (type) {
			case 'category':
				return PALETTE.gray07;
			case 'name':
				return PALETTE.gray10;
			case 'rating':
				return PALETTE.gray09;
			case 'review':
				return PALETTE.gray08;
			default:
				return PALETTE.gray10;
		}
	};

	const getStarIconColor = (candidate: Candidate) => {
		if (timeStatus === 'after_end') {
			// 투표 종료 후 우승자들만 흰색 별 (동점자 포함, 0표 전부도 포함)
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
			if (isWinner) {
				return 'text-white';
			}
		}
		return 'text-red-500';
	};

	const slickSettings = {
		dots: false,
		infinite: restaurants.length > 1,
		speed: 500,
		slidesToShow: restaurants.length <= 1 ? restaurants.length : 1,
		slidesToScroll: 1,
		centerMode: restaurants.length > 2,
		arrows: restaurants.length > 2,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
		autoplay: false,
		swipeToSlide: true,
		focusOnSelect: false,
	};

	return (
		<Slider {...slickSettings}>
			{restaurants.map((candidate) => (
				<div key={candidate.candidateId}>
					<div onClick={() => !isVoted && onCardClick?.(candidate)} className={getCardStyle(candidate)}>
						<div className="w-full overflow-hidden relative h-[200px]">
							<img src={candidate.reviewImagePath} alt={`${candidate.restaurantName} 음식`} className="w-full h-full object-cover" />
							<div className="absolute inset-0 gradient-overlay opacity-0 transition-opacity duration-300" />

							{renderVoteBadge(candidate)}

							{renderSelectionCheckbox(candidate)}
						</div>

						{/* 카드 정보 */}
						<div
							className={`p-4 ${
								timeStatus === 'after_end'
									? (() => {
											const winningRestaurants = getWinningRestaurants();
											const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
											return isWinner ? 'bg-[#484848]' : 'bg-white';
										})()
									: isVoted && selectedRestaurantId === candidate.candidateId
										? 'bg-[rgba(190,238,5,0.15)]'
										: 'bg-white'
							}`}
						>
							<Typography variant={FONT_VARIANT.caption01} fontColor={getTextColor(candidate, 'category')} className="mb-1">
								{getCategoryDisplay(candidate.restaurantCategory)}
							</Typography>
							<Typography variant={FONT_VARIANT.body01} fontColor={getTextColor(candidate, 'name')} className="font-semibold mb-0.75">
								{candidate.restaurantName}
							</Typography>
							<div className="flex items-center gap-1">
								<Icon name="star" size={14} className={getStarIconColor(candidate)} />
								<Typography variant={FONT_VARIANT.body02} fontColor={getTextColor(candidate, 'rating')} className="font-medium">
									{candidate.averageReviewScore.toFixed(1)}
								</Typography>
								<Typography variant={FONT_VARIANT.body02} fontColor={getTextColor(candidate, 'review')}>
									· 리뷰 {candidate.reviewCount}
								</Typography>
							</div>
						</div>
					</div>
				</div>
			))}
		</Slider>
	);
};

export default RestaurantCarousel;
