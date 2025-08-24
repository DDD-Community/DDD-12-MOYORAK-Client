import { useMutationTeamMemberApprove } from '@/apis/useMutationTeamMemberApprove';
import { useMutationTeamMemberReject } from '@/apis/useMutationTeamMemberReject';
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

	const { mutate: mutateApprove } = useMutationTeamMemberApprove(Number(teamId), item.teamUserId);
	const { mutate: mutateReject } = useMutationTeamMemberReject(Number(teamId), item.teamUserId);

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
					<Button variant="active" className="!w-[53px] !min-w-0" onClick={mutateApprove}>
						승인
					</Button>
					<Button className="!w-[53px] !min-w-0" onClick={mutateReject}>
						거절
					</Button>
				</div>
			</div>
		</li>
	);
};

export default PendingMemberList;
