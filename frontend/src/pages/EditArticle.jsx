import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { 
  FaPenNib, FaUserCog, FaSave, FaHeading, FaLink, 
  FaImage, FaTag, FaTags, FaCar, FaBold, FaItalic, FaQuoteLeft, 
  FaListUl, FaListOl, FaEye, FaEdit, FaChartBar
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService';
import api from '../services/api';
import { translations } from '../utils/translations';

export default function EditArticle() {
  const { slug: articleSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  
  const t = translations[currentLang]?.dashboard || translations.en.dashboard;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null); 
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const [activeTab, setActiveTab] = useState('edit');
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, drivRes, articleRes] = await Promise.all([
          api.get('/categories'),
          api.get('/drivers'),
          articleService.getArticleBySlug(articleSlug)
        ]);

        setCategories(catRes.data?.data || catRes.data || []);
        setDrivers(drivRes.data?.data || drivRes.data || []);

        const art = articleRes.data || articleRes;
        if (art) {
          setTitle(art.title || '');
          setSlug(art.slug || '');
          setContent(art.content || '');
          setCategoryId(art.categoryId || art.category?.id || '');
          setDriverId(art.driverId || art.driver?.id || '');
          setStatus(art.status || 'DRAFT');
          setExistingThumbnail(art.thumbnail || '');
        }
      } catch (err) {
        console.error("Gagal memuat data artikel:", err);
        setMsg({
          type: 'error',
          text: currentLang === 'id' ? 'Gagal memuat data artikel.' : 'Failed to load article data.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [articleSlug, user, isAuthenticated, navigate, currentLang]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const insertFormatting = (startTag, endTag = '') => {
    const textarea = document.getElementById('article-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Teks di sini';
    const replacement = `${startTag}${selectedText}${endTag}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
    }, 50);
  };

  const handleSubmit = async (e, articleStatus) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg({ type: '', text: '' });

    if (!categoryId || !driverId) {
      setMsg({
        type: 'error',
        text: currentLang === 'id' ? 'Kategori dan Driver wajib dipilih!' : 'Category and Driver are required!'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', content);
      formData.append('authorId', user.id);
      formData.append('categoryId', categoryId);
      formData.append('driverId', driverId);
      formData.append('status', articleStatus);

      if (articleStatus === 'PUBLISHED') {
        formData.append('publishedAt', new Date().toISOString());
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      await articleService.updateArticle(articleSlug, formData);

      setMsg({
        type: 'success',
        text: articleStatus === 'DRAFT'
          ? (currentLang === 'id' ? '📝 Draf artikel berhasil diperbarui!' : '📝 Draft article updated successfully!')
          : (currentLang === 'id' ? '🟢 Artikel berhasil dipublikasikan ke Paddock!' : '🟢 Article published successfully!')
      });

      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 1500);

    } catch (error) {
      setMsg({
        type: 'error',
        text: error.response?.data?.message || (currentLang === 'id' ? 'Gagal memperbarui artikel.' : 'Failed to update article.')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase text-xs md:text-sm">
        {currentLang === 'id' ? 'Memuat Data Artikel...' : 'Loading Article Data...'}
      </div>
    );
  }

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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 w-full">
        <div className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-end">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">{currentLang === 'id' ? 'Edit Artikel' : 'Edit Article'}</h1>
            <p className="text-gray-400 text-sm mt-1">{currentLang === 'id' ? 'Perbarui draf atau publikasi artikel Anda.' : 'Update your draft or published article.'}</p>
          </div>
          <span className={`text-[10px] px-3 py-1 rounded font-mono font-bold tracking-wider uppercase border ${
            status === 'PUBLISHED' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'
          }`}>
            STATUS: {status}
          </span>
        </div>

        {msg.text && (
          <div className={`mb-6 p-4 rounded-md text-sm font-semibold flex items-center gap-2 shadow-lg ${
            msg.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}>
            {msg.text}
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 md:p-8 shadow-2xl">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaHeading className="text-[#E10600]" /> {currentLang === 'id' ? 'Judul Artikel' : 'Article Title'}
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Contoh: Red Bull's Dominance"
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaLink className="text-[#E10600]" /> URL Slug
                </label>
                <input 
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="red-bull-dominance"
                  className="w-full bg-[#121212] border border-gray-700 text-gray-400 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaTag className="text-[#E10600]" /> {currentLang === 'id' ? 'Kategori' : 'Category'}
                </label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>-- {currentLang === 'id' ? 'Pilih Kategori' : 'Select Category'} --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaCar className="text-[#E10600]" /> {currentLang === 'id' ? 'Pembalap Terkait' : 'Related Driver'}
                </label>
                <select 
                  value={driverId} 
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-700 text-white rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#E10600] transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>-- {currentLang === 'id' ? 'Pilih Pembalap' : 'Select Driver'} --</option>
                  {drivers.map((drv) => (
                    <option key={drv.id} value={drv.id}>{drv.name} ({drv.team})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaImage className="text-[#E10600]" /> {currentLang === 'id' ? 'Ganti Thumbnail (Opsional)' : 'Change Thumbnail (Optional)'}
              </label>
              {existingThumbnail && (
                <div className="mb-3 flex items-center gap-3 bg-[#121212] p-2 rounded border border-gray-800">
                  <img src={existingThumbnail.startsWith('http') ? existingThumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=200&auto=format&fit=crop"} alt="Current Thumbnail" className="w-16 h-10 object-cover rounded" />
                  <span className="text-xs text-gray-400">{currentLang === 'id' ? 'Thumbnail Saat Ini' : 'Current Thumbnail'}</span>
                </div>
              )}
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full bg-[#121212] border border-gray-700 text-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#E10600] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#1A1A1A] file:text-[#E10600] hover:file:bg-[#E10600] hover:file:text-white file:transition-colors file:cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {currentLang === 'id' ? 'Editor Konten Artikel' : 'Article Content Editor'}
                </label>
                <div className="flex bg-[#121212] border border-gray-800 rounded p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-3 py-1 rounded flex items-center gap-1.5 font-semibold transition-colors ${activeTab === 'edit' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <FaEdit /> {currentLang === 'id' ? 'Tulis' : 'Write'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded flex items-center gap-1.5 font-semibold transition-colors ${activeTab === 'preview' ? 'bg-[#E10600] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <FaEye /> {currentLang === 'id' ? 'Pratinjau' : 'Live Preview'}
                  </button>
                </div>
              </div>

              {activeTab === 'edit' ? (
                <div className="border border-gray-700 rounded-md overflow-hidden bg-[#121212]">
                  <div className="bg-[#181818] border-b border-gray-800 p-2 flex flex-wrap items-center gap-1 text-xs">
                    <button type="button" onClick={() => insertFormatting('<b>', '</b>')} className="p-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white" title="Bold"><FaBold /></button>
                    <button type="button" onClick={() => insertFormatting('<i>', '</i>')} className="p-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white" title="Italic"><FaItalic /></button>
                    <span className="w-px h-4 bg-gray-700 mx-1"></span>
                    <button type="button" onClick={() => insertFormatting('<h2 class="text-2xl font-bold text-white mt-6 mb-3 border-l-4 border-[#E10600] pl-3 uppercase">', '</h2>')} className="p-2 hover:bg-gray-800 rounded font-bold text-gray-300 hover:text-white" title="H2">H2</button>
                    <button type="button" onClick={() => insertFormatting('<h3 class="text-xl font-bold text-white mt-4 mb-2 border-b border-gray-800 pb-1">', '</h3>')} className="p-2 hover:bg-gray-800 rounded font-bold text-gray-300 hover:text-white" title="H3">H3</button>
                    <span className="w-px h-4 bg-gray-700 mx-1"></span>
                    <button type="button" onClick={() => insertFormatting('<blockquote class="border-l-4 border-[#E10600] pl-6 py-3 my-6 italic text-white font-semibold text-lg md:text-xl bg-[#181818] rounded-r-md">"', '"</blockquote>')} className="p-2 hover:bg-[#E10600]/20 rounded text-[#E10600] font-bold flex items-center gap-1" title="Quote F1"><FaQuoteLeft /> Quote F1</button>
                    <span className="w-px h-4 bg-gray-700 mx-1"></span>
                    <button type="button" onClick={() => insertFormatting('<ul class="list-disc pl-6 space-y-2 my-4">\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white" title="Bullet List"><FaListUl /></button>
                    <button type="button" onClick={() => insertFormatting('<ol class="list-decimal pl-6 space-y-2 my-4">\n  <li>', '</li>\n</ol>')} className="p-2 hover:bg-gray-800 rounded text-gray-300 hover:text-white" title="Numbered List"><FaListOl /></button>
                  </div>
                  <textarea 
                    id="article-content-textarea"
                    rows="12"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#121212] text-white p-4 text-sm focus:outline-none custom-scrollbar leading-relaxed font-mono whitespace-pre-line"
                    required
                  ></textarea>
                </div>
              ) : (
                <div className="border border-gray-700 rounded-md p-6 bg-[#121212] min-h-[300px]">
                  {content ? (
                    <div 
                      className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed space-y-4 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-gray-500 italic text-sm text-center py-10">
                      {currentLang === 'id' ? 'Belum ada teks untuk dipratinjau.' : 'No text to preview.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ACT Button SAVE AS DRAFT & PUBLISH ARTICLE */}
            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-800">
              
              {/* SAVE AS DRAFT */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, 'DRAFT')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-sm text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <FaSave />
                {isSubmitting ? '...' : currentLang === 'id' ? 'SIMPAN SEBAGAI DRAFT' : 'SAVE AS DRAFT'}
              </button>

              {/* PUBLISH */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, 'PUBLISHED')}
                className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                <FaSave />
                {isSubmitting ? '...' : currentLang === 'id' ? 'TERBITKAN ARTIKEL' : 'PUBLISH ARTICLE'}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}