import { useMutation } from '@tanstack/react-query';
import { post } from '.';

interface ISaveCompanyRequest {
	name: string;
	address: string;
	addressDetail: string;
	longitude: number;
	latitude: number;
}

const postCompany = async (request: ISaveCompanyRequest) => {
	return await post('/me/meal/tags', request);
};

export const useMutationMeMealTags = () =>
	useMutation<any, Error, ISaveCompanyRequest>({
		mutationKey: ['companies'],
		mutationFn: postCompany,
	});
