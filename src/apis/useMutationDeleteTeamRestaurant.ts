import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from './index';

export const useMutationDeleteTeamRestaurant = (teamId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (teamRestaurantId: string) => del(`/teams/${teamId}/restaurants/${teamRestaurantId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['team', 'restaurants', teamId],
			});
		},
	});
};
