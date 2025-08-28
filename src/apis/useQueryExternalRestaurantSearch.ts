import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface INewRestaurantSelect {
	name: string;
	placeUrl: string;
	address: string;
	roadAddress: string;
	longitude: number;
	latitude: number;
}

interface INewRestaurantSelectResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: INewRestaurantSelect[];
}

export const useQueryExternalRestaurantSearch = (
	query: string,
	longitude: number,
	latitude: number,
	radius: number = 2000,
	page: number = 1,
	size: number = 5
) => {
	return useQuery({
		queryKey: ['external', 'restaurants', query, longitude, latitude, radius, page, size],
		queryFn: () =>
			get<INewRestaurantSelectResponse>(
				`/restaurants/external/search?query=${query}&longitude=${longitude}&latitude=${latitude}&radius=${radius}&page=${page}&size=${size}`
			),
		enabled: !!query && longitude !== 0 && latitude !== 0,
		staleTime: 0,
		gcTime: 0,
	});
};
