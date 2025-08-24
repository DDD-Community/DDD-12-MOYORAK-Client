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
			// 레스토랑 관련 쿼리들을 무효화하여 최신 데이터를 가져오도록 함
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'detail', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'photos', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['reviews'] });
		},
	});
};
