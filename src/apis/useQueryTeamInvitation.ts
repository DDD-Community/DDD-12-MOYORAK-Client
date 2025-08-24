import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface IGetTeamInvitationResponse {
	companyId: number;
	companyName: string;
	teamId: number;
	teamName: string;
}

const getTeamInvitation = async (teamId: number, token: string): Promise<IGetTeamInvitationResponse> => {
	return await get<IGetTeamInvitationResponse>(`/teams/${teamId}/invitation/${token}`);
};

export const useQueryTeamInvitation = (teamId: number, token: string, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'invitation', token],
		enabled,
		queryFn: () => getTeamInvitation(teamId, token),
	});
};
