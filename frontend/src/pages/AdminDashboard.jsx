import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaNewspaper, FaUsers, FaCar, FaTags, 
  FaComments, FaPenNib, FaUserCog, FaChartBar, FaExclamationTriangle
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { adminService } from '../services/adminService';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getStats();
        if (res && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
        setErrorMsg(
          err.response?.data?.message || 
          (currentLang === 'id' ? "Gagal memuat statistik Race Control." : "Failed to load Race Control statistics.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, [currentLang]);

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col md:flex-row max-w-[1400px] mx-auto border-x border-gray-900/50">
      
      {/* SIDEBAR UNIVERSAL */}
      <aside className="w-full md:w-64 bg-[#181818] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <nav className="flex md:flex-col gap-1 p-4 md:pt-8 overflow-x-auto md:overflow-x-visible scrollbar-hide text-xs font-bold uppercase tracking-wider">
          
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/dashboard/admin" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/admin' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <FaChartBar className={location.pathname === '/dashboard/admin' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Ringkasan' : 'Overview'}
              </Link>
              <Link to="/dashboard/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/admin/users' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <FaUsers className={location.pathname === '/dashboard/admin/users' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Pengguna' : 'Users'}
              </Link>
              <Link to="/dashboard/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/admin/categories' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <FaTags className={location.pathname === '/dashboard/admin/categories' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Kategori' : 'Categories'}
              </Link>
              <Link to="/dashboard/admin/drivers" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/admin/drivers' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <FaCar className={location.pathname === '/dashboard/admin/drivers' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Pembalap' : 'Drivers'}
              </Link>
              <div className="my-2 border-t border-gray-800/80 hidden md:block"></div>
            </>
          )}

          <Link to="/dashboard/write" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/dashboard/write') || location.pathname.includes('/edit-article') ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <FaPenNib className={location.pathname.includes('/dashboard/write') || location.pathname.includes('/edit-article') ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Edit Artikel' : 'Edit Article'}
          </Link>
          <Link to="/dashboard/profile" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/profile' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <FaUserCog className={location.pathname === '/dashboard/profile' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Profil' : 'Profile'}
          </Link>

        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 w-full">
        <div className="mb-8 border-b border-gray-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              {currentLang === 'id' ? 'Statistik Race Control' : 'Race Control Statistics'}
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {currentLang === 'id' ? 'Selamat datang kembali, Komandan' : 'Welcome back, Commander'}{' '}
              <span className="text-[#E10600] font-bold">{user?.name}</span>!
            </p>
          </div>
          <span className="text-[10px] bg-[#1A1A1A] border border-gray-800 px-3 py-1.5 rounded text-gray-400 font-mono tracking-wider uppercase">
            {currentLang === 'id' ? 'STATUS SISTEM:' : 'SYSTEM STATUS:'}{' '}
            <span className="text-green-500 font-bold">{currentLang === 'id' ? 'TERHUBUNG' : 'ONLINE'}</span>
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm flex items-center gap-3">
            <FaExclamationTriangle /> {errorMsg}
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[#E10600] font-bold tracking-widest uppercase text-xs md:text-sm">
            {currentLang === 'id' ? 'Memuat Telemetri Race Control...' : 'Loading Race Control Telemetry...'}
          </div>
        ) : stats ? (
          
          /* STATS GRID SESUAI DENGAN API DOC */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. ARTICLES */}
            <div className="bg-[#1A1A1A] border border-gray-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E10600]/5 rounded-bl-full pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {currentLang === 'id' ? 'Total Artikel' : 'Total Articles'}
                  </p>
                  <h2 className="text-4xl font-black text-white mt-1">{stats.articles?.total || 0}</h2>
                </div>
                <div className="w-10 h-10 bg-[#121212] border border-gray-800 rounded flex items-center justify-center text-[#E10600]">
                  <FaNewspaper className="text-lg" />
                </div>
              </div>
              <div className="flex gap-4 pt-3 border-t border-gray-800/60 text-xs font-semibold">
                <span className="text-green-400">● {stats.articles?.published || 0} {currentLang === 'id' ? 'Terbit' : 'Published'}</span>
                <span className="text-amber-400">● {stats.articles?.draft || 0} {currentLang === 'id' ? 'Draf' : 'Draft'}</span>
              </div>
            </div>

            {/* 2. USERS */}
            <div className="bg-[#1A1A1A] border border-gray-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {currentLang === 'id' ? 'Total Pengguna' : 'Total Users'}
                  </p>
                  <h2 className="text-4xl font-black text-white mt-1">{stats.users?.total || 0}</h2>
                </div>
                <div className="w-10 h-10 bg-[#121212] border border-gray-800 rounded flex items-center justify-center text-[#E10600]">
                  <FaUsers className="text-lg" />
                </div>
              </div>
              <div className="flex gap-4 pt-3 border-t border-gray-800/60 text-xs font-semibold">
                <span className="text-blue-400">● {stats.users?.authors || 0} {currentLang === 'id' ? 'Penulis' : 'Authors'}</span>
                <span className="text-red-400">● {stats.users?.admins || 0} Admin</span>
              </div>
            </div>

            {/* 3. DRIVERS */}
            <div className="bg-[#1A1A1A] border border-gray-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {currentLang === 'id' ? 'Pembalap Aktif' : 'Active Drivers'}
                  </p>
                  <h2 className="text-4xl font-black text-white mt-1">{stats.drivers || 0}</h2>
                </div>
                <div className="w-10 h-10 bg-[#121212] border border-gray-800 rounded flex items-center justify-center text-[#E10600]">
                  <FaCar className="text-lg" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-800/60 text-xs text-gray-400 font-semibold">
                {currentLang === 'id' ? 'Pembalap Grid F1 Terdaftar' : 'Registered F1 Grid Drivers'}
              </div>
            </div>

            {/* 4. CATEGORIES */}
            <div className="bg-[#1A1A1A] border border-gray-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {currentLang === 'id' ? 'Kategori' : 'Categories'}
                  </p>
                  <h2 className="text-4xl font-black text-white mt-1">{stats.categories || 0}</h2>
                </div>
                <div className="w-10 h-10 bg-[#121212] border border-gray-800 rounded flex items-center justify-center text-[#E10600]">
                  <FaTags className="text-lg" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-800/60 text-xs text-gray-400 font-semibold">
                {currentLang === 'id' ? 'Kategori Konten Aktif' : 'Active Content Categories'}
              </div>
            </div>

            {/* 5. COMMENTS */}
            <div className="bg-[#1A1A1A] border border-gray-800/80 p-6 rounded-lg relative overflow-hidden group hover:border-gray-700 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {currentLang === 'id' ? 'Komentar Diskusi' : 'Discussion Comments'}
                  </p>
                  <h2 className="text-4xl font-black text-white mt-1">{stats.comments || 0}</h2>
                </div>
                <div className="w-10 h-10 bg-[#121212] border border-gray-800 rounded flex items-center justify-center text-[#E10600]">
                  <FaComments className="text-lg" />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-800/60 text-xs text-gray-400 font-semibold">
                {currentLang === 'id' ? 'Diskusi Penggemar di Paddock' : 'Paddock Community Discussions'}
              </div>
            </div>

          </div>
        ) : null}

      </main>
    </div>
  );
}