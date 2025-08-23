import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface IRestaurant {
	restaurantId: number;
	restaurantName: string;
	roadAddress: string;
}

interface IRestaurantResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: IRestaurant[];
}

export const useQueryRestaurantSearch = (keyword: string, size: number = 100, currentPage: number = 1) => {
	return useQuery({
		queryKey: ['restaurants', 'search', keyword, size, currentPage],
		queryFn: () => get<IRestaurantResponse>(`/restaurants/search?keyword=${keyword}&size=${size}&currentPage=${currentPage}`),
		enabled: !!keyword.trim(),
	});
};
