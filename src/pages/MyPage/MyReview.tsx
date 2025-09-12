import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useMutationDeleteReview } from '@/apis/useMutationDeleteReview';
import { useQueryMyReviews } from '@/apis/useQueryMyReviews';
import noGallery from '@/assets/noGallery.png';
import reviewDelete from '@/assets/reviewDelete.png';
import starIcon from '@/assets/star.png';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Pagination from '@/components/Pagination/Pagination';
import { CustomToast } from '@/components/Toast/BaseToaster';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MyReview = () => {
	const navigate = useNavigate();
	const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
	const [openOptionMenu, setOpenOptionMenu] = useState<number | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const userId = localStorage.getItem('userId') ?? '';
	const teamId = localStorage.getItem('teamId') ?? '';

	const { data: myReviews, isLoading: isLoadingReviews } = useQueryMyReviews(5, currentPage);
	const { mutate: deleteReview } = useMutationDeleteReview(teamId);

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

	const handleOptionClick = (index: number) => {
		setOpenOptionMenu(openOptionMenu === index ? null : index);
	};

	const handleEdit = (review: any) => {
		setOpenOptionMenu(null);
		navigate(`/review-edit/${review.id}`, {
			state: {
				teamId: teamId,
				teamRestaurantId: review.teamRestaurantId,
				name: review.teamRestaurantName,
				waitingTime: review.waitingTime,
				foodPrepTime: review.servingTime,
				score: review.score,
				extraText: review.extraText,
				photoUrls: review.photoUrls,
				isEdit: true,
			},
		});
	};

	const handleDeleteReview = (reviewId: number, teamRestaurantId: number) => {
		deleteReview(
			{
				reviewId: reviewId.toString(),
				teamRestaurantId: teamRestaurantId.toString(),
			},
			{
				onSuccess: () => {
					toast(<CustomToast title="리뷰가 삭제되었습니다." icon="check" />);
				},
				onError: (error) => {
					console.error('리뷰를 삭제하는데 실패했습니다:', error);
					toast(<CustomToast title="리뷰 삭제에 실패했습니다." icon="invalidInput" />);
				},
			}
		);
	};

	const handleDelete = (reviewId: number) => {
		setOpenOptionMenu(null);
		setSelectedReviewId(reviewId);
		setIsOpen(true);
	};

	const handleConfirmDelete = () => {
		if (selectedReviewId && myReviews?.data) {
			const selectedReview = myReviews.data.find((review: any) => review.id === selectedReviewId);
			if (selectedReview) {
				handleDeleteReview(selectedReviewId, Number(selectedReview.teamRestaurantId));
				setIsOpen(false);
				setSelectedReviewId(null);
			}
		}
	};

	const handleCancelDelete = () => {
		setIsOpen(false);
		setSelectedReviewId(null);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setExpandedReviews(new Set());
	};

	// 로딩 상태 처리
	if (isLoadingReviews) {
		return (
			<div>
				<NavBar variant="iconWithText" leftText="내가 쓴 리뷰" leftIcon="back" onLeftIconClick={() => navigate(-1)} />
				<div className="flex items-center justify-center py-10">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
						리뷰를 불러오는 중...
					</Typography>
				</div>
			</div>
		);
	}

	// 데이터가 없을 때 처리
	if (!myReviews || myReviews.data.length === 0) {
		return (
			<div className="bg-gray-02 min-h-screen pb-5">
				<NavBar variant="iconWithText" leftText="내가 쓴 리뷰" leftIcon="back" onLeftIconClick={() => navigate(-1)} />
				<div className="py-6.25 px-4.5 bg-gray-02">
					<div className="flex gap-1.5">
						<Typography fontColor={PALETTE.gray10} variant={FONT_VARIANT.body01} className="font-semibold">
							팀 맛집에 작성한 리뷰
						</Typography>
						<Typography fontColor={PALETTE.gray08} variant={FONT_VARIANT.body01} className="font-medium">
							{myReviews?.totalCount || 0}
						</Typography>
					</div>
					<div className="flex flex-col items-center justify-center py-10">
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="text-center">
							작성한 리뷰가 없어요.
							<br />
							첫번째 리뷰를 남겨주세요!
						</Typography>
						<img src={noGallery} alt="noGallery" className="w-[215px] h-[128px]" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-02 min-h-screen pb-5">
			<NavBar variant="iconWithText" leftText="내가 쓴 리뷰" leftIcon="back" onLeftIconClick={() => navigate(-1)} />

			<div className="py-6.25 px-4.5 bg-gray-02">
				<div className="flex gap-1.5">
					<Typography fontColor={PALETTE.gray10} variant={FONT_VARIANT.body01} className="font-semibold">
						팀 맛집에 작성한 리뷰
					</Typography>
					<Typography fontColor={PALETTE.gray08} variant={FONT_VARIANT.body01} className="font-medium">
						{myReviews.totalCount}
					</Typography>
				</div>

				<div className="mt-6">
					<>
						{/* 리뷰 아이템 */}
						{myReviews?.data.map((review, index) => {
							const isExpanded = expandedReviews.has(index);
							const shouldShowMore = review.extraText.length > 50;
							const isOptionOpen = openOptionMenu === index;

							return (
								<div className="mb-6 rounded-[20px] bg-white px-4.5 py-6.5" key={review.id}>
									<div className="flex justify-between">
										<div className="flex items-center gap-2.5 mb-2.5">
											<div className="flex gap-1.5 items-center">
												<Typography
													variant={FONT_VARIANT.header04}
													fontColor={PALETTE.gray10}
													className="font-semibold max-width-[170px] overflow-hidden text-ellipsis whitespace-nowrap"
												>
													{review.teamRestaurantName}
												</Typography>

												<Typography variant={FONT_VARIANT.caption01} fontColor={PALETTE.gray07}>
													{review.createdDate}
												</Typography>
											</div>
										</div>
										{String(review.userId) === userId && (
											<div className="relative option-menu-container">
												{review.isDeletedTeamRestaurantReview === true && (
													<Icon name="selectOption" size={24} onClick={() => handleOptionClick(index)} className="cursor-pointer" />
												)}

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

					{/* 페이지네이션 */}
					{myReviews.totalCount > 5 && (
						<div className="mt-8">
							<Pagination currentPage={currentPage} totalCount={myReviews.totalCount} size={5} onPageChange={handlePageChange} variant="default" />
						</div>
					)}
				</div>
			</div>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={handleCancelDelete} />

					<div className="relative bg-white rounded-[20px] w-[271px] p-6 shadow-lg">
						<div className="text-center mb-1.75">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								내 리뷰 삭제하기
							</Typography>
						</div>

						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								이 리뷰를 삭제하면 식당에
								<br />
								등록된 리뷰도 함께 삭제돼요.
							</Typography>
						</div>

						<img src={reviewDelete} alt="리뷰 삭제 완료" className="w-[133px] h-[128px] absolute bottom-44 left-18" />

						<div className="flex gap-2 max-w-[283px]">
							<button onClick={handleCancelDelete} className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px]">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleConfirmDelete} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px]">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									삭제하기
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyReview;
