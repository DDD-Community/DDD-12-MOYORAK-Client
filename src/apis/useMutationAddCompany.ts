import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { post } from '.';

export interface IAddCompanyRequest {
	name: string;
	address: string;
	addressDetail?: string;
	longitude: number;
	latitude: number;
}

export interface IAddCompanyResponse {
	companyId: number;
}

const postAddCompany = async (company: IAddCompanyRequest): Promise<IAddCompanyResponse> => {
	return await post<IAddCompanyResponse>('/companies', company);
};

export const useMutationAddCompany = (options?: UseMutationOptions<IAddCompanyResponse, Error, IAddCompanyRequest>) => {
	return useMutation<IAddCompanyResponse, Error, IAddCompanyRequest>({
		mutationKey: ['companies'],
		mutationFn: postAddCompany,
		...options,
	});
};
