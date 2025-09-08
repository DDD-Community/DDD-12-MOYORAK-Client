import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '.';

const kickTeamMember = async (teamId: string, teamMemberId: string): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/${teamMemberId}`);
};

export const useMutationKickTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['kick-team-member'],
		mutationFn: ({ teamId, teamMemberId }: { teamId: string; teamMemberId: string }) => kickTeamMember(teamId, teamMemberId),
		onSuccess: () => {
			// 팀 멤버 관련 쿼리 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
		},
	});
};
