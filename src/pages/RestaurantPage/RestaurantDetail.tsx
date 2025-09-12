import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useMutationDeleteTeamRestaurant } from '@/apis/useMutationDeleteTeamRestaurant';
import { useMutationUpdateTeamRestaurant } from '@/apis/useMutationUpdateTeamRestaurant';
import { useQueryRestaurantDetail, useQueryRestaurantPhotos } from '@/apis/useQueryRestaurantDetail';
import noGallery from '@/assets/noGallery.png';
import reviewDelete from '@/assets/reviewDelete.png';
import starIcon from '@/assets/star.png';
import Icon from '@/components/Icon';
import ReviewInfo from '@/components/ReviewInfo/ReviewInfo';
import { CustomToast } from '@/components/Toast/BaseToaster';
import Typography from '@/components/Typography/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useCategoryMapping } from '@/hooks/useCategoryMapping';

const RestaurantDetail = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<'reviews' | 'photos'>('reviews');
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [lastToastTime, setLastToastTime] = useState(0);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [editedDescription, setEditedDescription] = useState('');

	const teamId = localStorage.getItem('teamId') ?? '';
	const { teamRestaurantId } = useParams<{ teamRestaurantId: string }>();

	// TanStack Query 훅 사용
	const { data: restaurantInfo, isLoading: isLoadingRestaurant } = useQueryRestaurantDetail(teamId.toString(), teamRestaurantId || '');
	const { data: reviewPhotos, isLoading: isLoadingPhotos } = useQueryRestaurantPhotos(teamId.toString(), teamRestaurantId || '');
	const { mutate: deleteTeamRestaurant, isPending } = useMutationDeleteTeamRestaurant(teamId);
	const { mutate: updateTeamRestaurant, isPending: isUpdating } = useMutationUpdateTeamRestaurant(teamId, teamRestaurantId || '');

	const imageUrl = restaurantInfo?.photoPath;
	const allImages = reviewPhotos?.data?.map((photo) => photo.path) || [];

	const { getCategoryDisplay } = useCategoryMapping();

	const handleReviewWrite = () => {
		navigate('/review-registration', {
			state: {
				teamId,
				teamRestaurantId,
				name: restaurantInfo?.name,
			},
		});
	};

	const openGallery = (imageIndex: number) => {
		setCurrentImageIndex(imageIndex);
		setIsGalleryOpen(true);
	};

	const closeGallery = () => {
		setIsGalleryOpen(false);
	};

	const goToPrevImage = () => {
		setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
	};

	const goToNextImage = () => {
		setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
	};

	const handleShare = () => {
		const currentTime = Date.now();

		if (currentTime - lastToastTime < 5000) {
			return;
		}

		navigator.clipboard.writeText(window.location.href);
		toast(<CustomToast title="식당 정보 링크가 복사되었습니다." icon="copy" />);
		setLastToastTime(currentTime);
	};

	const handleDelete = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (teamRestaurantId) {
			deleteTeamRestaurant(teamRestaurantId.toString(), {
				onSuccess: () => {
					toast(<CustomToast title="식당 삭제가 완료되었어요." icon="check" />);
					setIsDeleteDialogOpen(false);
					navigate('/');
				},
				onError: (error) => {
					console.error('팀 식당 삭제 실패:', error);
					toast(<CustomToast title="식당 삭제에 실패했습니다." icon="invalidInput" />);
					setIsDeleteDialogOpen(false);
				},
			});
		}
	};

	const handleCancelDelete = () => {
		setIsDeleteDialogOpen(false);
	};

	const handleEditDescription = () => {
		setEditedDescription(restaurantInfo?.summary || '');
		setIsEditingDescription(true);
	};

	const handleSaveDescription = () => {
		if (!editedDescription.trim()) {
			toast(<CustomToast title="설명을 입력해주세요." icon="invalidInput" />);
			return;
		}

		updateTeamRestaurant(
			{ summary: editedDescription.trim() },
			{
				onSuccess: () => {
					setIsEditingDescription(false);
					toast(<CustomToast title="식당 설명이 수정되었습니다." icon="check" />);
				},
				onError: (error) => {
					console.error('식당 설명 수정 실패:', error);
					toast(<CustomToast title="설명 수정에 실패했습니다. 한줄 소개는 20자 미만입니다." icon="invalidInput" />);
				},
			}
		);
	};

	const handleCancelEdit = () => {
		setEditedDescription('');
		setIsEditingDescription(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSaveDescription();
		} else if (e.key === 'Escape') {
			handleCancelEdit();
		}
	};

	if (!teamRestaurantId) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					잘못된 접근입니다.
				</Typography>
			</div>
		);
	}

	// 로딩 상태 처리
	if (isLoadingRestaurant || isLoadingPhotos) {
		return (
			<div className="bg-gray-02 min-h-screen flex items-center justify-center">
				<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
					로딩 중...
				</Typography>
			</div>
		);
	}

	return (
		<>
			{isGalleryOpen ? (
				<div className="fixed inset-0 z-50 flex flex-col max-w-[480px] mx-auto">
					{/* 헤더 */}
					<div className="bg-gray-10 h-55">
						<div className="flex items-center gap-5 px-5 py-4">
							<button onClick={closeGallery}>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M6.22398 6.22398C6.52261 5.92534 7.0068 5.92534 7.30543 6.22398L12.5 11.4185L17.6946 6.22398C17.9932 5.92534 18.4774 5.92534 18.776 6.22398C19.0747 6.52261 19.0747 7.0068 18.776 7.30543L13.5815 12.5L18.776 17.6946C19.0747 17.9932 19.0747 18.4774 18.776 18.776C18.4774 19.0747 17.9932 19.0747 17.6946 18.776L12.5 13.5815L7.30543 18.776C7.0068 19.0747 6.52261 19.0747 6.22398 18.776C5.92534 18.4774 5.92534 17.9932 6.22398 17.6946L11.4185 12.5L6.22398 7.30543C5.92534 7.0068 5.92534 6.52261 6.22398 6.22398Z"
										fill="white"
									/>
								</svg>
							</button>
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.white} className="font-semibold">
								사진 보기
							</Typography>
						</div>
					</div>

					<div className="flex-1 flex items-center justify-center relative">
						<div className="w-full h-full bg-gray-03" />

						<img src={allImages[currentImageIndex]} alt="galleryImage" className="w-full h-full" />

						<button
							onClick={goToPrevImage}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
						>
							<Icon name="selectArrow" size={20} color="white" />
						</button>

						<button
							onClick={goToNextImage}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
						>
							<Icon name="selectArrow" size={20} color="white" className="rotate-180" />
						</button>
					</div>

					<div className="bg-gray-10 h-55 flex items-center justify-center">
						<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.white} className="text-center">
							{currentImageIndex + 1} / {allImages.length}
						</Typography>
					</div>
				</div>
			) : (
				<div className="bg-gray-02 min-h-screen">
					<div className="relative">
						<div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-10/80 to-transparent ">
							<div className="flex justify-between">
								<nav className="flex items-center gap-5 h-15 px-5">
									<Icon name="restaurantBack" size={24} onClick={() => navigate('/')} />
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.white} className="font-semibold">
										{restaurantInfo?.name}
									</Typography>
								</nav>
								<div className="flex items-center gap-5 h-15 px-5" onClick={handleDelete}>
									<Icon name="deleteIcon" size={24} />
								</div>
							</div>
						</div>
						{imageUrl ? (
							<img src={imageUrl} alt="restaurantTest" className="w-full h-[300px] object-fill" />
						) : (
							<div className="w-full h-[280px] bg-gray-03 flex flex-col items-center justify-center">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
									등록된 사진이 아직 없어요..
								</Typography>
								<img src="/src/assets/noImage.png" alt="noImage" className="w-[157px] h-[109px] absolute top-46" />
								<img src="/src/assets/noImagePlus.png" alt="noImagePlus" className="absolute top-63 left-27 w-35 h-7.5 z-999" />
							</div>
						)}

						<button
							className="absolute bottom-6 right-4 w-[50px] h-[50px] bg-white/80 rounded-[30px] backdrop-blur-sm flex items-center justify-center"
							onClick={handleShare}
						>
							<Icon name="share" size={24} />
						</button>
					</div>

					<div className="bg-white mt-[-10px] relative z-10 rounded-t-[20px] pb-6">
						<div className="px-4.5 pt-6.5">
							{/* 식당 정보 */}
							<div className="mb-[3px] flex gap-2 items-center justify-center">
								<Typography variant={FONT_VARIANT.header01} fontColor={PALETTE.gray10} className="font-semibold">
									{restaurantInfo?.name}
								</Typography>
								<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
									{getCategoryDisplay(restaurantInfo?.restaurantCategory || '')}
								</Typography>
							</div>

							{/* 설명 */}
							<div className="mb-2 text-center">
								{isEditingDescription ? (
									<div className="flex items-center gap-2 justify-center">
										<input
											type="text"
											value={editedDescription}
											onChange={(e) => setEditedDescription(e.target.value)}
											onKeyDown={handleKeyPress}
											placeholder="식당을 한줄로 설명해주세요"
											disabled={isUpdating}
											className="wflex-1 px-3 py-2 border border-gray-03 rounded-[8px] text-center focus:outline-none focus:border-primary-200 disabled:opacity-50"
											autoFocus
										/>
										<button
											onClick={handleSaveDescription}
											disabled={isUpdating}
											className="px-3 py-2 bg-primary-200 text-[#1F2511] rounded-[8px] text-sm font-semibold disabled:opacity-50"
										>
											{isUpdating ? '저장 중...' : '저장'}
										</button>
									</div>
								) : (
									<div className="flex items-center justify-center">
										<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
											{restaurantInfo?.summary || '식당을 한줄로 설명해주세요'}
										</Typography>
										<Icon name="edit" size={14} onClick={handleEditDescription} />
									</div>
								)}
							</div>

							{/* 별점 */}
							<div className="flex items-center mb-6 justify-center">
								<div className="flex items-center mr-1">
									<img src={starIcon} alt="star" className="w-3.5 h-3.5" />
								</div>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
									{restaurantInfo?.score}
								</Typography>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="mx-1.25">
									·
								</Typography>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08}>
									리뷰 {restaurantInfo?.reviewCount}
								</Typography>
							</div>

							{/* 정보 아이콘들 */}
							<div className="flex flex-col rounded-[20px] border border-gray-03 bg-gray-01 px-4.5 py-6.5 mb-3.75">
								<div className="flex">
									<div className="flex flex-col items-center flex-1">
										<Icon name="persons" size={24} className="mb-2" />
										<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
											입장 대기시간
										</Typography>
										<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
											{restaurantInfo?.waitingTime}
										</Typography>
									</div>
									<div className="flex flex-col items-center flex-1">
										<Icon name="prepareHour" size={24} className="mb-2" />
										<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
											음식 준비시간
										</Typography>
										<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
											{restaurantInfo?.servingTime}
										</Typography>
									</div>
									<div className="flex flex-col items-center flex-1" onClick={() => window.open(restaurantInfo?.placeUrl, '_blank')}>
										<Icon name="link" size={24} className="mb-2" />
										<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray08} className="mb-1">
											외부링크
										</Typography>
										<Typography variant={FONT_VARIANT.header04} fontColor={PALETTE.gray09} className="font-semibold">
											Click!
										</Typography>
									</div>
								</div>
								<button
									className="w-full rounded-[20px] bg-[#1F2511] h-[46px] text-[#BEEE05] mt-5.5 text-body02 font-semibold leading-[24px]"
									onClick={handleReviewWrite}
								>
									리뷰쓰기
								</button>
							</div>

							{/* 탭 */}
							<div className="flex border-b border-gray-04 mb-7.5 ml-[-18px] mr-[-18px]">
								<button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 ${activeTab === 'reviews' ? 'border-b-2 border-gray-10' : ''}`}>
									<Typography
										variant={FONT_VARIANT.body01}
										fontColor={activeTab === 'reviews' ? PALETTE.gray10 : PALETTE.gray07}
										className={activeTab === 'reviews' ? 'font-semibold' : 'font-normal'}
									>
										팀원들의 리뷰
									</Typography>
								</button>
								<button onClick={() => setActiveTab('photos')} className={`flex-1 py-3 ${activeTab === 'photos' ? 'border-b-2 border-gray-10' : ''}`}>
									<Typography
										variant={FONT_VARIANT.body01}
										fontColor={activeTab === 'photos' ? PALETTE.gray10 : PALETTE.gray07}
										className={activeTab === 'photos' ? 'font-semibold' : 'font-normal'}
									>
										팀원들의 사진
									</Typography>
								</button>
							</div>

							{/* 리뷰 섹션 */}
							{activeTab === 'reviews' && <ReviewInfo restaurantName={restaurantInfo?.name || ''} />}

							{/* 사진 섹션 */}
							{activeTab === 'photos' && (
								<div>
									{(() => {
										const reviewsWithPhotos = reviewPhotos?.data?.filter((photo) => photo.path.length > 0) || [];
										const totalPhotos = reviewsWithPhotos.length;

										return (
											<>
												<div className="flex items-center gap-1.5 mb-5">
													<Typography variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="font-semibold">
														사진
													</Typography>
													<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray08}>
														{totalPhotos}개
													</Typography>
												</div>

												{reviewPhotos?.data && reviewPhotos.data.length > 0 ? (
													<div className="grid grid-cols-2 gap-1.75">
														{reviewPhotos.data.map((photo, index) => (
															<div
																key={`photo-${index}`}
																className="aspect-square bg-gray-03 rounded-[6px] cursor-pointer overflow-hidden"
																onClick={() => openGallery(index)}
															>
																<img src={photo.path} alt={`리뷰 사진 ${index + 1}`} className="w-full h-full object-cover" />
															</div>
														))}
													</div>
												) : (
													<div className="flex flex-col items-center justify-center mt-12">
														<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="text-center mb-3.25">
															등록된 사진이 없어요
															<br />
															첫번째 사진을 남겨주세요!
														</Typography>
														<img src={noGallery} alt="noGallery" className="w-[215px] h-[128px]" />
													</div>
												)}
											</>
										);
									})()}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* 식당 삭제 모달 */}
			{isDeleteDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={handleCancelDelete} />

					<div className="relative bg-white rounded-[20px] w-[271px] p-6 shadow-lg">
						<div className="text-center mb-1.75">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								우리팀 식당 삭제하기
							</Typography>
						</div>

						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								식당 삭제를 하시면 우리 팀에 등록된
								<br />
								모든 정보가 영구적으로 삭제돼요.
							</Typography>
						</div>

						<img src={reviewDelete} alt="식당 삭제 완료" className="w-[133px] h-[128px] absolute bottom-44 left-18" />

						<div className="flex gap-2 max-w-[283px]">
							<button
								onClick={handleCancelDelete}
								disabled={isPending}
								className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px] disabled:opacity-50"
							>
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleConfirmDelete} disabled={isPending} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px] disabled:opacity-50">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									{isPending ? '삭제 중...' : '삭제하기'}
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default RestaurantDetail;
