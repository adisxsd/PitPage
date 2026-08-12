import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaPenNib, FaUserCog, FaSave, FaHeading, FaLink, 
  FaImage, FaTag, FaCar, FaBold, FaItalic, FaQuoteLeft, 
  FaListUl, FaListOl, FaEye, FaEdit 
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService'; // 🟢 Kembali pakai articleService
import api from '../services/api';
import { translations } from '../utils/translations';

export default function WriteArticle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  
  const t = translations[currentLang]?.dashboard || translations.en.dashboard;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null); 
  const [categoryId, setCategoryId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [content, setContent] = useState('');

  const [activeTab, setActiveTab] = useState('edit');
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    const fetchReferences = async () => {
      try {
        const [catRes, drivRes] = await Promise.all([
          api.get('/categories'),
          api.get('/drivers')
        ]);
        setCategories(catRes.data?.data || catRes.data || []);
        setDrivers(drivRes.data?.data || drivRes.data || []);
      } catch (err) {
        console.error("Gagal memuat data referensi:", err);
      }
    };

    fetchReferences();
  }, [user, isAuthenticated, navigate]);

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

  setIsLoading(true);
  setMsg({ type: '', text: '' });

  if (!categoryId || !driverId) {
    setMsg({
      type: 'error',
      text: currentLang === 'id'
        ? 'Kategori dan Driver wajib dipilih!'
        : 'Category and Driver are required!'
    });

    setIsLoading(false);
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

    // Status ditentukan dari button yang diklik
    formData.append('status', articleStatus);

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    await articleService.createArticle(formData);

    setMsg({
      type: 'success',
      text:
        articleStatus === 'DRAFT'
          ? currentLang === 'id'
            ? '📝 Artikel berhasil disimpan sebagai draft!'
            : '📝 Article saved as draft!'
          : currentLang === 'id'
            ? '🟢 Artikel berhasil dipublikasikan ke Paddock!'
            : '🟢 Article published successfully!'
    });

    setTimeout(() => {
      navigate('/dashboard/profile');
    }, 1500);

  } catch (error) {
    setMsg({
      type: 'error',
      text:
        error.response?.data?.message ||
        'Gagal menyimpan artikel.'
    });
  } finally {
    setIsLoading(false);
  }
};

  const SidebarItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-bold uppercase tracking-wider ${
          isActive 
            ? 'bg-[#E10600]/10 border border-[#E10600]/30 text-white' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Icon className={isActive ? 'text-[#E10600] text-lg' : 'text-lg'} /> 
        <span className="hidden md:block">{label}</span>
      </Link>
    );
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col md:flex-row max-w-[1400px] mx-auto border-x border-gray-900/50">
      
      <aside className="w-full md:w-64 bg-[#181818] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 hidden md:block">
          <h2 className="text-lg font-black text-white tracking-widest uppercase">{t.panel_title}</h2>
          <p className="text-xs text-[#E10600] mt-1 font-bold">{t.role}</p>
        </div>
        <nav className="flex md:flex-col gap-2 p-4 overflow-x-auto md:overflow-x-visible scrollbar-hide">
          <SidebarItem to="/dashboard/write" icon={FaPenNib} label={currentLang === 'id' ? 'Tulis Artikel' : 'Write Article'} />
          <SidebarItem to="/dashboard/profile" icon={FaUserCog} label={currentLang === 'id' ? 'Edit Profil' : 'Edit Profile'} />
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 w-full max-w-4xl">
        <div className="mb-8 border-b border-gray-800 pb-6">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">{currentLang === 'id' ? 'Tulis Artikel' : 'Write Article'}</h1>
            <p className="text-gray-400 text-sm mt-1">{currentLang === 'id' ? 'Tulis artikel terbaikmu.' : 'Write your best article.'}</p>
          </div>
        </div>

        {msg.text && (
          <div className={`mb-6 p-4 rounded-md text-sm font-semibold flex items-center gap-2 shadow-lg ${
            msg.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}>
            {msg.text}
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* 🟢 INPUT FILE UNTUK UPLOAD THUMBNAIL */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaImage className="text-[#E10600]" /> {currentLang === 'id' ? 'Upload Thumbnail' : 'Upload Thumbnail'}
              </label>
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full bg-[#121212] border border-gray-700 text-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#E10600] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#1A1A1A] file:text-[#E10600] hover:file:bg-[#E10600] hover:file:text-white file:transition-colors file:cursor-pointer"
                required
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

            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-800">

              {/* SAVE AS DRAFT */}
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e, 'DRAFT')}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-sm text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <FaSave />
                {isLoading
                  ? '...'
                  : currentLang === 'id'
                    ? 'SIMPAN SEBAGAI DRAFT'
                    : 'SAVE AS DRAFT'
                }
              </button>

              {/* PUBLISH */}
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e, 'PUBLISHED')}
                className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
              >
                <FaSave />
                {isLoading
                  ? '...'
                  : currentLang === 'id'
                    ? 'TERBITKAN ARTIKEL'
                    : 'PUBLISH ARTICLE'
                }
              </button>

            </div>

          </form>
        </div>

      </main>
    </div>
  );
}