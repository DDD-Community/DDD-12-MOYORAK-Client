import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const TeamSearch = () => {
	console.log('test');

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				우리 팀 찾기
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				점심을 함께할 팀원들을 찾기 위해 <br /> 현재 근무 중인 팀을 알려주세요.
			</Typography>

			<Input label="팀 이름" isEssential={true} placeholder="팀 이름을 입력해주세요." />

			<Button variant="active">다음</Button>
		</section>
	);
};

export default TeamSearch;
