import { useMutation } from '@tanstack/react-query';

import { del } from '.';

const deleteViewHistoryDelete = async (teamId: number, viewHistoryId: number): Promise<unknown> => {
	return await del<unknown>(`/team/${teamId}/team-members/me/view-history/${viewHistoryId}`);
};

export const useMutationViewHistoryDelete = (teamId: number, viewHistoryId: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', 'me', 'view-history', viewHistoryId],
		mutationFn: () => deleteViewHistoryDelete(teamId, viewHistoryId),
	});
