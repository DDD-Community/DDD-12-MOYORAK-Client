import { useMutation } from '@tanstack/react-query';

import { post } from '.';

const postAddCompany = async (company: string) => {
	return await post('/companies', { name: company });
};

export const useMutationAddCompany = (company: string) =>
	useMutation({
		mutationKey: ['companies', company],
		mutationFn: () => postAddCompany(company),
	});
