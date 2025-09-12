import { useQuery } from '@tanstack/react-query';

import { get } from '.';

interface MyReview {
	id: number;
	extraText: string;
	score: number;
	servingTime: string;
	waitingTime: string;
	userId: number;
	userNickname: string;
	userProfileImageUrl: string;
	photoUrls: string[];
	createdDate: string;
	teamRestaurantId: string;
	teamRestaurantName: string;
	isDeletedTeamRestaurantReview: boolean;
}

interface MyReviewsResponse {
	size: number;
	currentPage: number;
	totalCount: number;
	data: MyReview[];
}

const getMyReviews = async (size: number = 5, currentPage: number = 1): Promise<MyReviewsResponse> => {
	return await get<MyReviewsResponse>(`/me/reviews?size=${size}&currentPage=${currentPage}`);
};

export const useQueryMyReviews = (size: number = 5, currentPage: number = 1) => {
	return useQuery({
		queryKey: ['my-reviews', size, currentPage],
		queryFn: () => getMyReviews(size, currentPage),
		enabled: true,
	});
};
