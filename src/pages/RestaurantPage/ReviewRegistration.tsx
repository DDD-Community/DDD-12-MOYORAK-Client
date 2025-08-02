import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { post } from '@/apis';
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

interface IReviewRegistrationRequest {
	userId: number;
	servingTimeId: number;
	waitingTimeId: number;
	score: number;
	photoPaths: string[];
	extraText: string;
}

interface IImageUploadResponse {
	url: string;
	path: string;
}

const ReviewRegistration = () => {
	const { id } = useParams();
	const isEdit = !!id;
	const navigate = useNavigate();
	const [waitingTime, setWaitingTime] = useState('');
	const [foodPrepTime, setFoodPrepTime] = useState('');
	const [satisfaction, setSatisfaction] = useState(0);
	const [review, setReview] = useState('');
	const [images, setImages] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]); // 업로드된 이미지 URL들
	const [isUploading, setIsUploading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const teamId = location.state?.teamId;
	const teamRestaurantId = location.state?.teamRestaurantId;
	const name = location.state?.name;

	console.log(teamId, teamRestaurantId, name);

	// 파일 확장자 추출 함수
	const getFileExtension = (file: File): string => {
		// 파일명에서 확장자 추출
		const fileName = file.name;
		const lastDotIndex = fileName.lastIndexOf('.');
		let extension = '';

		if (lastDotIndex !== -1) {
			extension = fileName.substring(lastDotIndex + 1).toLowerCase();
		}

		// HEIC/HEIF 같은 모바일 포맷은 JPG로 변환
		if (extension === 'heic' || extension === 'heif') {
			console.log(`${extension} 포맷을 JPG로 변환합니다.`);
			return 'jpg';
		}

		// MIME 타입에서 확장자 추출
		const mimeType = file.type;
		switch (mimeType) {
			case 'image/jpeg':
				return 'jpg';
			case 'image/png':
				return 'png';
			case 'image/gif':
				return 'gif';
			case 'image/webp':
				return 'webp';
			case 'image/svg+xml':
				return 'svg';
			case 'image/bmp':
				return 'bmp';
			case 'image/heic':
			case 'image/heif':
				console.log('HEIC/HEIF MIME 타입을 JPG로 변환합니다.');
				return 'jpg';
			default:
				return 'jpg';
		}
	};

	// 단일 이미지 업로드 함수
	const uploadSingleImage = async (file: File): Promise<string> => {
		const extension = getFileExtension(file);

		try {
			console.log('업로드 요청:', { extension, fileName: file.name });

			const response = await post<IImageUploadResponse>('/images', {
				extensionName: extension,
			});

			let imageUrl = '';

			if (response && typeof response === 'object' && 'path' in response) {
				imageUrl = (response as { path: string }).path;
			}

			if (!imageUrl) {
				console.error('응답에서 path를 찾을 수 없습니다:', response);
				throw new Error('서버 응답에서 이미지 path를 찾을 수 없습니다.');
			}

			return imageUrl;
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
			throw new Error('이미지 업로드에 실패했습니다.');
		}
	};

	// 이미지 파일 선택 시 즉시 업로드
	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const fileArr = Array.from(e.target.files).slice(0, 5 - images.length);
		if (fileArr.length === 0) return;

		// 지원하는 이미지 형식 체크 (HEIC/HEIF 포함)
		const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/heic', 'image/heif'];

		const validFiles = fileArr.filter((file) => {
			// MIME 타입 체크
			const isValidMimeType = supportedTypes.includes(file.type);

			// 파일 확장자 체크 (MIME 타입이 없거나 잘못된 경우 대비)
			const fileName = file.name.toLowerCase();
			const hasValidExtension =
				fileName.endsWith('.jpg') ||
				fileName.endsWith('.jpeg') ||
				fileName.endsWith('.png') ||
				fileName.endsWith('.gif') ||
				fileName.endsWith('.webp') ||
				fileName.endsWith('.bmp') ||
				fileName.endsWith('.heic') ||
				fileName.endsWith('.heif');

			if (!isValidMimeType && !hasValidExtension) {
				alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP, BMP, HEIC, HEIF 파일만 업로드 가능합니다.`);
				return false;
			}

			return true;
		});

		if (validFiles.length === 0) return;

		setIsUploading(true);

		try {
			console.log(
				'업로드 시작:',
				validFiles.map((f) => `${f.name} (${f.type})`)
			);

			const uploadedUrls: string[] = [];

			for (const file of validFiles) {
				try {
					const url = await uploadSingleImage(file);
					uploadedUrls.push(url);
					console.log(`${file.name} 업로드 성공:`, url);
				} catch (error) {
					console.error(`${file.name} 업로드 실패:`, error);
				}
			}

			if (uploadedUrls.length === 0) {
				throw new Error('모든 이미지 업로드에 실패했습니다.');
			}

			setImages((prev) => [...prev, ...validFiles.slice(0, uploadedUrls.length)].slice(0, 5));
			setImageUrls((prev) => [...prev, ...uploadedUrls].slice(0, 5));

			console.log('업로드 완료:', uploadedUrls);
		} catch (error) {
			alert('이미지 업로드에 실패했습니다.');
			console.error('이미지 업로드 에러:', error);
		} finally {
			setIsUploading(false);
		}
	};

	// 이미지 삭제
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
			await post<IReviewRegistrationRequest>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews`, {
				userId: 5,
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

	const isButtonActive = waitingTime.length > 0 && foodPrepTime.length > 0 && satisfaction > 0 && review.length > 0 && images.length > 0 && !isUploading; // 업로드 중이 아닐 때만 활성화

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

					<Button variant={isButtonActive ? 'active' : 'disabled'} disabled={!isButtonActive}>
						{isUploading ? '이미지 업로드 중...' : '등록하기'}
					</Button>
				</form>

				{isEdit ? (
					<CustomDialog headerText={{ title: '리뷰 수정이 완료되었어요' }} onOpen={isOpen} onOpenChange={setIsOpen} className="w-[271px]">
						<Button variant="active" onClick={() => navigate('/restaurant-detail/1')} className="mt-[24px]">
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
