import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface ITeamMembersResponse {
	userId: number;
	name: string;
	state: 'OFF' | 'ON';
}

export const useQueryTeamMembers = (teamId: string) => {
	return useQuery({
		queryKey: ['team', 'members', teamId],
		queryFn: () => get<ITeamMembersResponse[]>(`/teams/${teamId}/parties/users`),
		enabled: !!teamId,
	});
};
