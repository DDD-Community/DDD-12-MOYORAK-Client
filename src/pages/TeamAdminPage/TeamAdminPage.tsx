import { useNavigate } from 'react-router-dom';

import { TEAM_MEMBER_STATUS, useQueryTeamMember } from '@/apis/useQueryTeamMember';
import NavBar from '@/components/NavBar/NavBar';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import PendingMemberList from './PendingMemberList/PendingMemberList';
import TeamMemberList from './TeamMemberList/TeamMemberList';

const TeamAdminPage = () => {
	const teamId = localStorage.getItem('teamId');
	const navigate = useNavigate();

	const { data: pendingMemberList } = useQueryTeamMember(Number(teamId), {
		status: TEAM_MEMBER_STATUS.PENDING,
		size: 1,
		currentPage: 1,
	});

	const { data: teamMemberList } = useQueryTeamMember(Number(teamId), {
		status: TEAM_MEMBER_STATUS.APPROVED,
		size: 1,
		currentPage: 1,
	});

	return (
		<>
			<div className="bg-gray-02 min-h-screen">
				<NavBar variant="iconWithTextAndRightIcon" leftText="팀원 관리" rightIcon="help" onLeftIconClick={() => navigate(-1)} />
				<div className="flex gap-1.5 mt-[25px] px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
						팀 가입 요청
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
						{pendingMemberList?.data.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px]">
					{pendingMemberList && pendingMemberList.data.length > 0 && (
						<ul>
							{pendingMemberList.data.map((item) => (
								<PendingMemberList key={item.teamUserId} item={item} />
							))}
						</ul>
					)}

					{(!pendingMemberList || pendingMemberList.data.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>

				<div className="flex gap-1.5 mt-[22px] px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
						WEB2 우가우가 차차차
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
						{teamMemberList?.data.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px]">
					{teamMemberList && teamMemberList.data.length > 0 && (
						<ul>
							{teamMemberList.data.map((item) => (
								<TeamMemberList key={item.teamUserId} item={item} />
							))}
						</ul>
					)}
					{(!teamMemberList || teamMemberList.data.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>
			</div>
		</>
	);
};

export default TeamAdminPage;
