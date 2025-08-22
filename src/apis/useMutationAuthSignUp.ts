import { useMutation } from '@tanstack/react-query';
import { post } from '.';
import type { TGender } from '@/store/signupStore';

interface IAuthSignUpRequest {
	email: string;
	name: string;
	gender: TGender;
	birthday: string;
	profileImage: string;
}

export interface IUserSignUpResponse {
	userId: number;
}

const postAuthSignUp = async (request: IAuthSignUpRequest): Promise<IUserSignUpResponse> => {
	return await post<IUserSignUpResponse>('/user/sign-up', request);
};

export const useMutationAuthSignUp = () =>
	useMutation<IUserSignUpResponse, Error, IAuthSignUpRequest>({
		mutationKey: ['user', 'sign-up'],
		mutationFn: postAuthSignUp,
	});
