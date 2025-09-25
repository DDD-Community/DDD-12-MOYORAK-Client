import { useEffect, useMemo, useState } from 'react';

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
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
	const [selectedTeam, setSelectedTeam] = useState<string>('');

	const name = localStorage.getItem('name');

	// 신규 등록 버튼 클릭 여부
	const [isRegisterTeam, setIsRegisterTeam] = useState<boolean>(false);

	const companyId = localStorage.getItem('companyId');

	const { mutate, isSuccess } = useMutationAddTeam({
		onSuccess: (data) => {
			console.log('data', data);
			localStorage.setItem('teamId', String(data.teamId));
		},
	});

	const { data: teamList } = useQuerySearchTeam(Number(companyId), team, team.length > 0 && Boolean(companyId) && !isRegisterTeam);

	// 입력이 변경될 때마다 자동 검색 활성화
	useEffect(() => {
		if (team.length > 0 && !selectedTeam) {
			setIsSearchEnabled(true);
			setShowSuggestions(true);
		} else if (team.length === 0) {
			setIsSearchEnabled(false);
			setShowSuggestions(false);
			setSelectedTeam('');
			setSelectedTeamId(null);
		}
	}, [team, selectedTeam]);

	const onRegisterTeam = () => {
		setIsRegisterTeam(true);
		setIsSearchEnabled(false);
		setSelectedTeamId(null);
		mutate({
			company: Number(companyId),
			team: team,
		});
	};

	const handleTeamSelect = (teamId: number, teamName: string) => {
		setTeam(teamName);
		setSelectedTeam(teamName);
		setSelectedTeamId(teamId);
		setShowSuggestions(false);
	};

	const validMessage = useMemo(() => {
		if (!isSearchEnabled) return '';

		// // 선택된 팀이 있고 정확히 일치하는 경우
		// if (selectedTeam && teamList && teamList.teams.length === 1) {
		// 	return '입력한 팀 이름이 초대받은 팀 이름과 일치합니다.';
		// }

		if (isSuccess) {
			return `${team}이 우리 회사에 등록 되었습니다.`;
		}

		// 검색 결과가 없는 경우
		if (teamList && teamList.teams.length === 0) {
			return `${team}는 아직 등록되어 있지 않습니다.`;
		}

		return '';
	}, [isSearchEnabled, teamList, team, selectedTeam]);

	const onSaveTeam = () => {
		if (selectedTeamId) {
			// 선택된 팀이 있는 경우
			localStorage.setItem('teamId', String(selectedTeamId));
			nextStep();
		} else if (isRegisterTeam && isSuccess) {
			// 신규 등록한 팀인 경우
			nextStep();
		}
	};

	return (
		<section className="px-5">
			<Typography as="h1" variant={FONT_VARIANT.header02} fontColor={PALETTE.gray10} className="mb-[5px]">
				{isRegisterTeam ? '우리 팀 등록하기' : '우리 팀 찾기'}
			</Typography>
			<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="mb-[60px]">
				{name}님의 점심을 함께할 팀원들을 찾기 위해 <br /> 현재 근무 중인 팀을 알려주세요.
			</Typography>

			<Input
				label="팀 이름"
				isEssential={true}
				placeholder="팀 이름을 입력해주세요."
				value={team}
				onChange={(e) => {
					setTeam(e.target.value);
					setSelectedTeam('');
					setSelectedTeamId(null);
					setIsRegisterTeam(false);
				}}
				isSuccess={(!isRegisterTeam && !!selectedTeam && teamList?.teams.length === 1) || (isRegisterTeam && isSuccess) ? true : undefined}
				isError={!isRegisterTeam && teamList?.teams.length === 0 ? true : undefined}
				message={validMessage}
			/>

			{showSuggestions && teamList?.teams && teamList.teams.length > 0 && (
				<div className="mb-4">
					{teamList.teams.map((teamItem) => (
						<button
							key={teamItem.teamId}
							type="button"
							className="w-full text-left py-1.75 flex items-center justify-between border-gray200 hover:border-primary200"
							onClick={() => handleTeamSelect(teamItem.teamId, teamItem.name)}
						>
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07} className="font-medium">
								{teamItem.name}
							</Typography>
							<Icon name="searchTeam" size={16} />
						</button>
					))}
				</div>
			)}

			{/* 신규 등록 버튼 */}
			{teamList && teamList.teams.length === 0 && !isRegisterTeam && (
				<FilterButton variant="general" className="rounded-[17px] py-1.5 flex items-center gap-0.5 mt-4" onClick={onRegisterTeam}>
					신규 등록하기
					<Icon name="plus" width={18} height={18} />
				</FilterButton>
			)}

			<div className="fixed bottom-[30px] left-0 w-full px-5">
				<Button
					variant={
						// 팀 리스트에서 선택했거나 신규 등록 모드에서 성공한 경우
						(selectedTeam && teamList?.teams.length === 1) || (isRegisterTeam && isSuccess) ? 'active' : 'disabled'
					}
					onClick={onSaveTeam}
				>
					<Typography
						variant={FONT_VARIANT.header04}
						fontColor={(selectedTeam && teamList?.teams.length === 1) || (isRegisterTeam && isSuccess) ? PALETTE.primary600 : PALETTE.gray06}
					>
						{isRegisterTeam ? '등록하기' : '다음'}
					</Typography>
				</Button>
			</div>
		</section>
	);
};

export default TeamSearch;
