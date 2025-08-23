import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from './index';

interface IPotMakeRequest {
	title: string;
	isUserSelected: boolean;
	users: {
		ids: {
			userId: number;
		}[];
	};
	restaurants: {
		ids: {
			restaurantId: number;
		}[];
	};
	voteType: 'SELECT' | 'RANDOM';
	fromTime: string;
	toTime: string;
	mealTime: string;
	content: string;
	attendable: boolean;
}

interface IPotMakeResponse {
	success: boolean;
	message: string;
}

export const useMutationMakeParty = (teamId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (request: IPotMakeRequest) => post<IPotMakeResponse>(`/teams/${teamId}/parties`, request),
		onSuccess: () => {
			// 팟 관련 쿼리들을 무효화하여 최신 데이터를 가져오도록 함
			queryClient.invalidateQueries({ queryKey: ['pots'] });
			queryClient.invalidateQueries({ queryKey: ['teams', teamId] });
		},
	});
};
