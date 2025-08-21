import { useMutation } from '@tanstack/react-query';
import { post } from '.';

interface ITeamInvitationResponse {
	invitationToken: string;
}

const postTeamInvitation = async (teamId: number): Promise<ITeamInvitationResponse> => {
	return await post<ITeamInvitationResponse>(`/team/${teamId}/invitation`);
};

export const useMutationTeamInvitation = (teamId: number) =>
	useMutation({
		mutationKey: ['team', teamId, 'invitation'],
		mutationFn: postTeamInvitation,
	});
