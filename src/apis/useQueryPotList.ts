import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface IPotResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: Array<{
		id: number;
		startDate: string;
		endDate: string;
		title: string;
		voteType: string;
		voteStatus: string;
		attendeeCount: number;
		partyRestaurantResponseList: Array<{
			name: string;
			restaurantCategory: string;
			reviewScore: number;
			reviewCount: number;
		}>;
		userProfileList: string[];
		isParticipating: boolean;
	}>;
}

export const useQueryPotList = (teamId: string, size: number = 5, currentPage: number = 1) => {
	return useQuery({
		queryKey: ['pots', teamId, size, currentPage],
		queryFn: () => get<IPotResponse>(`/teams/${teamId}/parties?size=${size}&currentPage=${currentPage}`),
		enabled: !!teamId,
	});
};
