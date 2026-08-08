import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../services/articleService';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await articleService.getAllArticles();
        if (response.success) {
          setArticles(response.data);
          setFilteredArticles(response.data);
        }
      } catch (error) {
        console.error("Gagal memuat daftar artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fungsi Filter berdasarkan Kategori
  const handleFilterCategory = (categoryName) => {
    setActiveCategory(categoryName);
    if (categoryName === 'All') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (art) => art.category?.name?.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredArticles(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        Memuat Arsip Paddock...
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen py-12 px-6 md:px-16 max-w-[1400px] mx-auto">
      
      {/* HEADER JUDUL HALAMAN */}
      <div className="mb-8 border-l-4 border-[#E10600] pl-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">F1 News & Articles</h1>
        <p className="text-gray-400 text-sm mt-1">
          Pusat informasi resmi laporan balapan, analisis teknis, dan berita paddock terbaru.
        </p>
      </div>

      {/* KATEGORI FILTER TABS */}
      <div className="flex space-x-3 text-xs md:text-sm font-semibold overflow-x-auto pb-4 mb-10 scrollbar-hide border-b border-gray-800">
        {['All', 'News', 'Race Reports', 'Tech Talk', 'Rumors'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#E10600] text-white font-bold'
                : 'border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
            }`}
          >
            {cat === 'All' ? 'All News' : cat}
          </button>
        ))}
      </div>

      {/* DAFTAR ARTIKEL GRID */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-24 text-gray-500 border border-dashed border-gray-800 rounded-md">
          <p className="text-lg font-semibold">Tidak ada artikel dalam kategori ini.</p>
          <p className="text-xs mt-1 text-gray-600">Coba pilih kategori "All News" atau tambahkan artikel baru via CMS.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => navigate(`/articles/${article.slug}`)}
              className="group cursor-pointer bg-[#181818] rounded-md overflow-hidden border border-gray-800/80 hover:border-gray-600 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Thumbnail Gambar */}
                <div className="h-56 overflow-hidden relative bg-black">
                  <img 
                    src={article.thumbnail?.startsWith('http') ? article.thumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=800&auto=format&fit=crop"} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 right-3 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider backdrop-blur-md">
                    {article.category?.name || "News"}
                  </span>
                </div>

                {/* Konten Teks Ringkas */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </div>
              </div>

              {/* Footer Card (Penulis & Tanggal) */}
              <div className="px-6 pb-6 pt-3 border-t border-gray-800/50 text-xs text-gray-500 font-semibold flex justify-between items-center uppercase tracking-wider">
                <span className="text-gray-400">By {article.author?.name || "PitPage Team"}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}