import { useMutation } from '@tanstack/react-query';
import { put } from '.';
import type { IUserSignUpResponse } from './useMutationAuthSignUp';

interface IMeMeatlTagsRequest extends IUserSignUpResponse {
	details: {
		type: 'DISLIKE' | 'ALLERGY';
		item: string;
	}[];
}

const putMeMealTags = async (request: IMeMeatlTagsRequest) => {
	return await put('/me/meal/tags', request);
};

export const useMutationMeMealTags = () =>
	useMutation<any, Error, IMeMeatlTagsRequest>({
		mutationKey: ['me', 'meal', 'tags'],
		mutationFn: putMeMealTags,
	});
