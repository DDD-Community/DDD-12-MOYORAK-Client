import { useState } from 'react';
import { toast } from 'sonner';

import { useMutationKickTeamMember } from '@/apis/useMutationKickTeamMember';
import { useMutationTransferAdminRole } from '@/apis/useMutationTransferAdminRole';
import type { IGetTeamMemberItem } from '@/apis/useQueryTeamMember';
import IconButton from '@/components/Button/IconButton';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface ITeamMemberListProps {
	item: IGetTeamMemberItem;
	isLast?: boolean;
}

const TeamMemberList = ({ item, isLast = false }: ITeamMemberListProps) => {
	const teamId = localStorage.getItem('teamId');
	const [showOption, setShowOption] = useState(false);

	// 강퇴 다이얼로그
	const [openKickDialog, setOpenKickDialog] = useState(false);

	// 권한 양도하기 다이얼로그
	const [openTransferDialog, setOpenTransferDialog] = useState(false);

	const { mutate: mutateRole } = useMutationTransferAdminRole();
	const { mutate: mutateDel } = useMutationKickTeamMember();

	const handleKick = () => {
		if (teamId) {
			mutateDel(
				{ teamId, teamMemberId: item.teamUserId.toString() },
				{
					onSuccess: () => {
						setOpenKickDialog(false);
						toast.success('탈퇴가 완료되었습니다.');
					},
				}
			);
		}
	};

	const handleTransferRole = () => {
		if (teamId) {
			mutateRole(
				{ teamId, teamMemberId: item.teamUserId.toString() },
				{
					onSuccess: () => {
						setOpenTransferDialog(false);
						toast.success('권한이 양도되었습니다.');
					},
				}
			);
		}
	};

	return (
		<div className={`flex items-center justify-between py-3.75 ${!isLast ? 'border-b border-gray-02' : ''}`}>
			{/* 프로필 정보 */}
			<div className="flex items-center gap-2">
				<img src={item.profileImage} alt="프로필 사진" className="w-8.5 h-8.5 rounded-full object-cover" />
				<div>
					<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
						{item.name}
					</Typography>
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
					<div className="absolute right-0 mt-[-20px] w-30 bg-white rounded-b-lg shadow-md z-10">
						<button
							className="w-full text-left px-4 py-2"
							onClick={() => {
								setOpenKickDialog(true);
								setShowOption(false);
							}}
						>
							<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10} className="font-medium">
								탈퇴시키기
							</Typography>
						</button>
						<button
							className="w-full text-left px-4 py-2"
							onClick={() => {
								setOpenTransferDialog(true);
								setShowOption(false);
							}}
						>
							<Typography variant={FONT_VARIANT.label01} fontColor={PALETTE.gray10} className="font-medium">
								권한 양도하기
							</Typography>
						</button>
					</div>
				)}
			</div>

			{/* 탈퇴시키기 모달 */}
			{openKickDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={() => setOpenKickDialog(false)} />

					<div className="relative bg-white rounded-[20px] w-[283px] p-6 shadow-lg">
						<div className="text-center mb-1.75">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								{item.name}님 탈퇴시키기
							</Typography>
						</div>

						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								탈퇴 시킨 후에도 대상자가 원할 경우
								<br />
								다시 가입 승인 요청을 할 수 있어요.
							</Typography>
						</div>

						<div className="flex gap-2 max-w-[283px]">
							<button onClick={() => setOpenKickDialog(false)} className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px]">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleKick} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px]">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									탈퇴시키기
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 권한 양도하기 모달 */}
			{openTransferDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={() => setOpenTransferDialog(false)} />

					<div className="relative bg-white rounded-[20px] w-[283px] p-6 shadow-lg">
						<div className="text-center mb-1.75">
							<Typography variant={FONT_VARIANT.header03} fontColor={PALETTE.gray10} className="font-semibold">
								관리자 권한 양도하기
							</Typography>
						</div>

						<div className="text-center mb-6">
							<Typography variant={FONT_VARIANT.body02} fontColor={PALETTE.gray08}>
								관리자 권한을 양도하면
								<br />팀 관리 기능을 사용할 수 없어요.
							</Typography>
						</div>

						<div className="flex gap-2 max-w-[283px]">
							<button onClick={() => setOpenTransferDialog(false)} className="w-[89px] rounded-[20px] border border-gray-03 bg-white h-[50px]">
								<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray08} className="font-medium">
									취소
								</Typography>
							</button>
							<button onClick={handleTransferRole} className="w-[154px] rounded-[20px] bg-primary-200 h-[50px]">
								<Typography variant={FONT_VARIANT.body01} className="font-semibold text-[#1F2511]">
									양도하기
								</Typography>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TeamMemberList;
