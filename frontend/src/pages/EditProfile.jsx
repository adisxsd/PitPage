import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaIdBadge, FaShieldAlt, FaSave, 
  FaExternalLinkAlt, FaNewspaper, FaPenNib, FaUserCog, FaPlus,
  FaChartBar, FaTags, FaCar, FaUsers
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { authorService } from '../services/authorService';
import { articleService } from '../services/articleService';
import { translations } from '../utils/translations';

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, isAuthenticated } = useAuthStore();

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  const t = translations[currentLang]?.dashboard || translations.en.dashboard;

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [myArticles, setMyArticles] = useState([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);

  const [activeArticleTab, setActiveArticleTab] = useState('PUBLISHED');

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    const loadProfileAndArticles = async () => {
      try {
        const data = await authorService.getAuthorById(user.id);
        setName(data.name || '');
        setUsername(data.username || '');
        setEmail(data.email || '');

        setIsArticlesLoading(true);
        const articlesRes = await authorService.getArticlesByAuthor(user.id);
        
        if (Array.isArray(articlesRes)) {
          setMyArticles(articlesRes);
        } else if (articlesRes?.success && Array.isArray(articlesRes.data)) {
          setMyArticles(articlesRes.data);
        } else if (articlesRes?.data && Array.isArray(articlesRes.data)) {
          setMyArticles(articlesRes.data);
        } else if (articlesRes?.articles && Array.isArray(articlesRes.articles)) {
          setMyArticles(articlesRes.articles);
        } else {
          setMyArticles([]);
        }

      } catch (err) {
        console.error("Gagal memuat profil atau artikel:", err);
        setName(user.name || '');
        setUsername(user.username || '');
        setEmail(user.email || '');
      } finally {
        setIsArticlesLoading(false);
      }
    };

    loadProfileAndArticles();
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const updateData = { name, username, email };
      await authorService.updateAuthor(user.id, updateData);

      const updatedUser = { ...user, name, username, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setMsg({ 
        type: 'success', 
        text: currentLang === 'id' ? '🟢 Kredensial Paddock berhasil diperbarui!' : '🟢 Paddock credentials successfully updated!' 
      });
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || (currentLang === 'id' ? 'Gagal memperbarui profil. Periksa jaringan Anda.' : 'Failed to update profile. Check your network.') 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleSlug) => {
    const confirmDelete = window.confirm(
      currentLang === 'id' ? 'Apakah Anda yakin ingin menghapus artikel ini dari Paddock?' : 'Are you sure you want to delete this article from Paddock?'
    );
    if (!confirmDelete) return;

    try {
      await articleService.deleteArticle(articleSlug);
      setMyArticles(myArticles.filter((item) => item.slug !== articleSlug));
      setMsg({ 
        type: 'success', 
        text: currentLang === 'id' ? '🗑️ Artikel berhasil dihapus.' : '🗑️ Article deleted successfully.' 
      });
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error.response?.data?.message || (currentLang === 'id' ? 'Gagal menghapus artikel.' : 'Failed to delete article.') 
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  // FILTER ARTIKEL BERDASARKAN STATUS
  const publishedArticles = myArticles.filter(art => art.status === 'PUBLISHED' || !art.status);
  const draftArticles = myArticles.filter(art => art.status === 'DRAFT');
  const displayedArticles = activeArticleTab === 'PUBLISHED' ? publishedArticles : draftArticles;

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

      <main className="flex-1 p-6 md:p-10 w-full space-y-12">
        
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">{t.edit_profile}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {currentLang === 'id' ? 'Kelola kredensial akun dan publikasi artikel Anda.' : 'Manage your account credentials and article publications.'}
            </p>
          </div>
          
          <Link 
            to={`/authors/${user?.id}`} 
            className="flex items-center justify-center gap-2 text-xs font-bold bg-[#1A1A1A] border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 py-2.5 px-4 rounded-md uppercase tracking-wider transition-colors shrink-0"
          >
            <FaExternalLinkAlt /> {t.view_profile}
          </Link>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-md text-sm font-semibold flex items-center gap-2 shadow-lg ${
            msg.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}>
            {msg.text}
          </div>
        )}

        {/* CONTAINER EDIT PROFILE */}
        <section className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <FaUserCog className="text-[#E10600]" /> {t.edit_profile}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaUser className="text-[#E10600]" /> {currentLang === 'id' ? 'Nama Lengkap' : 'Full Name'}
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaIdBadge className="text-[#E10600]" /> Username
              </label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaEnvelope className="text-[#E10600]" /> {currentLang === 'id' ? 'Alamat Email' : 'Email Address'}
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                required
              />
            </div>

            <div className="bg-[#121212] border border-gray-800 p-4 rounded-md flex items-start gap-3 text-xs text-gray-400">
              <FaShieldAlt className="text-[#E10600] text-lg flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-gray-200">Security Disclaimer:</strong> {currentLang === 'id' ? 'Kredensial sensitif seperti kata sandi dienkripsi secara terpisah demi keamanan hak akses Paddock Anda.' : 'Sensitive credentials like passwords are encrypted separately for your Paddock access security.'}
              </p>
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-800">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm text-xs tracking-widest uppercase flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                <FaSave /> {isLoading ? (currentLang === 'id' ? 'MEMPERBARUI...' : 'UPDATING...') : t.save_changes}
              </button>
            </div>
          </form>
        </section>

        {/* CONTAINER MY ARTICLES DENGAN TAB PUBLISHED / DRAFT */}
        <section className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 md:p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FaNewspaper className="text-[#E10600]" /> {t.my_articles}
            </h2>
            <Link 
              to="/dashboard/write"
              className="text-xs font-bold text-[#E10600] hover:text-red-400 flex items-center gap-1 uppercase tracking-wider transition-colors"
            >
              <FaPlus /> {currentLang === 'id' ? 'Tulis Baru' : 'Write New'}
            </Link>
          </div>

          {/* TABS NAVIGATOR (PUBLISHED / DRAFT) */}
          <div className="flex gap-6 border-b border-gray-800 mb-6">
            <button
              onClick={() => setActiveArticleTab('PUBLISHED')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeArticleTab === 'PUBLISHED'
                  ? 'text-[#E10600] border-b-2 border-[#E10600]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {currentLang === 'id' ? 'Terbit' : 'Published'} ({publishedArticles.length})
            </button>
            <button
              onClick={() => setActiveArticleTab('DRAFT')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeArticleTab === 'DRAFT'
                  ? 'text-[#E10600] border-b-2 border-[#E10600]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {currentLang === 'id' ? 'Draf' : 'Drafts'} ({draftArticles.length})
            </button>
          </div>

          {isArticlesLoading ? (
            <div className="text-center py-10 text-xs text-gray-500 uppercase tracking-widest">
              {currentLang === 'id' ? 'Memuat daftar artikel Anda...' : 'Loading your articles...'}
            </div>
          ) : displayedArticles.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-gray-800 rounded-md bg-[#121212]">
              <p className="text-gray-400 font-medium text-sm mb-3">
                {activeArticleTab === 'PUBLISHED'
                  ? (currentLang === 'id' ? 'Belum ada artikel yang diterbitkan.' : 'No published articles yet.')
                  : (currentLang === 'id' ? 'Tidak ada draf tersimpan.' : 'No saved drafts found.')
                }
              </p>
              <Link 
                to="/dashboard/write"
                className="inline-flex items-center gap-2 bg-[#E10600] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider transition-colors"
              >
                <FaPenNib /> {t.start_writing}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedArticles.map((art) => (
                <div 
                  key={art.id} 
                  className="bg-[#121212] border border-gray-800/80 hover:border-gray-700 p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={art.thumbnail?.startsWith('http') ? art.thumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=300&auto=format&fit=crop"} 
                        alt={art.title} 
                        className={`w-full h-full object-cover ${art.status === 'DRAFT' ? 'opacity-50 grayscale' : ''}`}
                      />

                      {art.status === 'DRAFT' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                          DRAFT
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white line-clamp-1 hover:text-[#E10600] transition-colors">
                        <Link to={art.status === 'DRAFT' ? `/dashboard/edit-article/${art.slug}` : `/articles/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {art.category?.name || "News"} • {art.status === 'DRAFT' ? (currentLang === 'id' ? 'Disimpan ' : 'Saved ') : (currentLang === 'id' ? 'Dipublikasikan ' : 'Published ')} {formatDate(art.createdAt || art.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    
                    {art.status !== 'DRAFT' && (
                      <Link 
                        to={`/articles/${art.slug}`} 
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-3 py-1.5 rounded transition-colors"
                      >
                        {currentLang === 'id' ? 'Lihat' : 'View'}
                      </Link>
                    )}

                    <Link 
                      to={`/dashboard/edit-article/${art.slug}`} 
                      className="text-xs bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600 text-blue-400 hover:text-white font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      {currentLang === 'id' ? 'Ubah' : 'Edit'}
                    </Link>

                    <button 
                        onClick={() => handleDeleteArticle(art.slug)}
                        className="text-xs bg-red-600/20 border border-red-500/40 hover:bg-red-600 text-red-400 hover:text-white font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                        {currentLang === 'id' ? 'Hapus' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}