import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { post } from '@/apis';
import emptyStarIcon from '@/assets/emptyStar.png';
import starIcon from '@/assets/star.png';
import Button from '@/components/Button/Button';
import { CustomDialog } from '@/components/Dialog/CustomDialog';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import FormLabel from '@/components/Input/FormLabel';
import Input from '@/components/Input/Input';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography/Typography';
import { FOOD_PREP_TIME_OPTIONS, SATISFACTION_OPTIONS, WAITING_TIME_OPTIONS } from '@/constants/data.constant';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { uploadMultipleImages, validateImageFiles } from '@/utils/imageUpload';

interface IRestaurantRegistrationRequest {
	restaurantId: number;
	summary: string;
	userId: number;
	servingTimeId: number;
	waitingTimeId: number;
	score: number;
	photoPaths: string[];
	extraText: string;
}

const RestaurantRegistration = () => {
	const [restaurantDescription, setRestaurantDescription] = useState('');
	const [waitingTime, setWaitingTime] = useState<string>('');
	const [foodPrepTime, setFoodPrepTime] = useState<string>('');
	const [satisfaction, setSatisfaction] = useState<number>(0);
	const [review, setReview] = useState<string>('');
	const [images, setImages] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [restaurantName, setRestaurantName] = useState('');
	const teamId = localStorage.getItem('teamId') ?? '';
	const userId = localStorage.getItem('userId') ?? '';
	const queryClient = useQueryClient();

	const location = useLocation();
	const { restaurant } = (location.state as { restaurant?: { id: string; name: string } } | undefined) ?? {};
	const navigate = useNavigate();

	const [teamRestaurantId, setTeamRestaurantId] = useState<number>(0);

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

	const registerRestaurant = async () => {
		try {
			const response = await post<IRestaurantRegistrationRequest>(`/teams/${teamId}/restaurants`, {
				restaurantId: Number(restaurant?.id),
				summary: restaurantDescription,
				userId: Number(userId),
				servingTimeId: Number(foodPrepTime),
				waitingTimeId: Number(waitingTime),
				score: satisfaction,
				photoPaths: imageUrls,
				extraText: review,
			} as IRestaurantRegistrationRequest);
			setTeamRestaurantId(Number((response as unknown as { teamRestaurantId: string }).teamRestaurantId));

			queryClient.invalidateQueries({ queryKey: ['reviews', teamId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'photos', teamId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'detail', teamId] });
			queryClient.removeQueries({ queryKey: ['reviews', teamId] });

			setIsOpen(true);
		} catch (error) {
			console.error('식당 등록에 실패했습니다:', error);
			alert('식당 등록 실패');
		}
	};

	useEffect(() => {
		if (restaurant?.name) {
			setRestaurantName(restaurant.name);
		}
	}, [restaurant]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		registerRestaurant();
	};

	const isButtonActive =
		restaurantName.length > 0 &&
		restaurantDescription.length > 0 &&
		waitingTime.length > 0 &&
		foodPrepTime.length > 0 &&
		satisfaction > 0 &&
		review.length > 0 &&
		images.length > 0 &&
		!isUploading;

	const handleRestaurantSearch = () => {
		navigate('/restaurant-search');
	};

	return (
		<>
			<NavBar
				variant="iconWithText"
				leftText="식당 등록"
				onLeftIconClick={() => {
					navigate(-1);
				}}
			/>
			<div className="bg-gray-02 min-h-screen ">
				<form className="p-4.5 flex flex-col gap-6 " onSubmit={handleSubmit}>
					<div className="py-6 px-4 rounded-[20px] bg-white flex flex-col gap-6.25">
						<div className="flex flex-col ">
							<FormLabel label="식당 이름" isEssential id="restaurant" className="font-semibold" />
							<div className="relative">
								<div
									className={`
										w-full ${FONT_VARIANT.header02} pt-[10px] pb-[7px] pr-[48px] mb-[10px]
										flex items-center cursor-pointer
										transition-colors duration-200
										border-b-[1px] ${restaurantName ? 'border-b-primary-200' : 'border-b-gray-04'}
										hover:border-b-primary-500 focus:border-b-primary-500
									`}
									onClick={handleRestaurantSearch}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											handleRestaurantSearch();
										}
									}}
									tabIndex={0}
									role="button"
									aria-label="식당 검색하기"
								>
									<Typography
										variant={FONT_VARIANT.header02}
										fontColor={restaurantName ? PALETTE.gray10 : PALETTE.gray05}
										className={!restaurantName ? 'text-xl font-medium' : ''}
									>
										{restaurantName || '식당을 검색해 주세요'}
									</Typography>
								</div>
								<Icon
									name={restaurantName ? 'inputValueSearch' : 'inputSearch'}
									size={22}
									className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-06"
								/>
							</div>
						</div>
						<div className="flex flex-col">
							<FormLabel label="한줄 소개" isEssential />
							<Input
								placeholder="식당을 간단하게 소개해 주세요"
								value={restaurantDescription}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRestaurantDescription(e.target.value)}
							/>
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray06}>
								간단한 설명을 함께 적어주시면, 팀원들이 식당에 대해 빠르게 파악할 수 있어요.
							</Typography>
						</div>
					</div>

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
				<CustomDialog headerText={{ title: '식당 등록이 완료되었어요' }} onOpen={isOpen} onOpenChange={setIsOpen} className="w-[271px]">
					<Button variant="active" onClick={() => navigate(`/restaurant-detail/${teamRestaurantId}`)} className="mt-[17px]">
						확인
					</Button>
				</CustomDialog>
			</div>
		</>
	);
};

export default RestaurantRegistration;
