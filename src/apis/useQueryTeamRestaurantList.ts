import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface ITeamRestaurantListRequest {
	size: number;
	currentPage: number;
	sort;
}

const getSearchTeam = async (teamId: number, team: string): Promise<ITeamRestaurantListRequest> => {
	return await get<ITeamRestaurantListRequest>(`/teams/${teamId}/restaurants`);
};

export const useQuerySearchTeam = (companyId: number, team: string, enabled = true) => {
	return useQuery({
		queryKey: ['companies'],
		enabled,
		queryFn: () => getSearchTeam(companyId, team),
	});
};
