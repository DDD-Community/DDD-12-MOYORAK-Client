import { useMutation } from '@tanstack/react-query';

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

export const useMutationVote = () =>
	useMutation({
		mutationFn: ({ teamId, partyId, voteId, candidateId }: { teamId: number; partyId: number; voteId: number; candidateId: number }) =>
			postVote(teamId, partyId, voteId, { candidateId }),
	});
