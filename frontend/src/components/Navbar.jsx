import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaPenNib, FaGlobe, FaChartBar } from 'react-icons/fa';
import logo from '../assets/logo.png';
import useAuthStore from '../store/useAuthStore';
import { translations } from '../utils/translations'; 

export default function Navbar() {
  const { openModal, isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const [lang, setLang] = useState(() => localStorage.getItem('pitpage_lang') || 'en');
  const t = translations[lang]?.navbar || translations.en.navbar;

  const currentPath = location.pathname;

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'id' : 'en';
    localStorage.setItem('pitpage_lang', nextLang);
    setLang(nextLang);
    window.location.reload();
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm(t.confirm_logout);
    if (isConfirmed) {
      logout(); 
      navigate('/'); 
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const keyword = e.target.search.value;
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  //  LOGIKA PENGECEKAN URL DIPERKUAT
  const getNavLinkClass = (path) => {
    const isActive = currentPath === path || currentPath.startsWith(`${path}/`);
    
    return isActive
      ? "text-[#E10600] border-b-2 border-[#E10600] pb-1 font-bold transition-colors"
      : "text-gray-300 hover:text-white transition-colors pb-1 font-semibold";
  };

  return (
    <nav className="bg-[#121212] border-b border-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo & Links Kiri */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PitPage Logo" className="h-7 md:h-9 object-contain" />
        </Link>

        {/* Menu Dinamis Berdasarkan URL Aktif */}
        <ul className="hidden md:flex space-x-6 text-sm">
          <li>
            <Link to="/articles" className={getNavLinkClass('/articles')}>
              {t.news}
            </Link>
          </li>

          {/* CEK LOGIN UNTUK MENU DRIVERS */}
          <li>
            {isAuthenticated ? (
              <Link to="/drivers" className={getNavLinkClass('/drivers')}>
                {t.drivers}
              </Link>
            ) : (
              <button 
                onClick={() => openModal('login')} 
                className={getNavLinkClass('/drivers')}
              >
                {t.drivers}
              </button>
            )}
          </li>
        </ul>
      </div>

      {/* Search & Login Kanan */}
      <div className="flex items-center space-x-4">
        
        {/* Kotak Pencarian */}
        <div className="relative hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              name="search"
              placeholder={t.search} 
              className="bg-[#222] border border-gray-700 text-white text-sm rounded-md px-4 py-1.5 focus:outline-none focus:border-[#E10600] transition-colors"
            />
          </form>
        </div>
        
        {/* Switch Bahasa */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase px-2.5 py-1 bg-[#1A1A1A] border border-gray-800 rounded"
          title="Change Language"
        >
          <FaGlobe className="text-[#E10600]" /> {lang.toUpperCase()}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            {user?.role === 'ADMIN' && (
              <Link 
                to="/dashboard/admin"
                className="flex items-center justify-center w-8 h-8 rounded bg-[#1A1A1A] border border-[#E10600]/60 text-[#E10600] hover:text-white hover:border-[#E10600] hover:bg-[#E10600] transition-all shadow-[0_0_10px_rgba(225,6,0,0.2)] group"
                title="Race Control (Admin Dashboard)"
              >
                <FaChartBar className="text-sm" />
              </Link>
            )}
            
            <Link 
              to="/dashboard/write"
              className="flex items-center justify-center w-8 h-8 rounded bg-[#1A1A1A] border border-gray-700 text-gray-400 hover:text-white hover:border-[#E10600] hover:bg-[#E10600] transition-all group"
              title="Write New Article"
            >
              <FaPenNib className="text-sm" />
            </Link>

            <Link 
              to="/dashboard/profile"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#E10600] transition-colors group"
              title="Edit Profile"
            >
              <FaUserCircle className="text-xl md:text-2xl text-gray-400 group-hover:text-[#E10600] transition-colors" />
              {user?.username && (
                <span className="hidden sm:inline text-sm font-semibold group-hover:text-[#E10600] transition-colors">
                  @{user.username}
                </span>
              )}
            </Link>

            <button 
              onClick={handleLogout} 
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors uppercase"
            >
              {t.logout}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => openModal('login')} 
            className="bg-[#E10600] hover:bg-red-700 text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors uppercase"
          >
            {t.login}
          </button>
        )}
      </div>
    </nav>
  );
}