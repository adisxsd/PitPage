import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShareAlt, FaBookmark, FaRegComment, FaUserCircle } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { isAuthenticated, openModal } = useAuthStore();
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const [comments, setComments] = useState([
    { id: 1, user: "MaxFan99", text: "Analisis aerodinamika yang sangat mendalam! Ferrari memang terlihat menjanjikan musim ini.", time: "1 hour ago" },
    { id: 2, user: "Tifosi_99", text: "Forza Ferrari! Semoga bisa konsisten di setiap balapan.", time: "30 mins ago" }
  ]);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        const response = await articleService.getArticleBySlug(slug);
        if (response.success) {
          setArticle(response.data);
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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openModal('login');
      return;
    }
    if (!commentText.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      user: "Current User",
      text: commentText,
      time: "Just now"
    };
    setComments([newCommentObj, ...comments]);
    setCommentText("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        Memuat Artikel...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-2xl font-bold mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-gray-400 text-sm mb-6">Artikel yang kamu cari mungkin telah dihapus atau dipindahkan.</p>
        <Link to="/articles" className="bg-[#E10600] px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider">
          Kembali ke Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* KOLOM KONTEN UTAMA */}
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

            {/* AUTHOR BAR */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center">
                  <FaUserCircle className="text-3xl text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{article.author?.name || "PitPage Author"}</h3>
                  <p className="text-xs text-gray-400">@{article.author?.username || "author"}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-full border border-gray-800 bg-[#1A1A1A] hover:border-gray-600 transition-colors ${isBookmarked ? 'text-[#E10600]' : 'text-gray-400'}`}
                >
                  <FaBookmark />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link artikel berhasil disalin ke clipboard!");
                  }}
                  className="p-2.5 rounded-full border border-gray-800 bg-[#1A1A1A] text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* ISI ARTIKEL */}
            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
              <div className="whitespace-pre-line leading-relaxed text-gray-300">
                {article.content}
              </div>
            </div>

            {/* TAGS */}
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

            {/* KOMENTAR */}
            <div className="border-t border-gray-800 pt-10 mt-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaRegComment className="mr-3 text-[#E10600]" /> Discussion ({comments.length})
              </h3>

              <form onSubmit={handleAddComment} className="mb-8 bg-[#1A1A1A] p-5 rounded-lg border border-gray-800">
                <textarea 
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={isAuthenticated ? "Share your thoughts on this article..." : "Login to join the paddock discussion..."}
                  className="w-full bg-[#121212] border border-gray-700 text-white text-sm rounded p-3 focus:outline-none focus:border-[#E10600] mb-3 transition-colors"
                  disabled={!isAuthenticated}
                ></textarea>
                
                <div className="flex justify-end">
                  {isAuthenticated ? (
                    <button type="submit" className="bg-[#E10600] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors">
                      Post Comment
                    </button>
                  ) : (
                    <button type="button" onClick={() => openModal('login')} className="border border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded transition-colors">
                      Login to Comment
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="bg-[#1A1A1A] border border-gray-800/60 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <FaUserCircle className="text-gray-400 text-lg" />
                        <span className="font-bold text-sm text-white">{c.user}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{c.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 pl-7">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR (RELATED ANALYSIS) */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-[#E10600] pl-3 uppercase">
                Related Analysis
              </h3>

              <div className="space-y-6">
                {relatedArticles.length === 0 ? (
                  <p className="text-xs text-gray-500">Belum ada artikel terkait lainnya.</p>
                ) : (
                  relatedArticles.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/articles/${item.slug}`}
                      className="group cursor-pointer flex gap-4 items-center block"
                    >
                      <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                        <img 
                          src={item.thumbnail?.startsWith('http') ? item.thumbnail : "https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop"} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#E10600] uppercase tracking-widest">
                          {item.category?.name || "Article"}
                        </span>
                        <h4 className="font-bold text-sm text-white group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2 mt-1">
                          {item.title}
                        </h4>
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