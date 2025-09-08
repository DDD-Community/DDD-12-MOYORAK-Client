import { useQuery } from '@tanstack/react-query';

import { get } from '.';

export const TEAM_MEMBER_STATUS = {
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
	WITHDRAWN: 'WITHDRAWN',
} as const;

type TTeamMemberStatus = keyof typeof TEAM_MEMBER_STATUS;

interface IGetTeamInvitationRequest {
	status: TTeamMemberStatus;
	size?: number;
	currentPage?: number;
}

export interface IGetTeamMemberItem {
	teamUserId: number;
	name: string;
	email: string;
	profileImage: string;
	status: TTeamMemberStatus;
}

interface IGetTeamMemberResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	teamName: string;
	teamUsers: IGetTeamMemberItem[];
}

const getTeamMemberList = async (teamId: number, request: IGetTeamInvitationRequest): Promise<IGetTeamMemberResponse> => {
	return await get<IGetTeamMemberResponse>(`/teams/${teamId}/team-members`, request);
};

export const useQueryTeamMember = (teamId: number, request: IGetTeamInvitationRequest, enabled = true) => {
	return useQuery({
		queryKey: ['teams', teamId, 'team-members', request.status, request.currentPage],
		enabled,
		queryFn: () => getTeamMemberList(teamId, request),
	});
};
