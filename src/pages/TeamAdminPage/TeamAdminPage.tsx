import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TEAM_MEMBER_STATUS, useQueryTeamMember } from '@/apis/useQueryTeamMember';
import NavBar from '@/components/NavBar/NavBar';
import Pagination from '@/components/Pagination/Pagination';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import PendingMemberList from './PendingMemberList/PendingMemberList';
import TeamMemberList from './TeamMemberList/TeamMemberList';

const TeamAdminPage = () => {
	const teamId = localStorage.getItem('teamId');
	const navigate = useNavigate();

	const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
	const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
	const size = 5;

	const { data: pendingMemberList } = useQueryTeamMember(Number(teamId), {
		status: TEAM_MEMBER_STATUS.PENDING,
		size,
		currentPage: pendingCurrentPage,
	});

	const { data: teamMemberList } = useQueryTeamMember(Number(teamId), {
		status: TEAM_MEMBER_STATUS.APPROVED,
		size,
		currentPage: approvedCurrentPage,
	});

	return (
		<>
			<div className="bg-gray-02 min-h-screen">
				<NavBar variant="iconWithTextAndRightIcon" leftText="팀원 관리" rightIcon="help" onLeftIconClick={() => navigate(-1)} />
				<div className="flex gap-1.5 mt-[25px] px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
						팀 가입 요청
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
						{pendingMemberList?.teamUsers.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px] mb-4">
					{pendingMemberList && pendingMemberList.teamUsers.length > 0 && (
						<ul>
							{pendingMemberList.teamUsers.map((item) => (
								<PendingMemberList key={item.teamUserId} item={item} />
							))}
						</ul>
					)}

					{(!pendingMemberList || pendingMemberList.teamUsers.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>

				{pendingMemberList && (
					<Pagination
						currentPage={pendingCurrentPage}
						totalCount={pendingMemberList.totalCount}
						size={size}
						onPageChange={setPendingCurrentPage}
						variant="large"
						className="mb-6"
					/>
				)}

				<div className="flex gap-1.5 mt-[22px] px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10}>
						{teamMemberList?.teamName}
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08}>
						{teamMemberList?.teamUsers.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px] mb-4">
					{teamMemberList && teamMemberList.teamUsers.length > 0 && (
						<ul>
							{teamMemberList.teamUsers.map((item) => (
								<TeamMemberList key={item.teamUserId} item={item} />
							))}
						</ul>
					)}
					{(!teamMemberList || teamMemberList.teamUsers.length === 0) && <div className="p-4 text-center text-gray-500">데이터가 없습니다.</div>}
				</section>

				{/* 팀원 리스트 페이지네이션 */}
				{teamMemberList && (
					<Pagination
						currentPage={approvedCurrentPage}
						totalCount={teamMemberList.totalCount}
						size={size}
						onPageChange={setApprovedCurrentPage}
						variant="large"
						className="mb-20"
					/>
				)}
			</div>
		</>
	);
};

export default TeamAdminPage;
