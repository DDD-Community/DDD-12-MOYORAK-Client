import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface ISearchTeamResponse {
	teams: string[];
}

const getSearchTeam = async (companyId: number, team: string): Promise<ISearchTeamResponse> => {
	return await get<ISearchTeamResponse>(`/companies/${companyId}`, { name: team });
};

export const useQuerySearchTeam = (companyId: number, team: string, enabled = true) => {
	return useQuery({
		queryKey: ['companies'],
		enabled,
		queryFn: () => getSearchTeam(companyId, team),
	});
};
