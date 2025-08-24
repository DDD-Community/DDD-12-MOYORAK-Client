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
	longitude: number = 0, // 기본값 제거, 호출하는 곳에서 전달해야 함
	latitude: number = 0, // 기본값 제거, 호출하는 곳에서 전달해야 함
	radius: number = 2000,
	page: number = 1,
	size: number = 100
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
