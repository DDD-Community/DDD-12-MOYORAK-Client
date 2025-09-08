import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from '.';

const approveTeamMember = async (teamId: string, teamMemberId: string): Promise<unknown> => {
	return await put<unknown>(`/teams/${teamId}/team-members/${teamMemberId}/approve`);
};

export const useMutationApproveTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['approve-team-member'],
		mutationFn: ({ teamId, teamMemberId }: { teamId: string; teamMemberId: string }) => approveTeamMember(teamId, teamMemberId),
		onSuccess: () => {
			// 팀 멤버 관련 쿼리 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
		},
	});
};
