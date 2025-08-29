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
			// 관련 쿼리들 무효화하여 새로고침
			queryClient.invalidateQueries({
				queryKey: ['team', 'restaurants', teamId],
			});
			queryClient.invalidateQueries({
				queryKey: ['team', 'restaurant', 'detail', teamId, teamRestaurantId],
			});
			queryClient.invalidateQueries({
				queryKey: ['reviews', teamId],
			});
		},
	});
};
