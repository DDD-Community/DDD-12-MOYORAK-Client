import { useMutation } from '@tanstack/react-query';

import { put } from '.';

const putTeamMemberReject = async (teamId: number, teamMemberId: number): Promise<unknown> => {
	return await put<unknown>(`/team/${teamId}/team-members/${teamMemberId}/approve`);
};

export const useMutationTeamMemberReject = (teamId: number, teamMemberid: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'team-members', teamMemberid, 'reject'],
		mutationFn: () => putTeamMemberReject(teamId, teamMemberid),
	});
