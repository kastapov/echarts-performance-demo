import StaticChart from './pages/StaticChart';
import './index.css';
import StaticNavBar from "./components/StaticNavBar";

function App() {
  return (
    <>
      <StaticNavBar />
      <main>
        <StaticChart />
      </main>
    </>
  );
}

export default App;
