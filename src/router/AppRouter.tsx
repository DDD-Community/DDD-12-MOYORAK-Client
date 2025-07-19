import { Route, Routes } from 'react-router-dom';

import Developer from '@/pages/Developer';
import Main from '@/pages/Main';
import MyPage from '@/pages/MyPage';
import NewRestaurantRegistration from '@/pages/NewRestaurantRegistration';
import NewRestaurantSelect from '@/pages/NewRestaurantSelect';
import Pot from '@/pages/Pot';
import PotMake from '@/pages/PotMake';
import PotMakeSuccess from '@/pages/PotMakeSuccess';
import RestaurantDetail from '@/pages/RestaurantDetail';
import RestaurantRegistration from '@/pages/RestaurantRegistration';
import RestaurantSearch from '@/pages/RestaurantSearch';
import TeamShareListSearch from '@/pages/TeamShareListSearch';

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/search" element={<TeamShareListSearch />} />
			<Route path="/mypage" element={<MyPage />} />
			<Route path="/pot" element={<Pot />} />
			<Route path="/pot-make" element={<PotMake />} />
			<Route path="/pot-make-success" element={<PotMakeSuccess />} />
			<Route path="/developer" element={<Developer />} />
			<Route path="/restaurant-registration" element={<RestaurantRegistration />} />
			<Route path="/restaurant-search" element={<RestaurantSearch />} />
			<Route path="/new-restaurant-select" element={<NewRestaurantSelect />} />
			<Route path="/new-restaurant-registration" element={<NewRestaurantRegistration />} />
			<Route path="/restaurant-detail/" element={<RestaurantDetail />} />
		</Routes>
	);
};

export default AppRouter;
