import { useQuery } from '@tanstack/react-query';

import { get } from './index';

interface IPotDetailResponse {
	id: number;
	title: string;
	content: string;
	attendable: boolean;
	attended: boolean;
	vote: {
		id: number;
		voteType: string;
		voteStatus: string;
		randomSelectedCandidateId: number | null;
		mealDate: string;
		startDate: string;
		expiredDate: string;
		randomDate: string;
	};
	candidates: Array<{
		candidateId: number;
		teamRestaurantId: number;
		restaurantName: string;
		restaurantCategory: string;
		averageReviewScore: number;
		reviewCount: number;
		reviewImagePath: string;
	}>;
	voters: Array<{
		userId: number;
		candidateId: number;
		name: string;
		profileImageUrl: string;
	}>;
}

export const useQueryPotDetail = (teamId: string, partyId: string) => {
	return useQuery({
		queryKey: ['pot', 'detail', teamId, partyId],
		queryFn: () => get<IPotDetailResponse>(`/teams/${teamId}/parties/${partyId}`),
		enabled: !!teamId && !!partyId,
	});
};
