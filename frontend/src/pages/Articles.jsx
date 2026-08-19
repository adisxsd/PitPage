import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import { categoryService } from '../services/categoryService'; 
import { translations } from '../utils/translations';

export default function Articles() {
  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  const t = translations[currentLang]?.articles || translations.en.articles;

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [artRes, catRes] = await Promise.all([
          articleService.getAllArticles(),
          categoryService.getAllCategories().catch(() => null)
        ]);

        let loadedArticles = [];
        if (artRes.success && Array.isArray(artRes.data)) {
          // Urutkan artikel terbaru
          loadedArticles = artRes.data.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.createdAt);
            const dateB = new Date(b.publishedAt || b.createdAt);
            return dateB - dateA;
          });
          setArticles(loadedArticles);
          setFilteredArticles(loadedArticles);
        }

        if (catRes && catRes.success && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        } else {
          // CADANGAN: Jika API Categories error/dikunci
          const uniqueCats = Array.from(new Set(loadedArticles.map(a => a.category?.name).filter(Boolean)));
          setCategories(uniqueCats.map((name, idx) => ({ id: `fallback-${idx}`, name })));
        }

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        {currentLang === 'id' ? 'Memuat Arsip Paddock...' : 'Loading Paddock Archive...'}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen py-12 px-6 md:px-16 max-w-[1400px] mx-auto">
      
      <div className="mb-8 border-l-4 border-[#E10600] pl-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">{t.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{t.subtitle}</p>
      </div>

      {/* FILTER DINAMIS */}
      <div className="flex space-x-3 text-xs md:text-sm font-semibold overflow-x-auto pb-4 mb-10 scrollbar-hide border-b border-gray-800">
        <button
          onClick={() => handleFilterCategory('All')}
          className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
            activeCategory === 'All'
              ? 'bg-[#E10600] text-white font-bold'
              : 'border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
          }`}
        >
          {t.all_news}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterCategory(cat.name)}
            className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat.name
                ? 'bg-[#E10600] text-white font-bold'
                : 'border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-24 text-gray-500 border border-dashed border-gray-800 rounded-md">
          <p className="text-lg font-semibold">{t.no_article}</p>
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

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {stripHtmlTags(article.content)}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-gray-800/50 text-xs text-gray-500 font-semibold flex justify-between items-center uppercase tracking-wider">
                {article.author ? (
                  <Link 
                    to={`/authors/${article.author.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-[#E10600] transition-colors z-10"
                  >
                    By {article.author.name}
                  </Link>
                ) : (
                  <span className="text-gray-400">By PitPage Team</span>
                )}
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}