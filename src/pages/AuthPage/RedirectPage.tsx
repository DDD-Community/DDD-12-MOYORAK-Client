import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutationAuthSignIn } from '@/apis/useMutationAuthSignIn';

const RedirectPage = () => {
	const code = new URLSearchParams(location.search).get('code');
	const navigate = useNavigate();
	const { mutate } = useMutationAuthSignIn();

	useEffect(() => {
		if (!code) return;

		mutate(code, {
			onSuccess: () => navigate('/'),
			onError: () => {
				navigate('/auth');
			},
		});
	}, [code]);

	return <h1>loading...</h1>;
};

export default RedirectPage;
