import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TabBar from '@/components/TabBar/TabBar';
import Main from '@/pages/Main';
import MyPage from '@/pages/MyPage';
import Pot from '@/pages/Pot';
import TeamShareListSearch from '@/pages/TeamShareListSearch';

import './styles/globals.css';

const isTabBarVisible = (path: string) => {
	return ['/', '/search', '/mypage', '/pot'].includes(path);
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 60,
		},
	},
});

const AppRoutes = () => {
	const location = useLocation();
	return (
		<>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/search" element={<TeamShareListSearch />} />
				<Route path="/mypage" element={<MyPage />} />
				<Route path="/pot" element={<Pot />} />
			</Routes>
			{isTabBarVisible(location.pathname) && <TabBar />}
		</>
	);
};

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
