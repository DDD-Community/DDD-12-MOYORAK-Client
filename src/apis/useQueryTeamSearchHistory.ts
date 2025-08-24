import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export interface ISearchItem {
	id: number;
	keyword: string;
	createdDate: string;
}

interface IGetTeamSearchHistoryResponse {
	searchHistories: ISearchItem[];
}

const getTeamSearchHistory = async (teamId: number): Promise<IGetTeamSearchHistoryResponse> => {
	return await get<IGetTeamSearchHistoryResponse>(`/teams/${teamId}/team-members/me/search-history`);
};

export const useQueryTeamSearchHistory = (teamId: number, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'team-members', 'me', 'search-history'],
		enabled,
		queryFn: () => getTeamSearchHistory(teamId),
	});
};
