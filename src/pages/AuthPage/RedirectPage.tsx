import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
	const name = new URLSearchParams(location.search).get('name');
	const email = new URLSearchParams(location.search).get('email');
	const profileImage = new URLSearchParams(location.search).get('profileImage');
	const accessToken = new URLSearchParams(location.search).get('accessToken');
	const refreshToken = new URLSearchParams(location.search).get('refreshToken');

	const navigate = useNavigate();

	console.log(email, name, profileImage);

	useEffect(() => {
		if (accessToken && refreshToken) {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			navigate('/', { state: true });

			return;
		}

		if (name && email) {
			navigate('/signup', {
				state: {
					name: name,
					email: email,
					profileImage: profileImage,
				},
			});
		}
	}, [name, email, accessToken]);

	return <h1>loading...</h1>;
};

export default RedirectPage;
