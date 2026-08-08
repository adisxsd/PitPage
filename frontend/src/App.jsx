import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import AuthorProfile from "./pages/AuthorProfile";
import EditProfile from "./pages/EditProfile";
import WriteArticle from "./pages/WriteArticle";
import EditArticle from "./pages/EditArticle";

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
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/authors/:id" element={<AuthorProfile />} />
            <Route path="/dashboard/profile" element={<EditProfile />} />
            <Route path="/dashboard/write" element={<WriteArticle />} />
            <Route path="/dashboard/edit-article/:slug" element={<EditArticle />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}