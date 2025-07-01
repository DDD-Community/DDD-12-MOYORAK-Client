import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TabBar from '@/components/TabBar/TabBar';

import AppRouter from './router/AppRouter';

import './styles/globals.css';
import './styles/theme.css';

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

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AppRouter />
				{isTabBarVisible(location.pathname) && <TabBar />}
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default App;
