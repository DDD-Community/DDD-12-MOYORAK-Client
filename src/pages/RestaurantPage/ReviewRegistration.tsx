import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutationAddReview } from '@/apis/useMutationAddReview';
import emptyStarIcon from '@/assets/emptyStar.png';
import reviewRegistration from '@/assets/reviewRegistration.png';
import starIcon from '@/assets/star.png';
import Button from '@/components/Button/Button';
import CustomDialog from '@/components/Dialog/CustomDialog';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import FormLabel from '@/components/Input/FormLabel';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography/Typography';
import { FOOD_PREP_TIME_OPTIONS, SATISFACTION_OPTIONS, WAITING_TIME_OPTIONS } from '@/constants/data.constant';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { uploadMultipleImages, validateImageFiles } from '@/utils/imageUpload';

const ReviewRegistration = () => {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();
	const [waitingTime, setWaitingTime] = useState('');
	const [foodPrepTime, setFoodPrepTime] = useState('');
	const [satisfaction, setSatisfaction] = useState(0);
	const [review, setReview] = useState('');
	const [images, setImages] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const teamId = location.state?.teamId;
	const teamRestaurantId = location.state?.teamRestaurantId;
	const name = location.state?.name;
	const userId = localStorage.getItem('userId') ?? '';

	// TanStack Query mutation hook 사용
	const addReviewMutation = useMutationAddReview(teamId, teamRestaurantId);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const fileArr = Array.from(e.target.files).slice(0, 5 - images.length);
		if (fileArr.length === 0) return;

		const validFiles = validateImageFiles(fileArr);
		if (validFiles.length === 0) return;

		try {
			const { successUrls, uploadedFiles } = await uploadMultipleImages(validFiles, 5, setIsUploading);

			setImages((prev) => [...prev, ...uploadedFiles].slice(0, 5));
			setImageUrls((prev) => [...prev, ...successUrls].slice(0, 5));
		} catch (error) {
			alert('이미지 업로드에 실패했습니다.');
			console.error('이미지 업로드 에러:', error);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
		setImageUrls((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		postReview();
	};

	const postReview = async () => {
		try {
			await addReviewMutation.mutateAsync({
				userId: Number(userId),
				servingTimeId: Number(foodPrepTime),
				waitingTimeId: Number(waitingTime),
				score: satisfaction,
				photoPaths: imageUrls,
				extraText: review,
			});
			setIsOpen(true);
		} catch (error) {
			console.error('리뷰 등록에 실패했습니다:', error);
			alert('리뷰 등록 실패');
		}
	};

	const isButtonActive = waitingTime.length > 0 && foodPrepTime.length > 0 && satisfaction > 0 && review.length > 0 && images.length > 0 && !isUploading;

	return (
		<>
			<NavBar
				variant="iconWithText"
				leftText={name}
				onLeftIconClick={() => {
					navigate(-1);
				}}
			/>
			<div className="bg-gray-02 min-h-screen ">
				<form className="p-4.5 flex flex-col gap-6 " onSubmit={handleSubmit}>
					<div className="py-6 px-4 rounded-[20px] bg-white flex flex-col gap-8.75">
						<div className="flex flex-col gap-3.75">
							<FormLabel label="웨이팅이 있었나요?" isEssential id="waiting" className="font-semibold" />
							<div className="flex gap-2 flex-wrap">
								{WAITING_TIME_OPTIONS.map((option) => (
									<FilterButton
										key={option.value}
										variant={waitingTime === option.value ? 'clicked' : 'general'}
										borderRadius="17"
										onClick={() => setWaitingTime(option.value)}
										type="button"
									>
										{option.label}
									</FilterButton>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-3.75">
							<FormLabel label="음식 준비 시간은 얼마나 걸렸나요?" isEssential id="waiting" className="font-semibold" />
							<div className="flex gap-2 flex-wrap">
								{FOOD_PREP_TIME_OPTIONS.map((option) => (
									<FilterButton
										key={option.value}
										variant={foodPrepTime === option.value ? 'clicked' : 'general'}
										borderRadius="17"
										onClick={() => setFoodPrepTime(option.value)}
										type="button"
									>
										{option.label}
									</FilterButton>
								))}
							</div>
						</div>
					</div>

					<div className="py-6 px-4 rounded-[20px] bg-white flex flex-col gap-8.75">
						<div className="flex flex-col gap-2.5">
							<FormLabel label="만족도를 알려주세요!" isEssential id="satisfaction" className="font-semibold" />
							<div className="flex items-center">
								<div className="flex gap-0.25 items-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<button key={star} type="button" onClick={() => setSatisfaction(star)} aria-label={`${star}점`}>
											{satisfaction >= star ? <img src={starIcon} alt="filled star" /> : <img src={emptyStarIcon} alt="empty star" />}
										</button>
									))}
								</div>
								<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray09} className="ml-1.5 mr-1 font-medium">
									{satisfaction}점
								</Typography>
								<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray08} className="font-medium">
									{SATISFACTION_OPTIONS.find((option) => option.value === satisfaction.toString())?.label}
								</Typography>
							</div>
						</div>

						<div className="flex flex-col gap-3.75 relative">
							<FormLabel label="자세한 리뷰를 남겨주세요" isEssential id="satisfaction" className="font-semibold" />
							<div className="flex gap-2 flex-wrap">
								<label
									className={`w-[80px] h-[80px] flex flex-col items-center justify-center border border-gray-05 rounded-[12px] bg-white cursor-pointer relative ${
										images.length >= 5 || isUploading ? 'opacity-50 pointer-events-none' : ''
									}`}
								>
									<input
										type="file"
										accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/heic,image/heif,.heic,.heif"
										multiple
										hidden
										disabled={images.length >= 5 || isUploading}
										onChange={handleImageChange}
									/>
									{isUploading ? (
										<div className="flex flex-col items-center">
											<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
											<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07} className="mt-1">
												업로드중...
											</Typography>
										</div>
									) : (
										<>
											<Icon name="camera" size={24} />
											<div className="flex items-center">
												<Typography variant={FONT_VARIANT.label01} fontColor={images.length > 0 ? PALETTE.gray10 : PALETTE.gray07}>
													{images.length}
												</Typography>
												<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
													/5
												</Typography>
											</div>
										</>
									)}
								</label>

								{images.map((img, idx) => (
									<div
										key={idx}
										className="border border-gray-05 w-[80px] h-[80px] rounded-[12px] relative flex-shrink-0 overflow-hidden flex items-center justify-center"
									>
										<img src={URL.createObjectURL(img)} alt={`업로드 이미지 ${idx + 1}`} className="object-cover w-full h-full rounded-[12px]" />
										<button
											type="button"
											className="absolute top-1 right-1 w-5.5 h-5.5 bg-[#666] bg-opacity-80 rounded-full flex items-center justify-center text-white"
											onClick={() => removeImage(idx)}
											aria-label="이미지 삭제"
										>
											<Icon name="close" size={16} />
										</button>
									</div>
								))}
							</div>
							<textarea
								className="w-full h-[137px] border border-gray-04 rounded-[12px] p-[15px] placeholder:text-gray-06 text-[16px]"
								placeholder="소중한 경험을 남겨주세요! 남겨주신 리뷰는 팀원에게 도움이 됩니다."
								maxLength={200}
								value={review}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReview(e.target.value)}
							/>
							<div className="absolute right-4 bottom-3.75">
								<Typography as="span" variant={FONT_VARIANT.label01} fontColor={review.length > 0 ? PALETTE.gray10 : PALETTE.gray07}>
									{review.length}
								</Typography>
								<Typography as="span" variant={FONT_VARIANT.label01} fontColor={PALETTE.gray07}>
									/200
								</Typography>
							</div>
						</div>
					</div>

					<Button variant={isButtonActive ? 'active' : 'disabled'} disabled={!isButtonActive || addReviewMutation.isPending}>
						{addReviewMutation.isPending ? '등록 중...' : isUploading ? '이미지 업로드 중...' : '등록하기'}
					</Button>
				</form>

				{isEdit ? (
					<CustomDialog headerText={{ title: '리뷰 수정이 완료되었어요' }} onOpen={isOpen} onOpenChange={setIsOpen} className="w-[271px]">
						<Button variant="active" onClick={() => navigate(`/restaurant-detail/${teamRestaurantId}`)} className="mt-[24px]">
							확인
						</Button>
					</CustomDialog>
				) : (
					<CustomDialog
						headerText={{
							title: '리뷰 등록이 완료되었어요',
							description: '작성하신 리뷰는 언제든지 식당페이지에서 수정 가능해요!',
						}}
						onOpen={isOpen}
						onOpenChange={setIsOpen}
						className="w-[271px]"
					>
						<img src={reviewRegistration} alt="리뷰 등록 완료" className="w-[175px] h-[102px] absolute bottom-44 left-11" />
						<Button variant="active" onClick={() => navigate(`/restaurant-detail/${teamRestaurantId}`)} className="mt-[24px]">
							확인
						</Button>
					</CustomDialog>
				)}
			</div>
		</>
	);
};

export default ReviewRegistration;
