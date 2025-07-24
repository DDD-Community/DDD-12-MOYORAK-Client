import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TabBar from '@/components/TabBar/TabBar';
import AuthPage from '@/pages/AuthPage/AuthPage';
import RedirectPage from '@/pages/AuthPage/RedirectPage';
import Developer from '@/pages/Developer';
import Main from '@/pages/Main';
import MyPage from '@/pages/MyPage';
import Pot from '@/pages/Pot';
import TeamShareListSearch from '@/pages/TeamShareListSearch';

const AppRouter = () => {
	const isTabBarVisible = (path: string) => {
		return ['/', '/search', '/mypage', '/pot'].includes(path);
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/redirect" element={<RedirectPage />} />
				<Route path="/search" element={<TeamShareListSearch />} />
				<Route path="/mypage" element={<MyPage />} />
				<Route path="/pot" element={<Pot />} />
				<Route path="/developer" element={<Developer />} />
			</Routes>
			{isTabBarVisible(location.pathname) && <TabBar />}
		</BrowserRouter>
	);
};

export default AppRouter;
