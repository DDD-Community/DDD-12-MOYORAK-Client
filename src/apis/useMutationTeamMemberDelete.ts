import { useMutation } from '@tanstack/react-query';

import { del } from '.';

const deleteTeamMember = async (teamId: number, teamMemberId: number): Promise<unknown> => {
	return await del<unknown>(`/teams/${teamId}/team-members/${teamMemberId}`);
};

export const useMutationTeamMemberDelete = (teamId: number, teamMemberid: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', teamMemberid],
		mutationFn: () => deleteTeamMember(teamId, teamMemberid),
	});
