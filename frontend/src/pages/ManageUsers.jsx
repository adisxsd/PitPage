import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, FaEdit, FaTrashAlt, FaChartBar, 
  FaTags, FaCar, FaPenNib, FaUserCog, FaExclamationTriangle, FaTimes, FaCheck,
  FaEye 
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { authorService } from '../services/authorService';

export default function ManageUsers() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await authorService.getAllAuthors();
      setUsers(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error("Gagal memuat pengguna:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (u) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username);
    setEmail(u.email);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert({ type: '', text: '' });

    try {
      await authorService.updateAuthor(editingUser.id, { name, username, email });
      setAlert({
        type: 'success',
        text: currentLang === 'id' ? 'Data pengguna berhasil diperbarui!' : 'User updated successfully!'
      });
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setAlert({
        type: 'error',
        text: err.response?.data?.message || 'Gagal memperbarui pengguna.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      currentLang === 'id' 
        ? "Apakah Anda yakin ingin menghapus pengguna ini secara permanen?" 
        : "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    setAlert({ type: '', text: '' });
    try {
      await authorService.deleteAuthor(id);
      setAlert({
        type: 'success',
        text: currentLang === 'id' ? 'Pengguna berhasil dihapus.' : 'User deleted successfully.'
      });
      fetchUsers();
    } catch (err) {
      setAlert({ 
        type: 'error', 
        text: err.response?.data?.message || 'Gagal menghapus pengguna.' 
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

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

          <Link to="/dashboard/write" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname.includes('/dashboard/write') || location.pathname.includes('/write-article') ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                      <FaPenNib className={location.pathname.includes('/dashboard/write') || location.pathname.includes('/write-article') ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Write Artikel' : 'Write Article'}
                    </Link>
          <Link to="/dashboard/profile" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/dashboard/profile' ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <FaUserCog className={location.pathname === '/dashboard/profile' ? 'text-[#E10600] text-base' : 'text-base'} /> {currentLang === 'id' ? 'Profil' : 'Profile'}
          </Link>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-800 pb-6 gap-4">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              {currentLang === 'id' ? 'Manajemen Pengguna' : 'User Management'}
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {currentLang === 'id' ? 'Kelola data author di dalam sistem Paddock.' : 'Manage author data within the Paddock system.'}
            </p>
          </div>
        </div>

        {/* ALERT STATE */}
        {alert.text && (
          <div className={`mb-6 p-4 rounded-md text-sm font-semibold flex items-center justify-between shadow-lg ${
            alert.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
              : 'bg-red-500/15 border border-red-500/60 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {alert.type === 'error' ? <FaExclamationTriangle className="text-lg shrink-0 text-[#E10600]" /> : <FaCheck />}
              <span>{alert.text}</span>
            </div>
            <button onClick={() => setAlert({ type: '', text: '' })} className="text-gray-400 hover:text-white"><FaTimes /></button>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-wider text-xs">
              {currentLang === 'id' ? 'Memuat Data Pengguna...' : 'Loading Users...'}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500 italic text-sm">
              {currentLang === 'id' ? 'Belum ada pengguna terdaftar.' : 'No registered users found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#121212] border-b border-gray-800 text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">{currentLang === 'id' ? 'Nama' : 'Name'}</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">{currentLang === 'id' ? 'Bergabung' : 'Joined'}</th>
                    <th className="p-4 text-right pr-6">{currentLang === 'id' ? 'Aksi' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-gray-500">#{u.id}</td>
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-gray-400 font-mono text-xs">@{u.username}</td>
                      <td className="p-4 text-gray-400 text-xs">{u.email}</td>
                      <td className="p-4 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                      
                      {/* ACT Button (VIEW, EDIT, DELETE) */}
                      <td className="p-4 text-right pr-6 space-x-2">
                        <Link 
                          to={`/authors/${u.id}`} 
                          className="inline-block p-2 bg-blue-950/40 border border-blue-800/50 hover:bg-blue-600 text-blue-400 hover:text-white rounded transition-colors" 
                          title={currentLang === 'id' ? 'Lihat Profil' : 'View Profile'}
                        >
                          <FaEye />
                        </Link>
                        <button 
                          onClick={() => handleOpenModal(u)} 
                          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors" 
                          title={currentLang === 'id' ? 'Edit' : 'Edit'}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)} 
                          className="p-2 bg-red-950/40 border border-red-800/50 hover:bg-[#E10600] text-red-400 hover:text-white rounded transition-colors" 
                          title={currentLang === 'id' ? 'Hapus' : 'Delete'}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* MODAL FORM EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-white">
                {currentLang === 'id' ? 'Edit Pengguna' : 'Edit User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nama</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded p-3 text-sm focus:outline-none focus:border-[#E10600]" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                <input 
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded p-3 text-sm focus:outline-none focus:border-[#E10600]" required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded p-3 text-sm focus:outline-none focus:border-[#E10600]" required 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase tracking-wider rounded">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50">
                  {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}