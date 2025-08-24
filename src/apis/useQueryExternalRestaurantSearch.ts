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
	longitude: number = 127.043616,
	latitude: number = 37.279838,
	radius: number = 2000,
	page: number = 1,
	size: number = 15
) => {
	return useQuery({
		queryKey: ['external', 'restaurants', query, longitude, latitude, radius, page, size],
		queryFn: () =>
			get<INewRestaurantSelectResponse>(
				`/restaurants/external/search?query=${query}&longitude=${longitude}&latitude=${latitude}&radius=${radius}&page=${page}&size=${size}`
			),
		enabled: !!query,
	});
};
