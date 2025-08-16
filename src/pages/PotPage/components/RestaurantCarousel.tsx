import { useState } from 'react';
import Slider from 'react-slick';

import Icon from '@/components/Icon';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface RestaurantCard {
	id: number;
	imageUrl: string;
	category: string;
	teamName: string;
	rating: number;
	reviewCount: number;
	votes: number;
	participants: Array<{
		id: number;
		name: string;
		profileImage: string;
	}>;
}

interface RestaurantCarouselProps {
	restaurants: RestaurantCard[];
	onCardClick?: (restaurant: RestaurantCard) => void;
	selectedRestaurantId?: number | null;
	canSelectRestaurant?: boolean;
	timeStatus?: 'before_start' | 'voting_active' | 'after_end';
	isVoted?: boolean;
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
}: RestaurantCarouselProps) => {
	const [hoveredRestaurantId, setHoveredRestaurantId] = useState<number | null>(null);

	// 투표 배지 렌더링
	const renderVoteBadge = (restaurant: RestaurantCard) => (
		<div className="relative" onMouseEnter={() => setHoveredRestaurantId(restaurant.id)} onMouseLeave={() => setHoveredRestaurantId(null)}>
			<div className="absolute bottom-4 left-4 border border-primary-200 rounded-[6px] flex items-center gap-1 px-1.25 py-0.75 bg-black/60 backdrop-blur-2px shadow-[0_0_3.161px_0_rgba(255,255,255,0.25)]">
				<Icon name="vote" />
				<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.primary200} className="font-semibold">
					{restaurant.votes}표
				</Typography>
			</div>
			{/* Hover 시 참여자 정보 오버레이 */}
			{hoveredRestaurantId === restaurant.id && restaurant.participants.length > 0 && (
				<div className="absolute bottom-11 left-1 bg-black/60 backdrop-blur-2px rounded-[10px] px-3.75 py-2.75 shadow-lg border border-gray-600 min-w-[100px] z-20">
					<div className="flex flex-col gap-1.5">
						{restaurant.participants.map((participant) => (
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

	// 선택 상태 체크박스 렌더링
	const renderSelectionCheckbox = (restaurant: RestaurantCard) => {
		if (!canSelectRestaurant) return null;

		const isSelected = selectedRestaurantId === restaurant.id;

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

	// 투표 상태에 따른 카드 스타일
	const getCardStyle = (restaurant: RestaurantCard) => {
		const baseStyle = 'bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 relative mx-auto restaurant-card';

		if (timeStatus === 'after_end') {
			return `${baseStyle} bg-[#484848]`;
		}

		if (isVoted && selectedRestaurantId === restaurant.id) {
			return `${baseStyle} border border-[#BEEE05] bg-[rgba(190,238,5,0.15)] box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.05)`;
		}

		return `${baseStyle}`;
	};

	// 투표 상태에 따른 텍스트 색상
	const getTextColor = (type: 'category' | 'name' | 'rating' | 'review') => {
		if (timeStatus === 'after_end') {
			return PALETTE.white;
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

	// 투표 상태에 따른 별점 아이콘 색상
	const getStarIconColor = () => {
		return timeStatus === 'after_end' ? 'text-white' : 'text-red-500';
	};

	const slickSettings = {
		dots: false,
		infinite: restaurants.length > 2,
		speed: 500,
		slidesToShow: restaurants.length <= 2 ? restaurants.length : 1,
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
			{restaurants.map((restaurant) => (
				<div key={restaurant.id}>
					<div onClick={() => onCardClick?.(restaurant)} className={getCardStyle(restaurant)}>
						<div className="w-full overflow-hidden relative h-[200px]">
							<img src={restaurant.imageUrl} alt={`${restaurant.teamName} 음식`} className="w-full h-full object-cover" />
							<div className="absolute inset-0 gradient-overlay opacity-0 transition-opacity duration-300" />

							{/* 투표 배지 */}
							{renderVoteBadge(restaurant)}

							{/* 선택 상태 체크박스 */}
							{renderSelectionCheckbox(restaurant)}
						</div>

						{/* 카드 정보 */}
						<div
							className={`p-4 ${
								timeStatus === 'after_end' ? 'bg-[#484848]' : isVoted && selectedRestaurantId === restaurant.id ? 'bg-[rgba(190,238,5,0.15)]' : 'bg-white'
							}`}
						>
							<Typography variant={FONT_VARIANT.caption01} fontColor={getTextColor('category')} className="mb-1">
								{restaurant.category}
							</Typography>
							<Typography variant={FONT_VARIANT.body01} fontColor={getTextColor('name')} className="font-semibold mb-0.75">
								{restaurant.teamName}
							</Typography>
							<div className="flex items-center gap-1">
								<Icon name="star" size={14} className={getStarIconColor()} />
								<Typography variant={FONT_VARIANT.body02} fontColor={getTextColor('rating')} className="font-medium">
									{restaurant.rating.toFixed(1)}
								</Typography>
								<Typography variant={FONT_VARIANT.body02} fontColor={getTextColor('review')}>
									· 리뷰 {restaurant.reviewCount}
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
