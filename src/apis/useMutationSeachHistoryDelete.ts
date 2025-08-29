import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from '.';

const deleteSearchHistoryDelete = async (teamId: number, searchHistoryId: number): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/me/search-history/${searchHistoryId}`);
};

export const useMutationSeachHistoryDelete = (teamId: number, searchHistoryId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['team', teamId, 'team-members', 'me', 'search-history', searchHistoryId],
		mutationFn: () => deleteSearchHistoryDelete(teamId, searchHistoryId),
		onSuccess: () => {
			// 검색 기록 쿼리 무효화하여 리스트 자동 업데이트
			queryClient.invalidateQueries({
				queryKey: ['teams', teamId, 'team-members', 'me', 'search-history'],
			});
		},
	});
};
