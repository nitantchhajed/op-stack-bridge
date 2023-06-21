import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./components/Main";
import Wagmi from './components/Wagmi';
import Account from './components/account/Account';
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="main_wrap">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/account" element={<Account />} />

          </Routes>
        </div>
        <Footer />
      </BrowserRouter>

    </>
  );
}

export default App;
