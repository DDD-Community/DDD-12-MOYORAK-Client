import { useState } from 'react';

import Button from '@/components/Button/Button';
import FilterButton from '@/components/FilterButton/FilterButton';
import Icon from '@/components/Icon';
import Input from '@/components/Input/Input';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';
import { useSignupStore } from '@/store/signupStore';

const TeamSearch = () => {
	const { team, setTeam, nextStep } = useSignupStore();

	const [isSearchEnabled, setIsSearchEnabled] = useState(false);

	// 신규 등록 버튼 클릭 여부
	const [isRegisterTeam, setIsRegisterTeam] = useState<boolean>(false);

	const onRegisterTeam = () => {
		setIsRegisterTeam(true);
		setIsSearchEnabled(false);
	};

	// 👉 임시 훅 (팀 이름 기준으로 상태 판단)
	const useQuerySearchCompany = (team: string, enabled: boolean, isRegisterTeam: boolean) => {
		if (!enabled || !team) {
			return { isSuccess: false, isError: false };
		}

		// 신규 등록을 눌렀다면 성공으로 간주
		if (isRegisterTeam) {
			return { isSuccess: true, isError: false };
		}

		if (team === '개발3팀') {
			return { isSuccess: true, isError: false };
		}

		if (team === '개발1팀') {
			return { isSuccess: false, isError: true };
		}

		return { isSuccess: false, isError: false };
	};

	const { isSuccess, isError } = useQuerySearchCompany(team, isSearchEnabled, isRegisterTeam);

	const getValidMessage = () => {
		if (isSuccess || isRegisterTeam) return `${team}이 우리 회사에 등록 되었습니다.`;
		if (isError) return `${team}이 아직 등록되어 있지 않습니다.`;
		return '';
	};

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				우리 팀 찾기
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				점심을 함께할 팀원들을 찾기 위해 <br /> 현재 근무 중인 팀을 알려주세요.
			</Typography>

			<Input
				label="팀 이름"
				isEssential={true}
				placeholder="팀 이름을 입력해주세요."
				value={team}
				onChange={(e) => {
					setTeam(e.target.value);
					setIsSearchEnabled(false);
				}}
				isSuccess={isSuccess || isRegisterTeam}
				isError={isError}
				message={getValidMessage()}
				rightButton={
					team &&
					!isError &&
					!isRegisterTeam && (
						<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setIsSearchEnabled(true)}>
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
								입력
							</Typography>
						</button>
					)
				}
			/>

			{isError && !isRegisterTeam && (
				<FilterButton variant="general" className="rounded-[17px] py-1.5 flex items-center gap-0.5 mt-4" onClick={onRegisterTeam}>
					신규 등록하기
					<Icon name="plus" width={18} height={18} />
				</FilterButton>
			)}

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant={!team ? 'disabled' : 'active'} onClick={nextStep}>
					다음
				</Button>
			</div>
		</section>
	);
};

export default TeamSearch;
