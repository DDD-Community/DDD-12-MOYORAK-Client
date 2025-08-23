import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from '@/apis';

interface IVoteRequest {
	candidateId: number;
}

interface IVoteResponse {
	voteRecordId: number;
	candidateId: number;
	votedAt: string;
}

const postVote = async (teamId: number, partyId: number, voteId: number, request: IVoteRequest): Promise<IVoteResponse> => {
	return await post<IVoteResponse>(`/teams/${teamId}/parties/${partyId}/votes/${voteId}/records`, request);
};

export const useMutationVote = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ teamId, partyId, voteId, candidateId }: { teamId: number; partyId: number; voteId: number; candidateId: number }) =>
			postVote(teamId, partyId, voteId, { candidateId }),
		onSuccess: (_, { teamId, partyId }) => {
			queryClient.invalidateQueries({ queryKey: ['pot', 'detail', teamId.toString(), partyId.toString()] });
			queryClient.invalidateQueries({ queryKey: ['pots', teamId.toString()] });
			queryClient.invalidateQueries({ queryKey: ['participants', teamId.toString(), partyId.toString()] });
		},
	});
};
