import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

const TeamSearch = () => {
	const { team, setTeam, setStep } = useSignupStore();

	const handleSuccess = () => {
		setStep('success');
	};

    return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				우리 팀 찾기
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				점심을 함께할 팀원들을 찾기 위해 <br /> 현재 근무 중인 팀을 알려주세요.
			</Typography>

			<Input label="팀 이름" isEssential={true} placeholder="팀 이름을 입력해주세요." value={team} onChange={(e) => setTeam(e.target.value)} />

			<FilterButton variant="general" className="rounded-[17px] py-1.5 flex items-center gap-0.5">
				신규 등록하기
				<Icon name="plus" width={18} height={18} />
			</FilterButton>

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant="active" onClick={handleSuccess}>
					다음
				</Button>
			</div>
		</section>
	);
};

export default TeamSearch;
