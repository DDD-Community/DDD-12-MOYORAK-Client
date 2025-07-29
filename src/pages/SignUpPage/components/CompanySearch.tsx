import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

const CompanySearch = () => {
	console.log('test');

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				우리 회사 찾기
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				함께 점심을 즐길 팀을 찾을 수 있도록 <br /> 현재 근무 중인 회사를 알려주세요.
			</Typography>

			<Input label="회사 이름" isEssential={true} placeholder="회사 이름을 입력해주세요." />

			<Input label="회사 주소" isEssential={true} placeholder="회사 주소를 검색해 주세요." />
			<Input placeholder="상세 주소" />
			<Button variant="active">다음</Button>
		</section>
	);
};

export default CompanySearch;
