import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const FoodPreference = () => {
	console.log('test');

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				알러지 비선호 음식
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				모두가 만족할 점심 메뉴를 고르기 위해 <br /> 식사기호를 공유해 주세요!
			</Typography>

			<Input label="알러지" isEssential={false} placeholder="알러지가 있는 음식을 입력해주세요." />
			<Input label="비선호 음식" isEssential={false} placeholder="선호하지 않는 음식을 입력해주세요." />

			<Button variant="active">다음</Button>
		</section>
	);
};

export default FoodPreference;
