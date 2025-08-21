import { useMutation } from '@tanstack/react-query';
import { post } from '.';

interface IRegisterCompanyRequest {
	name: string;
	address: string;
	addressDetail: string;
	longitude: number;
	latitude: number;
}

const postCompany = async (request: IRegisterCompanyRequest) => {
	return await post('/companies', request);
};

export const useMutationCompany = () =>
	useMutation({
		mutationKey: ['company'],
		mutationFn: postCompany,
	});
