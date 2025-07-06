import { useNavigate } from 'react-router-dom';

import NavBar from '@/components/NavBar/NavBar';

const SelectRestaurant = () => {
	const navigate = useNavigate();

	return (
		<div>
			<NavBar variant="iconWithText" leftText="식당 선택하기" onLeftIconClick={() => navigate(-1)} />
		</div>
	);
};

export default SelectRestaurant;
