import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaNewspaper, FaCalendarAlt, FaEnvelope, FaUserEdit } from 'react-icons/fa';
import { authorService } from '../services/authorService';
import useAuthStore from '../store/useAuthStore';

export default function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const currentLang = localStorage.getItem('pitpage_lang') || 'en';

  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setIsLoading(true);
        const authorData = await authorService.getAuthorById(id);
        setAuthor(authorData);

        const articlesRes = await authorService.getArticlesByAuthor(id);
        if (articlesRes && articlesRes.success) {
          setArticles(articlesRes.data);
        } else if (Array.isArray(articlesRes)) {
          setArticles(articlesRes);
        }
      } catch (error) {
        console.error("Gagal memuat profil author:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        {currentLang === 'id' ? 'Memuat Profil Author Paddock...' : 'Loading Author Profile...'}
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-2xl font-bold mb-2">{currentLang === 'id' ? 'Author Tidak Ditemukan' : 'Author Not Found'}</h2>
        <p className="text-gray-400 text-sm mb-6">{currentLang === 'id' ? 'Data author tidak terdaftar di sistem Paddock.' : 'Author data is not registered in the system.'}</p>
        <Link to="/articles" className="bg-[#E10600] px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider">
          {currentLang === 'id' ? 'Kembali ke Berita' : 'Back to News'}
        </Link>
      </div>
    );
  }

  const isOwnProfile = isAuthenticated && currentUser && Number(currentUser.id) === Number(id);

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      <section className="relative bg-gradient-to-r from-[#181818] via-[#1F1F1F] to-[#121212] border-b border-gray-800/80 pt-12 pb-16 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#E10600] bg-gray-900 flex items-center justify-center shadow-2xl flex-shrink-0">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-7xl text-gray-500" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                {author.role && (
                  <span className="bg-[#E10600]/20 text-[#E10600] border border-[#E10600]/40 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                    {author.role}
                  </span>
                )}
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-500 text-xs" /> Joined {formatDate(author.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {author.name}
              </h1>
              <p className="text-sm text-[#E10600] font-semibold mt-0.5 mb-3">
                @{author.username}
              </p>

              {author.email && (
                <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-3">
                  <FaEnvelope className="text-gray-500" /> {author.email}
                </p>
              )}

              {author.bio && (
                <p className="text-sm text-gray-300 max-w-2xl leading-relaxed italic mt-2">
                  "{author.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4 flex-shrink-0">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-5 flex items-center shadow-xl">
              <div className="text-center px-6">
                <div className="text-2xl md:text-3xl font-black text-white">{articles.length}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <FaNewspaper className="text-[#E10600]" /> Articles
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-sm text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
              >
                <FaUserEdit /> Edit Profile
              </button>
            )}
          </div>

        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-16 pt-12">
        <div className="mb-8 border-l-4 border-[#E10600] pl-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
            Articles By {author.name}
          </h2>
          <p className="text-gray-400 text-xs mt-1">Daftar publikasi dan laporan balapan yang ditulis oleh {author.name}.</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-lg">
            <p className="text-base font-semibold">Author ini belum memiliki artikel terpublikasi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => navigate(`/articles/${article.slug}`)}
                className="group cursor-pointer bg-[#181818] rounded-md overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="h-52 overflow-hidden relative bg-black">
                    <img 
                      src={article.thumbnail?.startsWith('http') ? article.thumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=800&auto=format&fit=crop"} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <span className="absolute top-3 right-3 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider backdrop-blur-md">
                      {article.category?.name || "News"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-gray-800/50 text-xs text-gray-500 font-semibold flex justify-between items-center uppercase tracking-wider">
                  <span className="text-gray-400">By {author.name}</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}