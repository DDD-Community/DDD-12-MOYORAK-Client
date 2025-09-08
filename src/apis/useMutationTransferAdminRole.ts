import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from '.';

const transferAdminRole = async (teamId: string, teamMemberId: string): Promise<unknown> => {
	return await put<unknown>(`/teams/${teamId}/team-members/${teamMemberId}/role`, { role: 'TEAM_ADMIN' });
};

export const useMutationTransferAdminRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['transfer-admin-role'],
		mutationFn: ({ teamId, teamMemberId }: { teamId: string; teamMemberId: string }) => transferAdminRole(teamId, teamMemberId),
		onSuccess: () => {
			// 팀 멤버 관련 쿼리 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			queryClient.invalidateQueries({ queryKey: ['team-members'] });
		},
	});
};
