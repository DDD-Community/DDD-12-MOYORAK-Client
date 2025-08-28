import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export interface IViewHistoryItem {
	viewHistoryId: number;
	teamRestaurantId: number;
	restaurantName: string;
	restaurantCategory: string;
	averageReviewScore: number;
	reviewCount: number;
	reviewImagePath: string;
}

interface IGetTeamViewHistoryResponse {
	viewHistories: IViewHistoryItem[];
}

const getTeamViewHistory = async (teamId: number): Promise<IGetTeamViewHistoryResponse> => {
	return await get<IGetTeamViewHistoryResponse>(`/teams/${teamId}/team-members/me/view-history`);
};

export const useQueryTeamViewHistory = (teamId: number, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'team-members', 'me', 'view-history'],
		enabled,
		queryFn: () => getTeamViewHistory(teamId),
		staleTime: 0,
		gcTime: 0,
	});
};
