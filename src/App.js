// src/App.js
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/Dashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Deposit from './pages/Deposit';
import Investmentplans from './pages/Investmentplans';
import Withdraws from './pages/Withdraws';
import History from './pages/History';
import Registration from './pages/Registration';
import VerifyEmPwd from './pages/VerifyEmPwd';



function App() {
  return (
    <Router>
      <Routes>
       <Route path="Dashboard" element={<Registration />} />
       <Route path="Verifyempwd" element={<VerifyEmPwd/>} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="Deposit" element={<Deposit />} />
          <Route path="Investmentplans" element={<Investmentplans />} />
          <Route path="Withdraws" element={<Withdraws />} />
          <Route path="History" element={<History/>} />
         

         

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
