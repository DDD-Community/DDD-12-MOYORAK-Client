import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import starIcon from '@/assets/star.png';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const RESTAURANT_INFO = {
	name: '감가네 김치찜',
	category: '한식',
	description: '식당을 한줄로 설명해주세요',
	star: 5,
	reviewCount: 50,
};

const RESTAURANT_INFO_ICON = [
	{
		name: '입장 대기시간',
		value: '10분',
	},
	{
		name: '음식 준비시간',
		value: '5분',
	},
	{
		name: '외부링크',
		value: 'Click!',
	},
];

const REVIEW_LIST = [
	{
		name: '김지민',
		date: '2025.06.25',
		review: '식당이 맛있어요',
	},
	{
		name: '김지민',
		date: '2025.06.24',
		review: '식당이 맛있어요',
	},
];

const RestaurantDetail = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<'reviews' | 'photos'>('reviews');

	return (
		<div className="bg-gray-02 min-h-screen">
			<NavBar variant="iconWithText" leftText="감가네 김치찜" onLeftIconClick={() => navigate(-1)} />

			<div className="relative">
				<img src="/src/assets/restaurantTest.jpg" alt="restaurantTest" className="w-full h-[300px] object-cover" />
				<div className="absolute bottom-6 right-4 w-[50px] h-[50px] bg-white/80 rounded-[30px] backdrop-blur-sm flex items-center justify-center">
					<Icon name="share" size={24} />
				</div>
			</div>

			<div className="bg-white mt-[-10px] relative z-10 rounded-t-[20px] pb-6">
				<div className="px-4.5 pt-6.5">
					{/* 식당 정보 */}
					<div className="mb-[3px] flex gap-2 items-center justify-center">
						<Typography variant={FONT_VARIANT.header01} fontColor={PALETTE.gray10} className="font-semibold">
							{RESTAURANT_INFO.name}
						</Typography>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
							{RESTAURANT_INFO.category}
						</Typography>
					</div>

					{/* 설명 */}
					<div className="mb-2 text-center">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
							{RESTAURANT_INFO.description}
						</Typography>
					</div>

					{/* 별점 */}
					<div className="flex items-center mb-6 justify-center">
						<div className="flex items-center mr-2">
							{[...Array(RESTAURANT_INFO.star)].map((_, index) => (
								<img key={index} src={starIcon} alt="star" className="w-3.5 h-3.5" />
							))}
						</div>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
							{RESTAURANT_INFO.star}.0
						</Typography>
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
							· 리뷰 {RESTAURANT_INFO.reviewCount}
						</Typography>
					</div>

					{/* 정보 아이콘들 */}
					<div className="flex flex-col rounded-[20px] border border-gray-03 bg-gray-01 px-4.5 py-6.5 mb-3.75">
						<div className="flex justify-between ">
							<div className="flex flex-col items-center">
								<Icon name="persons" size={24} className="mb-2" />
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
									{RESTAURANT_INFO_ICON[0].name}
								</Typography>
								<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
									{RESTAURANT_INFO_ICON[0].value}
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Icon name="prepareHour" size={24} className="mb-2" />
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
									{RESTAURANT_INFO_ICON[1].name}
								</Typography>
								<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
									{RESTAURANT_INFO_ICON[1].value}
								</Typography>
							</div>
							<div className="flex flex-col items-center" onClick={() => window.open(RESTAURANT_INFO_ICON[2].value, '_blank')}>
								<Icon name="link" size={24} className="mb-2" />
								<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
									{RESTAURANT_INFO_ICON[2].name}
								</Typography>
								<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
									{RESTAURANT_INFO_ICON[2].value}
								</Typography>
							</div>
						</div>
						<button className="w-full rounded-[20px] bg-[#1F2511] h-[46px] text-[#BEEE05] mt-5.5 text-body02 font-semibold leading-[24px]">리뷰쓰기</button>
					</div>

					{/* 탭 */}
					<div className="flex border-b border-gray-04 mb-7.5 ml-[-18px] mr-[-18px]">
						<button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 ${activeTab === 'reviews' ? 'border-b-2 border-gray-10' : ''}`}>
							<Typography variant={FONT_VARIANT.body01} fontColor={activeTab === 'reviews' ? PALETTE.gray10 : PALETTE.gray07}>
								팀원들의 리뷰
							</Typography>
						</button>
						<button onClick={() => setActiveTab('photos')} className={`flex-1 py-3 ${activeTab === 'photos' ? 'border-b-2 border-gray-10' : ''}`}>
							<Typography variant={FONT_VARIANT.body01} fontColor={activeTab === 'photos' ? PALETTE.gray10 : PALETTE.gray07}>
								팀원들의 사진
							</Typography>
						</button>
					</div>

					{/* 리뷰 섹션 */}
					{activeTab === 'reviews' && (
						<div>
							<div className="flex items-center gap-1.5 mb-5">
								<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold">
									리뷰
								</Typography>
								<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray08}>
									{REVIEW_LIST.length}개
								</Typography>
							</div>

							{/* 리뷰 아이템 */}
							{REVIEW_LIST.map((review) => (
								<div className="flex items-start" key={review.name}>
									<div className="flex items-center justify-center mr-3">
										<Icon name="mypage" size={40} />
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
												{review.name}
											</Typography>
											<Icon name="option" size={16} />
										</div>
										<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
											{review.date}
										</Typography>
										<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray10}>
											{review.review}
										</Typography>
									</div>
								</div>
							))}
						</div>
					)}

					{/* 사진 섹션 */}
					{activeTab === 'photos' && (
						<div>
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
								사진이 없습니다
							</Typography>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default RestaurantDetail;
