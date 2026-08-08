import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShareAlt, FaBookmark, FaRegComment, FaUserCircle, FaTrashAlt } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService';
import { commentService } from '../services/commentService';
import { translations } from '../utils/translations';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { isAuthenticated, openModal, user } = useAuthStore();
  
  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  const t = translations[currentLang]?.detail || translations.en.detail;
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        const response = await articleService.getArticleBySlug(slug);
        
        if (response.success) {
          const fetchedArticle = response.data;
          setArticle(fetchedArticle);

          try {
            const commentsData = await commentService.getCommentsByArticle(fetchedArticle.id);
            if (Array.isArray(commentsData)) {
              const sortedComments = commentsData.sort((a, b) => new Date(b.createdAt) - new Date(b.createdAt));
              setComments(sortedComments);
            }
          } catch (commentErr) {
            console.error("Gagal memuat komentar:", commentErr);
          }
        }

        const latestRes = await articleService.getLatestArticles(5);
        if (latestRes.success) {
          const filtered = latestRes.data.filter((item) => item.slug !== slug);
          setRelatedArticles(filtered);
        }
      } catch (error) {
        console.error("Gagal memuat detail artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await commentService.createComment(article.id, commentText);
      
      if (res.success) {
        const newCommentObj = {
          ...res.data,
          user: {
            id: user.id,
            name: user.name,
            username: user.username
          }
        };
        setComments([newCommentObj, ...comments]);
        setCommentText("");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memposting komentar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm("Hapus komentar ini dari paddock?");
    if (!isConfirmed) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus komentar.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return currentLang === 'id' ? 'Baru saja' : 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${currentLang === 'id' ? 'menit lalu' : 'mins ago'}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${currentLang === 'id' ? 'jam lalu' : 'hrs ago'}`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        {currentLang === 'id' ? 'Memuat Telemetri Artikel...' : 'Loading Article Telemetry...'}
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <div className="relative h-[350px] md:h-[480px] rounded-lg overflow-hidden mb-8 shadow-2xl bg-black">
              <img 
                src={article.thumbnail?.startsWith('http') ? article.thumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2000&auto=format&fit=crop"} 
                alt={article.title} 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="flex items-center space-x-3 mb-3 text-xs font-bold tracking-wider">
                  <span className="text-[#E10600] uppercase border border-[#E10600] px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-md">
                    {article.category?.name || "News"}
                  </span>
                  <span className="text-gray-300">{formatDate(article.publishedAt)}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                  {article.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
              {article.author ? (
                <Link 
                  to={`/authors/${article.author.id}`}
                  className="flex items-center space-x-4 group cursor-pointer"
                  title={`Lihat profil ${article.author.name}`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center group-hover:border-[#E10600] transition-colors">
                    <FaUserCircle className="text-3xl text-gray-400 group-hover:text-[#E10600] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#E10600] transition-colors">
                      {article.author.name}
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-red-400 transition-colors">
                      @{article.author.username}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center">
                    <FaUserCircle className="text-3xl text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">PitPage Author</h3>
                    <p className="text-xs text-gray-400">@author</p>
                  </div>
                </div>
              )}
            </div>

            {/* ISI ARTIKEL DENGAN WHITESPACE-PRE-LINE AGAR ENTER BERFUNGSI */}
            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
              <div 
                className="leading-relaxed text-gray-300 space-y-4 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div className="flex flex-wrap gap-2 my-10 pt-6 border-t border-gray-800">
              <span className="bg-[#1A1A1A] border border-gray-800 text-gray-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                {article.category?.name || "F1 News"}
              </span>
              {article.driver && (
                <span className="bg-[#1A1A1A] border border-gray-800 text-[#E10600] text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                  Driver: {article.driver.name}
                </span>
              )}
            </div>

            <div className="border-t border-gray-800 pt-10 mt-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaRegComment className="mr-3 text-[#E10600]" /> {t.discussion} ({comments.length})
              </h3>

              <form onSubmit={handleAddComment} className="mb-8 bg-[#1A1A1A] p-5 rounded-lg border border-gray-800">
                <textarea 
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={isAuthenticated ? t.placeholder_user : t.placeholder_login}
                  className="w-full bg-[#121212] border border-gray-700 text-white text-sm rounded p-3 focus:outline-none focus:border-[#E10600] mb-3 transition-colors"
                  disabled={!isAuthenticated || isSubmitting}
                ></textarea>
                
                <div className="flex justify-end">
                  {isAuthenticated ? (
                    <button type="submit" disabled={isSubmitting} className="bg-[#E10600] hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors">
                      {isSubmitting ? '...' : t.post_btn}
                    </button>
                  ) : (
                    <button type="button" onClick={() => openModal('login')} className="border border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors">
                      {t.login_comment}
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    {currentLang === 'id' ? 'Belum ada komentar. Jadilah yang pertama memberikan analisis!' : 'No comments yet. Be the first to share an analysis!'}
                  </p>
                ) : (
                  comments.map((c) => {
                    const isOwnerOrAdmin = isAuthenticated && user && (user.id === c.userId || user.role === 'ADMIN');
                    
                    return (
                      <div key={c.id} className="bg-[#1A1A1A] border border-gray-800/60 p-4 rounded-lg group">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <FaUserCircle className="text-gray-400 text-lg" />
                            <span className="font-bold text-sm text-white">
                              {c.user?.name || c.user?.username || "Unknown Fan"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                              {timeAgo(c.createdAt)}
                            </span>
                            
                            {isOwnerOrAdmin && (
                              <button 
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Hapus komentar"
                              >
                                <FaTrashAlt className="text-xs" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 pl-7">{c.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-[#E10600] pl-3 uppercase">
                {t.related}
              </h3>
              <div className="space-y-6">
                {relatedArticles.length === 0 ? (
                  <p className="text-xs text-gray-500">{t.no_related}</p>
                ) : (
                  relatedArticles.map((item) => (
                    <Link key={item.id} to={`/articles/${item.slug}`} className="group cursor-pointer flex gap-4 items-center block">
                      <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                        <img src={item.thumbnail?.startsWith('http') ? item.thumbnail : "https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#E10600] uppercase tracking-widest">{item.category?.name || "Article"}</span>
                        <h4 className="font-bold text-sm text-white group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2 mt-1">{item.title}</h4>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}