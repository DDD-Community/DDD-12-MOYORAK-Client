import { Route, Routes } from 'react-router-dom';

import Developer from '@/pages/Developer';
import Main from '@/pages/Main';
import MyPage from '@/pages/MyPage';
import Pot from '@/pages/Pot';
import PotMake from '@/pages/PotMake';
import PotMakeSuccess from '@/pages/PotMakeSuccess';
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
		</Routes>
	);
};

export default AppRouter;
