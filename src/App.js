import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Account from './components/account/Account';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="main_wrap">
          <Routes>
            <Route path="/" element={<Deposit />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>

    </>
  );
}

export default App;
