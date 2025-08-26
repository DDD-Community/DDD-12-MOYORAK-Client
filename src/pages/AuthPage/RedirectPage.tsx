import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const name = params.get('name');
		const email = params.get('email');
		const profileImage = params.get('profileImage');
		const accessToken = params.get('accessToken');
		const refreshToken = params.get('refreshToken');

		if (accessToken && refreshToken) {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			navigate('/', { state: { login: true }, replace: true });
			return;
		}

		if (name && email) {
			localStorage.setItem('email', email);
			localStorage.setItem('name', name);
			localStorage.setItem('profileImage', profileImage ?? '');

			navigate('/signup?step=1', {
				replace: true,
			});
			return;
		}

		navigate('/auth', { replace: true });
	}, [navigate]);

	return <h1>loading...</h1>;
};

export default RedirectPage;
