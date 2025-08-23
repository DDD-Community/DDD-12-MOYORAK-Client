import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from '@/apis';

interface IAddRestaurantToPartyRequest {
	teamRestaurantId: number;
	voteId: number;
}

interface IAddRestaurantToPartyResponse {
	addedCount: number;
}

const postAddRestaurantToParty = async (teamId: number, partyId: number, request: IAddRestaurantToPartyRequest): Promise<IAddRestaurantToPartyResponse> => {
	return await post<IAddRestaurantToPartyResponse>(`/teams/${teamId}/parties/${partyId}/restaurants`, request);
};

export const useMutationAddRestaurantToParty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ teamId, partyId, teamRestaurantId, voteId }: { teamId: number; partyId: number; teamRestaurantId: number; voteId: number }) =>
			postAddRestaurantToParty(teamId, partyId, { teamRestaurantId, voteId }),
		onSuccess: (_, { teamId, partyId }) => {
			queryClient.invalidateQueries({ queryKey: ['pot', 'detail', teamId.toString(), partyId.toString()] });
			queryClient.invalidateQueries({ queryKey: ['pots', teamId.toString()] });
			queryClient.invalidateQueries({ queryKey: ['team', 'restaurants', teamId.toString()] });
		},
	});
};
