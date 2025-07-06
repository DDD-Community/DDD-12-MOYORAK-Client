import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import AppRouter from './router/AppRouter';

import './styles/globals.css';
import './styles/theme.css';

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
			<AppRouter />
			<Toaster position="bottom-center" />
		</QueryClientProvider>
	);
};

export default App;
