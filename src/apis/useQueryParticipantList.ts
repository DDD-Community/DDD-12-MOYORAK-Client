import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface IParticipantResponse {
	userId: number;
	userName: string;
	profileImage: string;
	mealTags: {
		dislikes: string[];
		allergies: string[];
	};
}

export const useQueryParticipantList = (teamId: string, partyId: string) => {
	return useQuery({
		queryKey: ['participants', teamId, partyId],
		queryFn: () => get<IParticipantResponse[]>(`/teams/${teamId}/parties/${partyId}/party-attendees`),
		enabled: !!teamId && !!partyId,
	});
};
