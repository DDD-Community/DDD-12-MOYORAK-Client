import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = () => {
	const email = new URLSearchParams(location.search).get('email');
	const navigate = useNavigate();

	useEffect(() => {
		if (email) {
			navigate('/signup');
		}
	}, [email]);

	return <h1>loading...</h1>;
};

export default RedirectPage;
