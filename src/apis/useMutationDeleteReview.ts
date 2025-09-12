import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from './index';

interface DeleteReviewResponse {
	success: boolean;
	message: string;
}

interface DeleteReviewParams {
	reviewId: string;
	teamRestaurantId: string;
}

export const useMutationDeleteReview = (teamId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ reviewId, teamRestaurantId }: DeleteReviewParams) =>
			del<DeleteReviewResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews/${reviewId}`),
		onSuccess: (_, { teamRestaurantId }) => {
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'detail', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'photos', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['reviews', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
		},
	});
};
