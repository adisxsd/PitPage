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
import AdminDashboard from './pages/AdminDashboard';
import ManageCategories from './pages/ManageCategories';
import ManageDrivers from './pages/ManageDrivers';
import ManageUsers from './pages/ManageUsers';

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
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/categories" element={<ManageCategories />} />
            <Route path="/dashboard/admin/drivers" element={<ManageDrivers />} />
            <Route path="/dashboard/admin/users" element={<ManageUsers />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}