import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from './index';

interface IReviewRegistrationRequest {
	userId: number;
	servingTimeId: number;
	waitingTimeId: number;
	score: number;
	photoPaths: string[];
	extraText: string;
}

interface IAddReviewResponse {
	reviewId: string;
}

export const useMutationAddReview = (teamId: string, teamRestaurantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: IReviewRegistrationRequest) => post<IAddReviewResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reviews', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['team', 'restaurants', teamId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'detail', teamId, teamRestaurantId] });
			queryClient.invalidateQueries({ queryKey: ['restaurant', 'photos', teamId, teamRestaurantId] });
		},
	});
};
