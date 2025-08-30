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
			queryClient.invalidateQueries({ queryKey: ['restaurants'] });
			queryClient.invalidateQueries({ queryKey: ['teamRestaurants'] });
			queryClient.invalidateQueries({ queryKey: ['team', 'restaurants'] });
		},
	});
};
