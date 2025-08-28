import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface IReviewListResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: Array<{
		id: number;
		extraText: string;
		score: number;
		servingTime: number;
		waitingTime: number;
		userNickname: string;
		userProfileImageUrl: string;
		photoUrls: string[];
		createdDate: string;
		userId: string;
	}>;
}

export const useQueryReviewList = (teamId: string, teamRestaurantId: string) => {
	return useQuery({
		queryKey: ['reviews', teamId, teamRestaurantId],
		queryFn: () => get<IReviewListResponse>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews?currentPage=1&size=5`),
		enabled: !!teamId && !!teamRestaurantId,
		staleTime: 0,
		gcTime: 0,
	});
};
