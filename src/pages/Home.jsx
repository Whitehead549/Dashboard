// src/pages/Home.js
import OverviewPage from "../components/common/Overviewpages";
import TradingViewChart from '../components/Essentials/TradingViewChart';
const Home = () => {
    return (
      <div className="">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <p>Welcome to the dashboard home page.</p> */}
        <OverviewPage/>
        <div>
        <h1>Live BTC/USD Chart</h1>
        <TradingViewChart />
        </div>
      </div>
    );
  };
  
  export default Home;
  