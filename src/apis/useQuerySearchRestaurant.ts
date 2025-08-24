import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface ISearchRestaurantRequest {
	size: number;
	currentPage: number;
	keyword: string;
	sortOption: string;
}

export interface ISearchRestaurantList {
	teamRestaurantId: number;
	restaurantName: string;
	restaurantCategory: string;
	averageReviewScore: number;
	reviewCount: number;
	reviewImagePath: string;
}

interface ISearchRestaurantResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: ISearchRestaurantList[];
}

const getSearchRestaurant = async (teamId: number, request: ISearchRestaurantRequest): Promise<ISearchRestaurantResponse> => {
	return await get<ISearchRestaurantResponse>(`/teams/${teamId}/restaurants/search`, request);
};

export const useQuerySearchRestaurant = (teamId: number, request: ISearchRestaurantRequest, enabled = true) => {
	return useQuery<ISearchRestaurantResponse, Error>({
		queryKey: ['teams', teamId, 'restaurants', 'search', request],
		queryFn: () => getSearchRestaurant(teamId, request),
		enabled,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
