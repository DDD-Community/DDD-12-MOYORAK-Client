import { useMutation } from '@tanstack/react-query';

import { put } from '.';

const putTeamMemberRole = async (teamId: number, teamMemberId: number): Promise<unknown> => {
	return await put<unknown>(`/team/${teamId}/team-members/${teamMemberId}/role`, { role: 'TEAM_ADMIN' });
};

export const useMutationTeamMemberRole = (teamId: number, teamMemberid: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', teamMemberid, 'role'],
		mutationFn: () => putTeamMemberRole(teamId, teamMemberid),
	});
