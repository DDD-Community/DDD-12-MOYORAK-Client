import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export const SORTING_TYPE = {
	DISTANCE: 'DISTANCE',
	RATING: 'RATING',
	RECENT: 'RECENT',
	NAME: 'NAME',
} as const;

type TSortingType = keyof typeof SORTING_TYPE;

interface ITeamRestaurantListRequest {
	size: number;
	currentPage: number;
	sortOption: TSortingType;
}

export interface ITeamRestaurantItem {
	teamRestaurantId: number;
	restaurantName: string;
	restaurantCategory: string;
	averageReviewScore: number;
	reviewCount: number;
	reviewImagePath: string;
}

interface ITeamRestaurantListResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: ITeamRestaurantItem[];
}

const getSearchTeam = async (teamId: number, teamRestaurantListRequest: ITeamRestaurantListRequest): Promise<ITeamRestaurantListResponse> => {
	return await get<ITeamRestaurantListResponse>(`/teams/${teamId}/restaurants`, teamRestaurantListRequest);
};

export const useQueryTeamRestaurantList = (teamId: number, teamRestaurantListRequest: ITeamRestaurantListRequest, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'restaurants'],
		enabled,
		queryFn: () => getSearchTeam(teamId, teamRestaurantListRequest),
	});
};
``;
