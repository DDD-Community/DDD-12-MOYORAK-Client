import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from './index';

interface INewRestaurantRegistrationRequest {
	placeUrl: string;
	name: string;
	address: string;
	roadAddress: string;
	category: string;
	longitude: number;
	latitude: number;
}

interface IAddRestaurantResponse {
	restaurantId: string;
}

export const useMutationAddRestaurant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: INewRestaurantRegistrationRequest) => post<IAddRestaurantResponse>('/restaurants', data),
		onSuccess: () => {
			// 식당 목록 관련 쿼리들을 무효화하여 최신 데이터를 가져오도록 함
			queryClient.invalidateQueries({ queryKey: ['restaurants'] });
			queryClient.invalidateQueries({ queryKey: ['teamRestaurants'] });
		},
	});
};
