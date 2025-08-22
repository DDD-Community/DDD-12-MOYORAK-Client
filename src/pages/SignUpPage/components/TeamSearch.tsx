import { useMemo, useState } from 'react';

import { useMutationAddTeam } from '@/apis/useMutationAddTeam';
import { useQuerySearchTeam } from '@/apis/useQuerySearchTeam';
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

	const companyId = localStorage.getItem('companyId');

	const { mutate, isSuccess } = useMutationAddTeam({
		onSuccess: (data) => {
			localStorage.setItem('companyId', String(data.teamId));
		},
	});

	const onRegisterTeam = () => {
		setIsRegisterTeam(true);
		setIsSearchEnabled(false);
		mutate({
			company: Number(companyId),
			team: team,
		});
	};

	const { isError, data: teamList } = useQuerySearchTeam(Number(companyId), team, isSearchEnabled && Boolean(companyId));

	const validMessage = useMemo(() => {
		if (!isSearchEnabled) return '';

		if (teamList && teamList.teams.length === 0) return `${team}는 아직 등록되어 있지 않습니다.`;
		if (isSuccess) return `${team}이 우리 회사에 등록되었습니다.`;
	}, [isSearchEnabled, teamList, isSuccess]);

	const onSaveTeam = () => {
		if (teamList && teamList.teams.length === 1) {
			const teamId = teamList.teams[0].teamId;
			localStorage.setItem('teamId', String(teamId));
		}
		nextStep();
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
				isSuccess={isRegisterTeam && teamList?.teams.length === 1}
				isError={teamList?.teams.length === 0}
				message={validMessage}
				rightButton={
					team &&
					!isError &&
					!teamList && (
						<button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setIsSearchEnabled(true)}>
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.primary200}>
								입력
							</Typography>
						</button>
					)
				}
			/>

			{teamList && teamList.teams.length === 0 && (
				<FilterButton variant="general" className="rounded-[17px] py-1.5 flex items-center gap-0.5 mt-4" onClick={onRegisterTeam}>
					신규 등록하기
					<Icon name="plus" width={18} height={18} />
				</FilterButton>
			)}

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button variant={!team ? 'disabled' : 'active'} onClick={onSaveTeam}>
					다음
				</Button>
			</div>
		</section>
	);
};

export default TeamSearch;
