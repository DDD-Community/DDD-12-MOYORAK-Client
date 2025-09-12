import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface RestaurantDetail {
	id: number;
	name: string;
	summary: string;
	placeUrl: string;
	servingTime: number;
	waitingTime: number;
	reviewCount: number;
	score: number;
	restaurantCategory: string;
	photoPath: string;
}

interface RestaurantPhotos {
	size: number;
	currentPage: number;
	totalCount: number;
	data: Array<{
		path: string;
	}>;
}

export const useQueryRestaurantDetail = (teamId: string, teamRestaurantId: string) => {
	return useQuery({
		queryKey: ['restaurant', 'detail', teamId, teamRestaurantId],
		queryFn: () => get<RestaurantDetail>(`/teams/${teamId}/restaurants/${teamRestaurantId}`),
		enabled: !!teamId && !!teamRestaurantId,
	});
};

export const useQueryRestaurantPhotos = (teamId: string, teamRestaurantId: string) => {
	return useQuery({
		queryKey: ['restaurant', 'photos', teamId, teamRestaurantId],
		queryFn: () => get<RestaurantPhotos>(`/teams/${teamId}/restaurants/${teamRestaurantId}/reviews/photos?currentPage=1&size=10`),
		enabled: !!teamId && !!teamRestaurantId,
	});
};
