import { useMutation } from '@tanstack/react-query';

import { del } from '.';

const deleteSearchHistoryDelete = async (teamId: number, searchHistoryId: number): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/me/search-history/${searchHistoryId}`);
};

export const useMutationSeachHistoryDelete = (teamId: number, searchHistoryId: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', 'me', 'search-history', searchHistoryId],
		mutationFn: () => deleteSearchHistoryDelete(teamId, searchHistoryId),
	});
