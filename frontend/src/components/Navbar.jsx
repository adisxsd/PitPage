import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const { openModal, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-[#121212] border-b border-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo & Links Kiri */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PitPage Logo" className="h-7 md:h-9 object-contain" />
        </Link>
        <ul className="hidden md:flex space-x-6 text-sm font-semibold text-gray-300">
          <li><Link to="/articles" className="text-[#E10600] border-b-2 border-[#E10600] pb-1">News</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Drivers</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Calendar</Link></li>
          <li><Link to="/" className="hover:text-white transition-colors">Teams</Link></li>
        </ul>
      </div>

      {/* Search & Login Kanan */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#222] border border-gray-700 text-white text-sm rounded-md px-8 py-1.5 focus:outline-none focus:border-[#E10600] transition-colors"
          />
          <span className="absolute left-3 top-1.5 text-gray-400 text-xs">🔍</span>
        </div>
        
        {/* Tombol Login/Logout dinamis menggunakan Zustand */}
        {isAuthenticated ? (
          <button onClick={logout} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors">
            LOGOUT
          </button>
        ) : (
          <button onClick={() => openModal('login')} className="bg-[#E10600] hover:bg-red-700 text-white text-sm font-bold py-1.5 px-4 rounded-sm transition-colors">
            LOGIN
          </button>
        )}
      </div>
    </nav>
  );
}