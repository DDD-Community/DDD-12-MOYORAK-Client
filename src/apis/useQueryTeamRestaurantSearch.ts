import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface ITeamRestaurantSearchRequest {
	size: number;
	currentPage: number;
	keyword: string;
	sortOption: 'DISTANCE' | 'RATING' | 'RECENT';
}

interface ITeamRestaurantSearchItem {
	teamRestaurantId: number;
	restaurantName: string;
	restaurantCategory: string;
	averageReviewScore: number;
	reviewCount: number;
	reviewImagePath: string;
}

interface ITeamRestaurantSearchResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: ITeamRestaurantSearchItem[];
}

export const useQueryTeamRestaurantSearch = (teamId: string, searchRequest: ITeamRestaurantSearchRequest) => {
	const { size, currentPage, keyword, sortOption } = searchRequest;

	return useQuery({
		queryKey: ['teamRestaurantSearch', teamId, keyword, size, currentPage, sortOption],
		queryFn: () =>
			get<ITeamRestaurantSearchResponse>(
				`/teams/${teamId}/restaurants/search?size=${size}&currentPage=${currentPage}&keyword=${encodeURIComponent(keyword)}&sortOption=${sortOption}`
			),
		enabled: !!teamId && !!keyword.trim(),
		staleTime: 0,
		gcTime: 0,
	});
};
