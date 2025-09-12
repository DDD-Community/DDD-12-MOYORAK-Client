import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from './index';

export interface ITeamRestaurantUpdateRequest {
	summary: string;
}

export const useMutationUpdateTeamRestaurant = (teamId: string, teamRestaurantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ITeamRestaurantUpdateRequest) => put(`/teams/${teamId}/restaurants/${teamRestaurantId}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['restaurant', 'detail', teamId, teamRestaurantId],
			});
			queryClient.invalidateQueries({
				queryKey: ['team', 'restaurants', teamId],
			});
			queryClient.invalidateQueries({
				queryKey: ['team', 'restaurant', 'detail', teamId, teamRestaurantId],
			});
		},
	});
};
