import { useState } from 'react';

import { useMutationTeamMemberDelete } from '@/apis/useMutationTeamMemberDelete';
import { useMutationTeamMemberRole } from '@/apis/useMutationTeamMemberRole';
import type { IGetTeamMemberItem } from '@/apis/useQueryTeamMember';
import defaultProfile from '@/assets/defaultProfile.png';
import Button from '@/components/Button/Button';
import IconButton from '@/components/Button/IconButton';
import CustomDialog from '@/components/Dialog/CustomDialog';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ITeamMemberListProps {
	item: IGetTeamMemberItem;
}

const TeamMemberList = ({ item }: ITeamMemberListProps) => {
	const teamId = localStorage.getItem('teamId');
	const [showOption, setShowOption] = useState(false);

	// 강퇴 다이얼로그
	const [openKickDialog, setOpenKickDialog] = useState(false);

	// 권한 양도하기 다이얼로그
	const [openTransferDialog, setOpenTransferDialog] = useState(false);

	const { mutate: mutateRole } = useMutationTeamMemberRole(Number(teamId), item.teamUserId);
	const { mutate: mutateDel } = useMutationTeamMemberDelete(Number(teamId), item.teamUserId);

	return (
		<div className="relative p-4 rounded-lg flex items-center justify-between">
			{/* 프로필 정보 */}
			<div className="flex items-center gap-3">
				<img src={item.profileImage || defaultProfile} alt="프로필 사진" className="w-12 h-12 rounded-full object-cover" />
				<div>
					<Typography variant={FONT_VARIANT.body01}>{item.name}</Typography>
					<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07}>
						{item.email}
					</Typography>
				</div>
			</div>

			{/* More 버튼 */}
			<div className="relative">
				<IconButton
					iconStyle={{
						name: 'more',
						width: 24,
						height: 24,
					}}
					onClick={() => setShowOption(!showOption)}
				/>

				{/* 옵션 메뉴 */}
				{showOption && (
					<div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-10">
						<button
							className="w-full text-left px-4 py-2 hover:bg-gray-100"
							onClick={() => {
								setOpenKickDialog(true);
								setShowOption(false);
							}}
						>
							<Typography variant={FONT_VARIANT.label01}>탈퇴시키기</Typography>
						</button>
						<button
							className="w-full text-left px-4 py-2 hover:bg-gray-100"
							onClick={() => {
								setOpenTransferDialog(true);
								setShowOption(false);
							}}
						>
							<Typography variant={FONT_VARIANT.label01}>권한 양도하기</Typography>
						</button>
					</div>
				)}
			</div>

			{/* 탈퇴시키기 모달 */}
			<CustomDialog
				className="w-[283px]"
				onOpen={openKickDialog}
				onOpenChange={setOpenKickDialog}
				headerText={{
					title: `${item.name}님 탈퇴시키기`,
					description: (
						<>
							탈퇴 시킨 후에도 대상자가 원할 경우 <br />
							다시 가입 승인 요청을 할 수 있어요.
						</>
					),
				}}
			>
				<div className="flex mx-auto mt-6">
					<Button className="w-[89px]" onClick={() => setOpenKickDialog(false)}>
						취소
					</Button>
					<Button variant="active" className="w-[150px]" onClick={mutateDel}>
						탈퇴시키기
					</Button>
				</div>
			</CustomDialog>

			{/* 권한 양도하기 모달 */}
			<CustomDialog
				className="w-[283px]"
				onOpen={openTransferDialog}
				onOpenChange={setOpenTransferDialog}
				headerText={{
					title: '관리자 권한 양도하기',
					description: (
						<>
							관리자 권한을 양도하면
							<br />팀 관리 기능을 사용할 수 없어요.
						</>
					),
				}}
			>
				<div className="flex mx-auto mt-6">
					<Button className="w-[89px]" onClick={() => setOpenTransferDialog(false)}>
						취소
					</Button>
					<Button variant="active" className="w-[150px]" onClick={mutateRole}>
						양도하기
					</Button>
				</div>
			</CustomDialog>
		</div>
	);
};

export default TeamMemberList;
