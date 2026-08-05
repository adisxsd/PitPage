import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import AuthModal from "./components/AuthModal"; // 1. IMPORT MODAL DI SINI

export default function App() {
  return (
    <Router>
      <div className="bg-[#121212] min-h-screen flex flex-col relative">
        <Navbar />
        
        {/* 2. PASANG MODAL DI SINI (Akan muncul mengambang ketika dipanggil) */}
        <AuthModal /> 

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/detail" element={<ArticleDetail />} /> {/* Route Baru */}
            <Route path="/articles" element={<Articles />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}