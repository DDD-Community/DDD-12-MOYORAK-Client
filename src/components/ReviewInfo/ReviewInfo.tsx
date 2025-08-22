import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { del, get } from '@/apis';
import reviewDelete from '@/assets/reviewDelete.png';
import starIcon from '@/assets/star.png';
import Button from '@/components/Button/Button';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Icon from '@/components/Icon';
import { CustomToast } from '@/components/Toast/BaseToaster';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IReviewListResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: [
		{
			id: number;
			extraText: string;
			score: number;
			servingTime: number;
			waitingTime: number;
			userNickname: string;
			userProfileImageUrl: string;
			photoUrls: string[];
			createdDate: string;
		},
	];
}

interface IReviewInfoProps {
	restaurantName: string;
}

const ReviewInfo = ({ restaurantName }: IReviewInfoProps) => {
	const navigate = useNavigate();
	const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
	const [openOptionMenu, setOpenOptionMenu] = useState<number | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [reviewList, setReviewList] = useState<IReviewListResponse | null>(null);
	const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
	const teamId = 1;
	const { teamRestaurantId } = useParams<{ teamRestaurantId: string }>();

	const getRestaurantReviewInfo = async () => {
		try {
			const response = await get<IReviewListResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews?currentPage=1&size=10`);
			setReviewList(response as IReviewListResponse);
		} catch (error) {
			console.error('리뷰 정보를 불러오는데 실패했습니다:', error);
		}
	};

	useEffect(() => {
		getRestaurantReviewInfo();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (openOptionMenu !== null) {
				const target = event.target as Element;
				if (!target.closest('.option-menu-container')) {
					setOpenOptionMenu(null);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openOptionMenu]);

	const ownReview = true;

	const handleOptionClick = (index: number) => {
		setOpenOptionMenu(openOptionMenu === index ? null : index);
	};

	const handleEdit = (review: any) => {
		setOpenOptionMenu(null);
		navigate(`/review-edit/${review.id}`, {
			state: {
				teamId: teamId,
				teamRestaurantId: teamRestaurantId,
				name: restaurantName,
				waitingTime: review.waitingTime,
				foodPrepTime: review.servingTime,
				score: review.score,
				extraText: review.extraText,
				photoUrls: review.photoUrls,
				isEdit: true,
			},
		});
	};

	const deleteReview = async (reviewId: number) => {
		try {
			await del(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews/${reviewId}`);
			getRestaurantReviewInfo();
			toast(<CustomToast title="리뷰가 삭제되었습니다." icon="check" />);
		} catch (error) {
			console.error('리뷰를 삭제하는데 실패했습니다:', error);
			toast(<CustomToast title="리뷰 삭제에 실패했습니다." icon="invalidInput" />);
		}
	};

	const handleDelete = (reviewId: number) => {
		setOpenOptionMenu(null);
		setSelectedReviewId(reviewId);
		setIsOpen(true);
	};

	const handleConfirmDelete = () => {
		if (selectedReviewId) {
			deleteReview(selectedReviewId);
			setIsOpen(false);
			setSelectedReviewId(null);
		}
	};

	const handleCancelDelete = () => {
		setIsOpen(false);
		setSelectedReviewId(null);
	};

	return (
		<div>
			<div className="flex items-center gap-1.5 mb-5">
				<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold">
					리뷰
				</Typography>
				<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray08}>
					{reviewList?.totalCount}개
				</Typography>
			</div>

			<>
				{/* 리뷰 아이템 */}
				{reviewList?.data.map((review, index) => {
					const isExpanded = expandedReviews.has(index);
					const shouldShowMore = review.extraText.length > 50;
					const isOptionOpen = openOptionMenu === index;

					return (
						<div className="mb-6" key={review.id}>
							<div className="flex justify-between">
								<div className="flex items-center gap-2.5 mb-2.5">
									<img src={review.userProfileImageUrl} alt="profile" className="w-10 h-10 rounded-full" />
									<div className="flex flex-col gap-0.5">
										<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-medium">
											{review.userNickname}
										</Typography>
										<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
											{review.createdDate}
										</Typography>
									</div>
								</div>
								{ownReview && (
									<div className="relative option-menu-container">
										<Icon name="selectOption" size={24} onClick={() => handleOptionClick(index)} className="cursor-pointer" />
										{isOptionOpen && (
											<div className="absolute right-0 top-2 bg-white border border-gray-03 rounded-[8px] shadow-[0px_0px_14px_0px_rgba(102,102,102,0.20)] z-10 w-30">
												<button
													onClick={() => handleEdit(review)}
													className="w-full px-3.75 py-2.5 text-left hover:bg-gray-01 transition-colors border-b border-gray-02"
												>
													<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
														수정하기
													</Typography>
												</button>
												<button onClick={() => handleDelete(review.id)} className="w-full px-3.75 py-2.5 text-left hover:bg-gray-01 transition-colors">
													<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10}>
														삭제하기
													</Typography>
												</button>
											</div>
										)}
									</div>
								)}
							</div>

							{/* 별점 및 정보 */}
							<div className="flex items-center mb-3">
								<div className="flex items-center mr-1.5">
									<img src={starIcon} alt="star" className="w-3.75 h-3.75 mr-1" />
									<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
										{review.score}.0
									</Typography>
								</div>
								<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07} className="font-normal mr-1.5">
									/
								</Typography>
								<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08} className="font-normal mr-0.5">
									입장 대기
								</Typography>
								<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray09} className="font-medium">
									{review.waitingTime}
								</Typography>
								<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07} className="font-normal mx-1.5">
									/
								</Typography>
								<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray08} className="font-normal mr-0.5">
									음식 준비시간
								</Typography>
								<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray09} className="font-medium">
									{review.servingTime}
								</Typography>
							</div>

							{/* 이미지들 - 가로 스크롤 */}
							{review.photoUrls.length > 0 && (
								<div className="flex mb-3.25 overflow-x-auto scrollbar-hide">
									<div className="flex gap-2 flex-nowrap">
										{review.photoUrls.map((_, imageIndex) => (
											<img key={imageIndex} src={review.photoUrls[imageIndex]} className="w-[130px] h-[130px] bg-gray-03 rounded-[6px] flex-shrink-0" />
										))}
									</div>
								</div>
							)}

							{/* 리뷰 텍스트 */}
							<div className="mb-2">
								<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
									{isExpanded || !shouldShowMore ? review.extraText : `${review.extraText.substring(0, 25)}...`}
								</Typography>
							</div>

							{/* 더보기 버튼 */}
							{shouldShowMore && (
								<div className="flex justify-end">
									<button
										onClick={() => {
											const newExpanded = new Set(expandedReviews);
											if (isExpanded) {
												newExpanded.delete(index);
											} else {
												newExpanded.add(index);
											}
											setExpandedReviews(newExpanded);
										}}
										className="flex items-center gap-1.5"
									>
										<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
											{isExpanded ? '접기' : '더보기'}
										</Typography>
										<Icon name={isExpanded ? 'categorySelectClose' : 'selectOpen'} size={10} />
									</button>
								</div>
							)}
						</div>
					);
				})}
			</>

			{/* 삭제 확인 모달 */}
			<CustomDialog
				headerText={{
					title: '리뷰 삭제하기',
					description: (
						<>
							리뷰 삭제 시 복구가 불가능하며
							<br />
							팀원들에게도 보이지 않아요.
						</>
					),
				}}
				onOpen={isOpen}
				onOpenChange={setIsOpen}
				className="w-[271px]"
			>
				<img src={reviewDelete} alt="리뷰 삭제 완료" className="w-[133px] h-[128px] absolute bottom-44 left-18" />
				<div className="flex gap-2 mt-[24px]">
					<button onClick={handleCancelDelete} className="rounded-[20px] border border-gray-03 bg-white w-[89px] px-5">
						취소
					</button>
					<Button variant="active" onClick={handleConfirmDelete}>
						삭제하기
					</Button>
				</div>
			</CustomDialog>
		</div>
	);
};

export default ReviewInfo;
