import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { WalletContainer } from "./components/containers/connectWallet";
import { Header } from "./components/shared/header";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Footer } from "./components/shared/footer";
import { Home } from "./pages/home";
import { UserDashboard } from "./pages/dashboard";
import { Toaster } from "react-hot-toast";
import { Test } from "./pages/test";

function App() {
  return (
    // <div className="bg-slate-800 h-screen">
    //   <Header />
    //   <div className="h-screen flex items-center justify-center">
    //     <WalletContainer />
    //   </div>
    // </div>

    <Router>
      <div className="bg-slate-900 h-full bg-repeat-y">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
