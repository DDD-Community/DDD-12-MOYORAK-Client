import { Route, Routes } from 'react-router-dom';

import AuthPage from '@/pages/AuthPage/AuthPage';
import RedirectPage from '@/pages/AuthPage/RedirectPage';
import Developer from '@/pages/Developer';
import MainPage from '@/pages/MainPage/MainPage';
import MyPage from '@/pages/MyPage';
import NewRestaurantRegistration from '@/pages/NewRestaurantPage/NewRestaurantRegistration';
import NewRestaurantSelect from '@/pages/NewRestaurantPage/NewRestaurantSelect';
import NotFound from '@/pages/NotFound';
import Pot from '@/pages/PotPage/Pot';
import PotDetail from '@/pages/PotPage/potDetail';
import PotMake from '@/pages/PotPage/PotMake';
import PotMakeSuccess from '@/pages/PotPage/PotMakeSuccess';
import RestaurantDetail from '@/pages/RestaurantPage/RestaurantDetail';
import RestaurantRegistration from '@/pages/RestaurantPage/RestaurantRegistration';
import RestaurantSearch from '@/pages/RestaurantPage/RestaurantSearch';
import ReviewRegistration from '@/pages/RestaurantPage/ReviewRegistration';
import PopupAddress from '@/pages/SignUpPage/components/PopupAddress';
import SignUpPage from '@/pages/SignUpPage/SignUpPage';
import TeamShareListSearch from '@/pages/TeamShareListSearch';

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route path="/auth" element={<AuthPage />} />
			<Route path="/redirect" element={<RedirectPage />} />
			<Route path="/signup" element={<SignUpPage />} />
			<Route path="/popup-address" element={<PopupAddress />} />
			<Route path="/search" element={<TeamShareListSearch />} />
			<Route path="/mypage" element={<MyPage />} />
			<Route path="/pot" element={<Pot />} />
			<Route path="/pot-make" element={<PotMake />} />
			<Route path="/pot-make-success" element={<PotMakeSuccess />} />
			<Route path="/pot-detail/:id" element={<PotDetail />} />
			<Route path="/developer" element={<Developer />} />
			<Route path="/restaurant-registration" element={<RestaurantRegistration />} />
			<Route path="/restaurant-search" element={<RestaurantSearch />} />
			<Route path="/new-restaurant-select" element={<NewRestaurantSelect />} />
			<Route path="/new-restaurant-registration" element={<NewRestaurantRegistration />} />
			<Route path="/restaurant-detail/:teamRestaurantId" element={<RestaurantDetail />} />
			<Route path="/review-registration" element={<ReviewRegistration />} />
			<Route path="/review-registration/:id" element={<ReviewRegistration />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRouter;
