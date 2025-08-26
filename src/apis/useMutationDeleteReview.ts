import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from './index';

interface DeleteReviewResponse {
	success: boolean;
	message: string;
}

export const useMutationDeleteReview = (teamId: string, teamRestaurantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (reviewId: string) => del<DeleteReviewResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews/${reviewId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'detail', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'photos', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['reviews', teamId, teamRestaurantId] });
		},
	});
};
