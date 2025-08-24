import { useMutation } from '@tanstack/react-query';

import { put } from '.';

const putTeamMemberApprove = async (teamId: number, teamMemberId: number): Promise<unknown> => {
	return await put<unknown>(`/team/${teamId}/team-members/${teamMemberId}/approve`);
};

export const useMutationTeamMemberApprove = (teamId: number, teamMemberid: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', teamMemberid, 'approve'],
		mutationFn: () => putTeamMemberApprove(teamId, teamMemberid),
	});
