import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail"; // <-- Pastikan ini di-import

export default function App() {
  return (
    <Router>
      <div className="bg-[#121212] min-h-screen text-white flex flex-col justify-between">
        <Navbar />
        <AuthModal />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            {/* PASTIKAN RUTE INI ADA DI DALAM APP.JSX */}
            <Route path="/articles/:slug" element={<ArticleDetail />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}