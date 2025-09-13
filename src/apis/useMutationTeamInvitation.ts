import { useMutation } from '@tanstack/react-query';

import { post } from '.';

interface IPostTeamInvitationResponse {
	invitationToken: string;
}

const postTeamInvitation = async (teamId: number): Promise<IPostTeamInvitationResponse> => {
	return await post<IPostTeamInvitationResponse>(`/teams/${teamId}/invitation`);
};

export const useMutationTeamInvitation = (teamId: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'invitation'],
		mutationFn: postTeamInvitation,
	});
