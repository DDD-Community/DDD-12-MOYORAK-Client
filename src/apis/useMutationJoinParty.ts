import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from './index';

interface JoinPartyResponse {
	success: boolean;
	message: string;
}

export const useMutationJoinParty = (teamId: string, partyId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => post<JoinPartyResponse>(`/teams/${teamId}/parties/${partyId}`),
		onSuccess: () => {
			// 팟 관련 쿼리들을 무효화하여 최신 데이터를 가져오도록 함
			queryClient.invalidateQueries({ queryKey: ['parties'] });
			queryClient.invalidateQueries({ queryKey: ['party', partyId] });
			queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
		},
	});
};
