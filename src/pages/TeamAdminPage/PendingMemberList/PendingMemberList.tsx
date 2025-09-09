import { toast } from 'sonner';

import { useMutationApproveTeamMember } from '@/apis/useMutationApproveTeamMember';
import { useMutationRejectTeamMember } from '@/apis/useMutationRejectTeamMember';
// import type { IGetTeamMemberItem } from '@/apis/useQueryTeamMember';
import FilterButton from '@/components/FilterButton/FilterButton';
import Typography from '@/components/Typography';
import { FONT_VARIANT, PALETTE } from '@/constants/styles';

interface IPendingMemberListProps {
	item: any;
}

const PendingMemberList = ({ item }: IPendingMemberListProps) => {
	const teamId = localStorage.getItem('teamId');

	const { mutate: mutateApprove } = useMutationApproveTeamMember();
	const { mutate: mutateReject } = useMutationRejectTeamMember();

	const handleApprove = () => {
		if (teamId) {
			mutateApprove(
				{ teamId, teamMemberId: item.teamUserId.toString() },
				{
					onSuccess: () => {
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
						toast.success('승인이 거절되었습니다.');
					},
				}
			);
		}
	};

	return (
		<li key={item.teamUserId}>
			<div className="flex items-center justify-between py-3.75 border-b border-gray-02">
				<div className="flex items-center gap-2">
					<img src={item.profileImage} alt="프로필" className="w-8.5 h-8.5 rounded-full object-cover" />
					<div>
						<Typography variant={FONT_VARIANT.body01} fontColor={PALETTE.gray10} className="font-semibold">
							{item.name}
						</Typography>
						<Typography variant={FONT_VARIANT.caption02} fontColor={PALETTE.gray07}>
							{item.email}
						</Typography>
					</div>
				</div>

				<div className="flex gap-1 ml-auto">
					<FilterButton variant="active" onClick={handleApprove} borderRadius="8.75">
						승인
					</FilterButton>

					<FilterButton variant="general" onClick={handleReject} borderRadius="8.75">
						거절
					</FilterButton>
				</div>
			</div>
		</li>
	);
};

export default PendingMemberList;
