import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
	const name = new URLSearchParams(location.search).get('name');
	const email = new URLSearchParams(location.search).get('email');
	const profileImage = new URLSearchParams(location.search).get('profileImage');

	const navigate = useNavigate();

	useEffect(() => {
		if (name && email) {
			navigate('/signup', {
				state: {
					name: name,
					email: email,
					profileImage: profileImage,
				},
			});
		}
	}, [name, email]);

	return <h1>loading...</h1>;
};

export default RedirectPage;
