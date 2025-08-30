import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '.';

const deleteViewHistoryDelete = async (teamId: number, viewHistoryId: number): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/me/view-history/${viewHistoryId}`);
};

export const useMutationViewHistoryDelete = (teamId: number, viewHistoryId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['team', teamId, 'team-members', 'me', 'view-history', viewHistoryId],
		mutationFn: () => deleteViewHistoryDelete(teamId, viewHistoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['teams', teamId, 'team-members', 'me', 'view-history'],
			});
		},
	});
};
