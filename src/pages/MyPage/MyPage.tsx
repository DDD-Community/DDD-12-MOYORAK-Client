import { useEffect, useState } from 'react';

import { useMutationMealAlone } from '@/apis/useMutationMealAlone';
import { useMutationMealTags } from '@/apis/useMutationMealTags';
import { useQueryMealAlone } from '@/apis/useQueryMealAlone';
import { useQueryMealTags } from '@/apis/useQueryMealTags';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import NavBar from '@/components/NavBar/NavBar';
import Switch from '@/components/Switch';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const MyPage = () => {
	const { data } = useQueryMealAlone();
	const { data: mealTagsData, refetch: refetchMealTags } = useQueryMealTags();
	const userId = localStorage.getItem('userId');

	const { mutate: mutateMealLone } = useMutationMealAlone(Number(userId));
	const { mutate: mutateMealTags } = useMutationMealTags();

	const [isChecked, setIsChecked] = useState(data?.state === 'ON');

	// 음식 태그 상태 관리 (API 데이터 기반)
	const [allergyFoods, setAllergyFoods] = useState<string[]>([]);
	const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
	const [isEditingAllergy, setIsEditingAllergy] = useState(false);
	const [isEditingDislike, setIsEditingDislike] = useState(false);

	// 음식 태그 업데이트 함수
	const updateMealTags = () => {
		const details = [...allergyFoods.map((item) => ({ type: 'ALLERGY' as const, item })), ...dislikedFoods.map((item) => ({ type: 'DISLIKE' as const, item }))];

		mutateMealTags(
			{
				userId: Number(userId),
				details,
			},
			{
				onSuccess: () => {
					// 성공 시 최신 데이터 다시 가져오기
					refetchMealTags();
				},
			}
		);
	};

	// API 데이터로 상태 초기화
	useEffect(() => {
		if (mealTagsData) {
			setAllergyFoods(mealTagsData.allergies.map((tag) => tag.item));
			setDislikedFoods(mealTagsData.dislikes.map((tag) => tag.item));
		}
	}, [mealTagsData]);

	useEffect(() => {
		setIsChecked(data?.state === 'ON');
	}, [data?.state]);

	return (
		<div className="bg-gray-02 min-h-screen pb-20">
			<NavBar variant="centerText" centerText="마이페이지" />

			{/* 프로필 정보 */}
			<div className="relative flex flex-col items-center bg-white rounded-[20px] h-[123px] w-[339px] mx-auto mt-[50px] mb-[22px]">
				<div className="absolute -top-[30px] w-[60px] h-[60px] rounded-full bg-gray-200 flex items-center justify-center">
					<Icon name="mypage" width={30} height={30} />
				</div>
				<div className="flex flex-col items-center justify-center h-full pt-[30px]">
					<Typography variant={FONT_VARIANT.header02}>이지민</Typography>
					<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray07}>
						jiwon.kim@wantedlab.com
					</Typography>
				</div>
			</div>

			{/* 오늘 혼밥 모드 */}
			<div className="bg-white p-4 rounded-[20px] w-[339px] mx-auto mb-[22px]">
				<div className="flex items-center justify-between mb-2">
					<Typography variant={FONT_VARIANT.body01}>오늘 혼밥 모드</Typography>
					<Switch
						checked={isChecked}
						onCheckedChange={() => {
							setIsChecked((prev) => !prev);
							mutateMealLone();
						}}
					/>
				</div>
				<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
					혼밥 모드는 자정이 지나면 자동으로 Off로 전환됩니다.
				</Typography>
			</div>

			{/* 알러지 음식 */}
			<div className="bg-white rounded-[20px] w-[339px] mx-auto mb-[22px] p-4">
				<div className="flex items-center justify-between mb-3">
					<Typography variant={FONT_VARIANT.body01}>알러지 음식</Typography>
					<button
						className="text-primary-500 text-sm"
						onClick={() => {
							setIsEditingAllergy(!isEditingAllergy);
							if (isEditingAllergy) {
								updateMealTags();
							}
						}}
					>
						{isEditingAllergy ? '수정완료' : '수정하기'}
					</button>
				</div>
				<div className="flex flex-wrap gap-2">
					{allergyFoods.map((food, index) => (
						<FilterButton
							key={index}
							variant="active"
							borderRadius="16"
							onClick={() => {
								if (isEditingAllergy) {
									setAllergyFoods(allergyFoods.filter((_, i) => i !== index));
								}
							}}
							className={isEditingAllergy ? 'cursor-pointer' : 'cursor-default'}
						>
							{food} {isEditingAllergy && '×'}
						</FilterButton>
					))}
					{allergyFoods.length === 0 && (
						<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
							입력
						</Typography>
					)}
				</div>
			</div>

			{/* 비선호 음식 */}
			<div className="bg-white rounded-[20px] w-[339px] mx-auto mb-[22px] p-4">
				<div className="flex items-center justify-between mb-3">
					<Typography variant={FONT_VARIANT.body01}>비선호 음식</Typography>
					<button
						className="text-primary-500 text-sm"
						onClick={() => {
							setIsEditingDislike(!isEditingDislike);
							if (isEditingDislike) {
								updateMealTags();
							}
						}}
					>
						{isEditingDislike ? '수정완료' : '수정하기'}
					</button>
				</div>
				<div className="flex flex-wrap gap-2">
					{dislikedFoods.map((food, index) => (
						<FilterButton
							key={index}
							variant="active"
							borderRadius="16"
							onClick={() => {
								if (isEditingDislike) {
									setDislikedFoods(dislikedFoods.filter((_, i) => i !== index));
								}
							}}
							className={isEditingDislike ? 'cursor-pointer' : 'cursor-default'}
						>
							{food} {isEditingDislike && '×'}
						</FilterButton>
					))}
					{dislikedFoods.length === 0 && (
						<Typography variant={FONT_VARIANT.label02} fontColor={PALETTE.gray07}>
							입력
						</Typography>
					)}
				</div>
			</div>

			{/* 메뉴 리스트 */}
			<div className="bg-white rounded-[20px] w-[339px] mx-auto">
				<ul>
					<a className="flex items-center justify-between px-[18px] py-5 border-b border-gray-02" href="/mypage/my-review">
						<Typography variant={FONT_VARIANT.body01}>내가 쓴 리뷰 관리</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</a>
					<a
						className="flex items-center justify-between px-[18px] py-5 border-b border-gray-02"
						href="https://marsh-methane-db9.notion.site/251faa5de80280ba9914cb87093485ff?source=copy_link"
						target="_blank"
						rel="noreferrer"
					>
						<Typography variant={FONT_VARIANT.body01}>이용약관</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</a>
					<a className="flex items-center justify-between px-[18px] py-5 border-b border-gray-02">
						<Typography variant={FONT_VARIANT.body01}>로그아웃</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</a>
					<a className="flex items-center justify-between px-[18px] py-5">
						<Typography variant={FONT_VARIANT.body01}>탈퇴하기</Typography>
						<Icon name="arrowRight" width={18} height={18} />
					</a>
				</ul>
			</div>
		</div>
	);
};

export default MyPage;
