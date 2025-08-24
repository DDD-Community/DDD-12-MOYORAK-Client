import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface ITeamRestaurantResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: Array<{
		teamRestaurantId: number;
		restaurantName: string;
		restaurantCategory: string;
		averageReviewScore: number;
		reviewCount: number;
		reviewImagePath: string;
	}>;
}

export const useQueryTeamRestaurantList = (teamId: string, sortOption: string, size: number = 100, currentPage: number = 1) => {
	return useQuery({
		queryKey: ['team', 'restaurants', teamId, sortOption, size, currentPage],
		queryFn: () => get<ITeamRestaurantResponse>(`/teams/${teamId}/restaurants?size=${size}&currentPage=${currentPage}&sortOption=${sortOption}`),
		enabled: !!teamId && !!sortOption,
	});
};
