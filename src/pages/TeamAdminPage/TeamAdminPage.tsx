import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TEAM_MEMBER_STATUS, useQueryTeamMember } from '@/apis/useQueryTeamMember';
import noInquiryData from '@/assets/noInquiryData.png';
import noSearchData from '@/assets/noSearchData.png';
import NavBar from '@/components/NavBar/NavBar';
import Pagination from '@/components/Pagination/Pagination';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

import PendingMemberList from './PendingMemberList/PendingMemberList';
import TeamMemberList from './TeamMemberList/TeamMemberList';

const pendingMemberList = [
	{
		id: 1,
		name: '홍길동',
		email: 'hong@gmail.com',
		profileImage: 'https://via.placeholder.com/150',
	},
	{
		id: 2,
		name: '김길동',
		email: 'gil@gmail.com',
		profileImage: 'https://via.placeholder.com/150',
	},
	{
		id: 3,
		name: '이길동',
		email: 'lee@gmail.com',
		profileImage: 'https://via.placeholder.com/150',
	},
	{
		id: 4,
		name: '박길동',
		email: 'park@gmail.com',
		profileImage: 'https://via.placeholder.com/150',
	},
	{
		id: 5,
		name: '최길동',
		email: 'choi@gmail.com',
		profileImage: 'https://via.placeholder.com/150',
	},
];

const TeamAdminPage = () => {
	const teamId = localStorage.getItem('teamId');
	const navigate = useNavigate();

	const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
	const [approvedCurrentPage, setApprovedCurrentPage] = useState(1);
	const size = 5;

	// const { data: pendingMemberList } = useQueryTeamMember(Number(teamId), {
	//    status: TEAM_MEMBER_STATUS.PENDING,
	//    size,
	//    currentPage: pendingCurrentPage,
	// });

	const { data: teamMemberList } = useQueryTeamMember(Number(teamId), {
		status: TEAM_MEMBER_STATUS.APPROVED,
		size,
		currentPage: approvedCurrentPage,
	});

	return (
		<>
			<div className="bg-gray-02 min-h-screen pb-5">
				<NavBar variant="iconWithTextAndRightIcon" leftText="팀원 관리" rightIcon="help" onLeftIconClick={() => navigate(-1)} />
				<div className="flex gap-1.5 mt-[25px] px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
						팀 가입 요청
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
						{pendingMemberList.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px] mb-5.5 py-2.75 px-4.5 mx-4.5">
					{pendingMemberList && pendingMemberList.length > 0 && (
						<ul>
							{pendingMemberList.map((item) => (
								<PendingMemberList key={item.id} item={item} />
							))}
						</ul>
					)}

					{(!pendingMemberList || pendingMemberList.length === 0) && (
						<div className="h-40 flex flex-col gap-3.25 items-center justify-center text-center">
							<img src={noSearchData} alt="noSearchData" className="w-11.25 h-11.5" />
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
								팀 가입 요청이 없어요
							</Typography>
						</div>
					)}
				</section>

				{pendingMemberList && (
					<Pagination
						currentPage={pendingCurrentPage}
						totalCount={pendingMemberList.length}
						size={size}
						onPageChange={setPendingCurrentPage}
						variant="large"
						className="mb-6"
					/>
				)}

				<div className="flex gap-1.5 px-[18px] my-3">
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
						{teamMemberList?.teamName}
					</Typography>
					<Typography as="span" variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
						{teamMemberList?.teamUsers.length}
					</Typography>
				</div>

				<section className="bg-white rounded-[20px] mb-5.5 py-2.75 px-4.5 mx-4.5 ">
					{teamMemberList && teamMemberList.teamUsers.length > 0 && (
						<ul>
							{teamMemberList.teamUsers.map((item) => (
								<TeamMemberList key={item.teamUserId} item={item} />
							))}
						</ul>
					)}
					{(!teamMemberList || teamMemberList.teamUsers.length === 0) && (
						<div className="h-40 flex flex-col gap-3.25 items-center justify-center text-center">
							<img src={noInquiryData} alt="noInquiryData" className="w-10 h-11" />
							<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray07}>
								아직 팀원이 없어요
							</Typography>
						</div>
					)}
				</section>

				{/* 팀원 리스트 페이지네이션 */}
				{teamMemberList && (
					<Pagination
						currentPage={approvedCurrentPage}
						totalCount={teamMemberList.totalCount}
						size={size}
						onPageChange={setApprovedCurrentPage}
						variant="large"
					/>
				)}
			</div>
		</>
	);
};

export default TeamAdminPage;
