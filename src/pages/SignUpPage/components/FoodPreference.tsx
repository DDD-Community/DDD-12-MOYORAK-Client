import { useState, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

import Button from '@/components/Button/Button';
import IconButton from '@/components/Button/IconButton';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';
import { useMutationMeMealTags } from '@/apis/useMutationMeMealTags';

const FoodPreference = () => {
	const { allergyFoods = [], dislikedFoods = [], setAllergyFoods, setDislikedFoods, nextStep } = useSignupStore();
	const { mutate } = useMutationMeMealTags();

	const [allergyInput, setAllergyInput] = useState('');
	const [dislikeInput, setDislikeInput] = useState('');

	const addFood = useCallback(
		(type: 'ALLERGY' | 'DISLIKE') => {
			const inputValue = type === 'ALLERGY' ? allergyInput.trim() : dislikeInput.trim();
			if (!inputValue) return;

			const setter = type === 'ALLERGY' ? setAllergyFoods : setDislikedFoods;
			const currentList = type === 'ALLERGY' ? allergyFoods : dislikedFoods;

			if (currentList.includes(inputValue)) {
				if (type === 'ALLERGY') setAllergyInput('');
				else setDislikeInput('');
				return;
			}

			setter([...currentList, inputValue]);

			// 입력창 초기화
			if (type === 'ALLERGY') setAllergyInput('');
			else setDislikeInput('');
		},
		[allergyInput, dislikeInput, allergyFoods, dislikedFoods, setAllergyFoods, setDislikedFoods]
	);

	// Enter 입력 시 추가
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLInputElement>, type: 'ALLERGY' | 'DISLIKE') => {
			if (e.nativeEvent.isComposing) return;

			if (e.key === 'Enter') {
				e.preventDefault();

				const value = (type === 'ALLERGY' ? allergyInput : dislikeInput).trim();
				if (!value) return;

				const setter = type === 'ALLERGY' ? setAllergyFoods : setDislikedFoods;
				const currentList = type === 'ALLERGY' ? allergyFoods : dislikedFoods;

				if (currentList.includes(value)) {
					if (type === 'ALLERGY') setAllergyInput('');
					else setDislikeInput('');
					return;
				}

				setter([...currentList, value]);

				if (type === 'ALLERGY') setAllergyInput('');
				else setDislikeInput('');
			}
		},
		[allergyInput, dislikeInput, allergyFoods, dislikedFoods, setAllergyFoods, setDislikedFoods]
	);

	const removeFood = useCallback(
		(type: 'ALLERGY' | 'DISLIKE', foodToRemove: string) => {
			const setter = type === 'ALLERGY' ? setAllergyFoods : setDislikedFoods;
			const currentList = type === 'ALLERGY' ? allergyFoods : dislikedFoods;
			setter(currentList.filter((food) => food !== foodToRemove));
		},
		[allergyFoods, dislikedFoods, setAllergyFoods, setDislikedFoods]
	);

	const renderFoodTags = (foods: string[], type: 'ALLERGY' | 'DISLIKE') =>
		foods.map((food) => (
			<div key={food} className="border border-solid rounded-[17px] border-gray-05 px-[14px] h-8 inline-flex items-center gap-[4px] max-w-max">
				<Typography variant={FONT_VARIANT.label01} as="span" fontColor={PALETTE.gray07} className="leading-none">
					{food}
				</Typography>
				<IconButton
					iconStyle={{
						name: 'close',
						width: 18,
						height: 18,
						className: 'text-gray-05',
					}}
					onClick={() => removeFood(type, food)}
				/>
			</div>
		));

	const onRegisterFoodPreference = () => {
		const userIdStr = localStorage.getItem('userId');
		if (!userIdStr) return;

		const userId = Number(userIdStr);

		const details: { type: 'ALLERGY' | 'DISLIKE'; item: string }[] = [
			...allergyFoods.map((item) => ({ type: 'ALLERGY' as const, item })),
			...dislikedFoods.map((item) => ({ type: 'DISLIKE' as const, item })),
		];

		mutate(
			{ userId, details },
			{
				onSuccess: nextStep,
			}
		);
	};

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				알러지 비선호 음식
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				모두가 만족할 점심 메뉴를 고르기 위해 <br /> 식사기호를 공유해 주세요!
			</Typography>

			<div className="flex flex-col gap-[50px]">
				{/* 알러지 */}
				<div>
					<Input
						label="알러지"
						name="ALLERGY"
						isEssential={false}
						placeholder="알러지가 있는 음식을 입력해주세요."
						value={allergyInput}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setAllergyInput(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, 'ALLERGY')}
						rightButton={
							allergyInput && (
								<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => addFood('ALLERGY')}>
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
										입력
									</Typography>
								</button>
							)
						}
					/>
					<div className="flex flex-wrap gap-2 mt-2">{renderFoodTags(allergyFoods, 'ALLERGY')}</div>
				</div>

				{/* 비선호 음식 */}
				<div>
					<Input
						label="비선호 음식"
						name="DISLIKE"
						isEssential={false}
						placeholder="선호하지 않는 음식을 입력해주세요."
						value={dislikeInput}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setDislikeInput(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, 'DISLIKE')}
						rightButton={
							dislikeInput && (
								<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => addFood('DISLIKE')}>
									<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
										입력
									</Typography>
								</button>
							)
						}
					/>
					<div className="flex flex-wrap gap-2 mt-2">{renderFoodTags(dislikedFoods, 'DISLIKE')}</div>
				</div>
			</div>

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant={allergyFoods.length === 0 || dislikedFoods.length === 0 ? 'disabled' : 'active'} onClick={onRegisterFoodPreference}>
					<Typography variant={FONT_VARIANT.header04} fontColor={allergyFoods.length === 0 || dislikedFoods.length === 0 ? PALETTE.gray06 : PALETTE.primary600}>
						다음
					</Typography>
				</Button>
			</div>
		</section>
	);
};

export default FoodPreference;
