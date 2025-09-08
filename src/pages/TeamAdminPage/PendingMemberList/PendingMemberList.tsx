import { useState } from 'react';
import { toast } from 'sonner';

import { useMutationApproveTeamMember } from '@/apis/useMutationApproveTeamMember';
import { useMutationRejectTeamMember } from '@/apis/useMutationRejectTeamMember';
import type { IGetTeamMemberItem } from '@/apis/useQueryTeamMember';
import defaultProfile from '@/assets/defaultProfile.png';
import Button from '@/components/Button/Button';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IPendingMemberListProps {
	item: IGetTeamMemberItem;
}

const PendingMemberList = ({ item }: IPendingMemberListProps) => {
	const teamId = localStorage.getItem('teamId');
	const [isApproved, setIsApproved] = useState(false);
	const [isRejected, setIsRejected] = useState(false);

	const { mutate: mutateApprove } = useMutationApproveTeamMember();
	const { mutate: mutateReject } = useMutationRejectTeamMember();

	const handleApprove = () => {
		if (teamId) {
			mutateApprove(
				{ teamId, teamMemberId: item.teamUserId.toString() },
				{
					onSuccess: () => {
						setIsApproved(true);
						toast.success('승인이 완료되었습니다.');
					},
				}
			);
		}
	};

	const handleReject = () => {
		if (teamId) {
			mutateReject(
				{ teamId, teamMemberId: item.teamUserId.toString() },
				{
					onSuccess: () => {
						setIsRejected(true);
						toast.success('승인이 거절되었습니다.');
					},
				}
			);
		}
	};

	return (
		<li key={item.teamUserId}>
			<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
				{/* 이미지와 텍스트 그룹 */}
				<div className="flex items-center gap-4">
					<img src={item.profileImage || defaultProfile} alt="프로필" className="w-12 h-12 rounded-full object-cover" />
					<div>
						<Typography variant={FONT_VARIANT.body01}>{item.name}</Typography>
						<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07}>
							{item.email}
						</Typography>
					</div>
				</div>

				<div className="flex gap-1 ml-auto">
					<Button
						variant={isApproved ? 'active' : 'active'}
						className={`!w-[53px] !min-w-0 ${isApproved ? 'bg-green-500' : ''}`}
						onClick={handleApprove}
						disabled={isApproved || isRejected}
					>
						{isApproved ? '✓' : '승인'}
					</Button>
					<Button
						variant={isRejected ? 'general' : 'general'}
						className={`!w-[53px] !min-w-0 ${isRejected ? 'bg-gray-400' : ''}`}
						onClick={handleReject}
						disabled={isApproved || isRejected}
					>
						{isRejected ? '✓' : '거절'}
					</Button>
				</div>
			</div>
		</li>
	);
};

export default PendingMemberList;
