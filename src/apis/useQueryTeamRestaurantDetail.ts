import { useQuery } from '@tanstack/react-query';

import { get } from './index';

export interface ITeamRestaurantDetail {
	name: string;
	restaurantCategory: string;
	summary: string;
	placeUrl: string;
	servingTime: string;
	waitingTime: string;
	reviewCount: number;
	score: number;
}

export const useQueryTeamRestaurantDetail = (teamId: string, teamRestaurantId: string) => {
	return useQuery({
		queryKey: ['team', 'restaurant', 'detail', teamId, teamRestaurantId],
		queryFn: () => get<ITeamRestaurantDetail>(`/teams/${teamId}/restaurants/${teamRestaurantId}`),
		enabled: !!teamId && !!teamRestaurantId,
	});
};
