import { type ChangeEvent, useCallback, useState } from 'react';

import Button from '@/components/Button/Button';
import IconButton from '@/components/Button/IconButton';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

const FoodPreference = () => {
	const { allergyFoods = [], dislikedFoods = [], setAllergyFoods, setDislikedFoods, nextStep } = useSignupStore();

	const [foodInputValues, setFoodInputValues] = useState({
		allergy: '',
		disliked: '',
	});

	const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		setFoodInputValues((prev) => ({ ...prev, [name]: value }));
	}, []);

	const addFood = useCallback(
		(type: 'allergy' | 'disliked') => {
			const inputValue = foodInputValues[type];
			const setter = type === 'allergy' ? setAllergyFoods : setDislikedFoods;
			const currentList = type === 'allergy' ? allergyFoods : dislikedFoods;

			const newItems = inputValue
				.split(',')
				.map((f) => f.trim())
				.filter((f) => f && !currentList.includes(f));

			if (newItems.length > 0) {
				setter([...currentList, ...newItems]);
			}

			setFoodInputValues((prev) => ({ ...prev, [type]: '' }));
		},
		[foodInputValues, allergyFoods, dislikedFoods, setAllergyFoods, setDislikedFoods]
	);

	const renderRightButton = (fnAddFood: () => void) => (
		<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={fnAddFood}>
			<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
				입력
			</Typography>
		</button>
	);

	const removeFood = useCallback(
		(type: 'allergy' | 'disliked', foodToRemove: string) => {
			const setter = type === 'allergy' ? setAllergyFoods : setDislikedFoods;
			const currentList = type === 'allergy' ? allergyFoods : dislikedFoods;

			const updatedList = currentList.filter((food) => food !== foodToRemove);
			setter(updatedList);
		},
		[allergyFoods, dislikedFoods, setAllergyFoods, setDislikedFoods]
	);

	const renderFoodTags = (foods: string[], type: 'allergy' | 'disliked') =>
		foods.map((food) => (
			<div key={food} className="border-[1px] border-solid rounded-[17px] border-gray-05 px-[14px] h-8 inline-flex items-center gap-[2px] w-auto max-w-max">
				<Typography variant={FONT_VARIANT.label01} as="span">
					{food}
				</Typography>
				<IconButton
					iconStyle={{
						name: 'close',
						width: 18,
						height: 18,
						color: '#c4c4c4',
					}}
					onClick={() => removeFood(type, food)}
				/>
			</div>
		));

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				알러지 비선호 음식
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				모두가 만족할 점심 메뉴를 고르기 위해 <br /> 식사기호를 공유해 주세요!
			</Typography>
			<div className="flex flex-col gap-[50px]">
				<div>
					<Input
						label="알러지"
						name="allergy"
						isEssential={false}
						placeholder="알러지가 있는 음식을 입력해주세요."
						value={foodInputValues.allergy}
						onChange={handleInputChange}
						rightButton={renderRightButton(() => addFood('allergy'))}
					/>
					<div className="flex flex-wrap gap-2 mt-2">{renderFoodTags(allergyFoods, 'allergy')}</div>
				</div>

				<div>
					<Input
						label="비선호 음식"
						name="disliked"
						isEssential={false}
						placeholder="선호하지 않는 음식을 입력해주세요."
						value={foodInputValues.disliked}
						onChange={handleInputChange}
						rightButton={renderRightButton(() => addFood('disliked'))}
					/>
					<div className="flex flex-wrap gap-2 mt-2">{renderFoodTags(dislikedFoods, 'disliked')}</div>
				</div>
			</div>

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant="active" onClick={nextStep}>
					다음
				</Button>
			</div>
		</section>
	);
};

export default FoodPreference;
