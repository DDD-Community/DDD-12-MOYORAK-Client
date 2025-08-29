import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export interface ITeamRestaurantLocationItem {
	teamRestaurantId: number;
	name: string;
	longitude: number;
	latitude: number;
}

interface ITeamRestaurantLocationResponse {
	locations: ITeamRestaurantLocationItem[];
}

const getRestaurantLocation = async (teamId: number): Promise<ITeamRestaurantLocationResponse> => {
	return await get<ITeamRestaurantLocationResponse>(`/teams/${teamId}/restaurants/locations`);
};

export const useQueryTeamRestaurantsLocations = (teamId: number, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'restaurants', 'locations'],
		enabled,
		queryFn: () => getRestaurantLocation(teamId),
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: true,
	});
};
