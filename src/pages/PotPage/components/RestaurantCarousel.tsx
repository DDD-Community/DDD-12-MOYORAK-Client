import { useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import winner from '@/assets/winner.png';
import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

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
		const voteCount = voters.filter((voter) => voter.candidateId === candidate.candidateId).length;

		return (
			<div className="relative" onMouseEnter={() => setHoveredRestaurantId(candidate.candidateId)} onMouseLeave={() => setHoveredRestaurantId(null)}>
				<div
					className="absolute bottom-4 left-4 border border-primary-200 rounded-[6px] flex items-center gap-1 px-1.25 py-0.75 bg-black/60 backdrop-blur-2px shadow-[0_0_3.161px_0_rgba(255,255,255,0.25)] z-10"
					style={{ padding: '3px 5px', borderRadius: '6px' }}
				>
					<Icon name="vote" />
					<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.primary200} className="font-semibold">
						{voteCount}표
					</Typography>
				</div>
				{/* Hover 시 참여자 정보 오버레이 */}
				{hoveredRestaurantId === candidate.candidateId && voteCount > 0 && (
					<div
						className="absolute bottom-11 left-1 bg-black/60 backdrop-blur-2px rounded-[10px] px-3.75 py-2.75 shadow-lg border border-gray-600 min-w-[100px] z-20"
						style={{ padding: '11px 15px', borderRadius: '10px', minWidth: '100px' }}
					>
						<div className="flex flex-col gap-1.5" style={{ gap: '6px' }}>
							{voters
								.filter((voter) => voter.candidateId === candidate.candidateId)
								.map((voter) => (
									<div key={voter.name} className="flex items-center gap-2" style={{ gap: '8px' }}>
										<div
											className="w-4.5 h-4.5 rounded-[400px] bg-gray-02 border border-gray-04"
											style={{ width: '18px', height: '18px', borderRadius: '400px' }}
										>
											<img src={voter.profileImageUrl} alt={voter.name} className="w-full h-full object-cover" style={{ borderRadius: '400px' }} />
										</div>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray03} className="font-medium">
											{voter.name}
										</Typography>
									</div>
								))}
						</div>
						<div
							className="absolute top-full left-3.5 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-transparent border-t-gray-800/95"
							style={{ left: '14px', borderLeftWidth: '10px', borderRightWidth: '10px', borderTopWidth: '8px' }}
						/>
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
					<div className="w-7.5 h-7.5 bg-[#BEEE05] rounded-lg flex items-center justify-center" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
						<Icon name="check" size={16} className="text-white" />
					</div>
				) : (
					<div
						className="w-7.5 h-7.5 border-1 border-gray-04 rounded-lg bg-gray-02 flex items-center justify-center"
						style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid' }}
					>
						<Icon name="noCheck" size={16} />
					</div>
				)}
			</div>
		);
	};

	// 우승 식당들 찾기 (동점자 포함)
	const getWinningRestaurants = () => {
		if (!restaurants || !voters) return [];

		const voteCounts = restaurants.map((candidate) => ({
			...candidate,
			voteCount: voters.filter((voter) => voter.candidateId === candidate.candidateId).length,
		}));

		const maxVotes = Math.max(...voteCounts.map((c) => c.voteCount));

		if (maxVotes === 0) return voteCounts;

		return voteCounts.filter((c) => c.voteCount === maxVotes);
	};

	// 투표 상태에 따른 카드 스타일
	const getCardStyle = (candidate: Candidate) => {
		const baseStyle = `bg-white overflow-hidden ${!isVoted ? 'cursor-pointer' : 'cursor-default'} transition-all duration-300 relative restaurant-card h-full`;

		if (timeStatus === 'after_end') {
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
			if (isWinner) {
				return `${baseStyle} bg-[#484848]`;
			}
			return `${baseStyle}`;
		}

		if (isVoted && selectedRestaurantId === candidate.candidateId) {
			return `${baseStyle} border border-[#BEEE05] bg-[rgba(190,238,5,0.15)]`;
		}

		return `${baseStyle}`;
	};

	// 투표 상태에 따른 텍스트 색상
	const getTextColor = (candidate: Candidate, type: 'category' | 'name' | 'rating' | 'review') => {
		if (timeStatus === 'after_end') {
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
			const winningRestaurants = getWinningRestaurants();
			const isWinner = winningRestaurants.some((restaurant) => restaurant.candidateId === candidate.candidateId);
			if (isWinner) {
				return 'text-white';
			}
		}
		return 'text-red-500';
	};

	// 카드 렌더링 함수
	const renderCard = (candidate: Candidate) => {
		const isWinner = timeStatus === 'after_end' && getWinningRestaurants().some((restaurant) => restaurant.candidateId === candidate.candidateId);

		return (
			<div
				onClick={() => !isVoted && onCardClick?.(candidate)}
				className={getCardStyle(candidate)}
				style={{ borderRadius: '20px', boxShadow: isVoted && selectedRestaurantId === candidate.candidateId ? '0 0 7px 0 rgba(0, 0, 0, 0.05)' : undefined }}
			>
				<div className="w-full overflow-hidden relative h-[200px]" style={{ height: '200px' }}>
					<img src={candidate.reviewImagePath} alt={`${candidate.restaurantName} 음식`} className="w-full h-full object-cover" />
					<div className="absolute inset-0 gradient-overlay opacity-0 transition-opacity duration-300" />

					{/* 1등 배지 */}
					{isWinner && (
						<div className="absolute top-2 right-2 z-20">
							<img src={winner} alt="1등" className="w-15	 h-15" />
						</div>
					)}

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
					style={{ padding: '16px' }}
				>
					<Typography variant={FONT_VARIANT.caption01} fontColor={getTextColor(candidate, 'category')} className="mb-1">
						{getCategoryDisplay(candidate.restaurantCategory)}
					</Typography>
					<Typography variant={FONT_VARIANT.body01} fontColor={getTextColor(candidate, 'name')} className="font-semibold mb-0.75">
						{candidate.restaurantName}
					</Typography>
					<div className="flex items-center gap-1" style={{ gap: '4px' }}>
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
		);
	};

	// 1개일 때는 슬라이드 없이 렌더링
	if (restaurants.length === 1) {
		return (
			<div style={{ padding: '0 20px' }}>
				<div style={{ maxWidth: '335px', margin: '0 auto' }}>{renderCard(restaurants[0])}</div>
			</div>
		);
	}

	// 2개일 때 - 슬라이드 가능하게 하되 가운데 정렬
	if (restaurants.length === 2) {
		return (
			<div style={{ padding: '0 20px' }}>
				<div style={{ maxWidth: '335px', margin: '0 auto', position: 'relative' }}>
					<style>{`
                  .swiper-button-prev,
                  .swiper-button-next {
                     width: 38px !important;
                     height: 38px !important;
                     background: rgba(48, 48, 48, 0.7);
                     border-radius: 50%;
                     color: white;
                  }
                  .swiper-button-prev:after,
                  .swiper-button-next:after {
                     font-size: 20px !important;
                  }
                  .swiper-button-prev {
                     left: 10px !important;
                  }
                  .swiper-button-next {
                     right: 10px !important;
                  }
               `}</style>
					<Swiper modules={[Navigation]} spaceBetween={0} slidesPerView={1} navigation loop={true}>
						{restaurants.map((candidate) => (
							<SwiperSlide key={candidate.candidateId}>{renderCard(candidate)}</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		);
	}

	// 3개 이상일 때 - 양 옆 카드가 보이는 슬라이드
	return (
		<div className="restaurant-swiper-wrapper">
			<style>{`
            .restaurant-swiper-wrapper {
               padding: 0 10px;
               overflow: hidden;
            }
            
            .restaurant-swiper-wrapper .swiper {
               overflow: visible !important;
               padding: 10px 0;
            }
            
            .restaurant-swiper-wrapper .swiper-slide {
               transition: all 0.3s ease;
               opacity: 0.5;
               transform: scale(0.75);
            }
            
            .restaurant-swiper-wrapper .swiper-slide-active {
               opacity: 1;
               transform: scale(1);
            }
            
            .restaurant-swiper-wrapper .swiper-button-prev,
            .restaurant-swiper-wrapper .swiper-button-next {
               width: 38px !important;
               height: 38px !important;
               background: rgba(48, 48, 48, 0.7);
               border-radius: 50%;
               color: white;
               top: 50%;
               transform: translateY(-50%);
            }
            
            .restaurant-swiper-wrapper .swiper-button-prev:after,
            .restaurant-swiper-wrapper .swiper-button-next:after {
               font-size: 20px !important;
            }
            
            .restaurant-swiper-wrapper .swiper-button-prev {
               left: 20px !important;
            }
            
            .restaurant-swiper-wrapper .swiper-button-next {
               right: 20px !important;
            }
            
            .restaurant-swiper-wrapper .swiper-button-disabled {
               opacity: 0.35;
            }
         `}</style>

			<Swiper
				modules={[Navigation]}
				spaceBetween={12}
				slidesPerView={1.6}
				centeredSlides={true}
				navigation
				loop={restaurants.length > 3}
				breakpoints={{
					480: {
						slidesPerView: 1.5,
						spaceBetween: 15,
					},
				}}
			>
				{restaurants.map((candidate) => (
					<SwiperSlide key={candidate.candidateId}>{renderCard(candidate)}</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default RestaurantCarousel;
