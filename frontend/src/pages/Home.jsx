import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService';
import { translations } from '../utils/translations';

export default function Home() {
  const { isAuthenticated, openModal } = useAuthStore();
  const navigate = useNavigate();

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';
  const t = translations[currentLang]?.home || translations.en.home;

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setIsLoading(true);
        const response = await articleService.getLatestArticles(4);
        
        console.log("RESPONSE GET LATEST ARTICLES (HOME):", response);

        if (response.success && Array.isArray(response.data)) {
          setArticles(response.data);
        } else if (Array.isArray(response)) {
          setArticles(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setArticles(response.data);
        } else {
          setArticles([]);
        }

      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  const handleReadArticle = (slug) => {
    if (slug) navigate(`/articles/${slug}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  // 🟢 Fungsi untuk membersihkan tag HTML (seperti <h2>, <p>, dll) dari cuplikan teks beranda
  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const heroArticle = articles[0];
  const mainArticle = articles[1];
  const sideArticle1 = articles[2];
  const sideArticle2 = articles[3];

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        {currentLang === 'id' ? 'Memuat Data Paddock...' : 'Loading Paddock Data...'}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      {heroArticle && (
        <section 
          className="relative min-h-[70vh] md:h-[85vh] bg-cover bg-center flex items-center"
          style={{ 
            backgroundImage: `url('${heroArticle.thumbnail?.startsWith('http') ? heroArticle.thumbnail : "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2000&auto=format&fit=crop"}')` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-6 md:px-16 max-w-4xl mt-12 md:mt-0">
            <div className="flex items-center space-x-3 mb-5 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              <span className="bg-white/10 text-gray-200 px-2 py-1 rounded-sm border border-white/20 backdrop-blur-sm">
                {heroArticle.category?.name || "Headline"}
              </span>
              <span className="text-gray-400">
                {formatDate(heroArticle.publishedAt || heroArticle.createdAt)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold mb-4 leading-[1.1] tracking-tight">
              {heroArticle.title}
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {heroArticle.content ? (
                stripHtmlTags(heroArticle.content).length > 150 
                  ? stripHtmlTags(heroArticle.content).substring(0, 150) + "..." 
                  : stripHtmlTags(heroArticle.content)
              ) : ""}
            </p>
            
            <button 
              onClick={() => handleReadArticle(heroArticle.slug)} 
              className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-sm flex items-center transition-all hover:pr-5 group text-xs md:text-sm tracking-wider uppercase"
            >
              {t.hero_btn} 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </div>
        </section>
      )}

      {/* 2. CATEGORY TABS */}
      <section className="px-6 md:px-16 py-6 border-b border-gray-800/50">
        <div className="flex space-x-3 text-xs md:text-sm font-semibold overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-[#E10600] text-white px-5 py-2 rounded-full whitespace-nowrap">{t.all_news}</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">{t.race_reports}</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">{t.tech_talk}</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">{t.rumors}</button>
        </div>
      </section>

      {/* 3. LATEST ARTICLES GRID */}
      <section className="px-6 md:px-16 py-12 max-w-[1400px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 border-l-4 border-[#E10600] pl-4">{t.latest_heading}</h2>
        
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-lg">
            <p className="text-base font-semibold">
              {currentLang === 'id' ? 'Belum ada artikel terbaru di Paddock.' : 'No latest articles found in the Paddock.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Artikel Besar (Kiri) */}
            {mainArticle && (
              <div className="lg:col-span-2 group cursor-pointer" onClick={() => handleReadArticle(mainArticle.slug)}>
                <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-md mb-5">
                  <img 
                    src={mainArticle.thumbnail?.startsWith('http') ? mainArticle.thumbnail : "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop"} 
                    alt={mainArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 right-4 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-xs font-bold px-3 py-1.5 rounded-sm backdrop-blur-md tracking-wider uppercase">
                    {mainArticle.category?.name || "News"}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-tight">
                  {mainArticle.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2 text-base md:text-lg">
                  {mainArticle.content ? stripHtmlTags(mainArticle.content).substring(0, 120) + "..." : ""}
                </p>
                
                <div className="text-xs text-gray-500 font-semibold tracking-wider uppercase flex items-center">
                  <span>By </span>
                  {mainArticle.author ? (
                    <Link 
                      to={`/authors/${mainArticle.author.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="ml-1 text-gray-400 hover:text-[#E10600] transition-colors z-10"
                    >
                      {mainArticle.author.name}
                    </Link>
                  ) : (
                    <span className="ml-1 text-gray-400">PitPage Team</span>
                  )}
                  <span className="mx-2 text-gray-700">|</span> 
                  {formatDate(mainArticle.publishedAt || mainArticle.createdAt)}
                </div>

              </div>
            )}

            {/* Artikel Kecil (Kanan) */}
            <div className="flex flex-col gap-8">
              
              {sideArticle1 && (
                <div className="group cursor-pointer" onClick={() => handleReadArticle(sideArticle1.slug)}>
                  <div className="h-48 overflow-hidden rounded-md mb-4">
                    <img 
                      src={sideArticle1.thumbnail?.startsWith('http') ? sideArticle1.thumbnail : "https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop"} 
                      alt={sideArticle1.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-[#E10600] text-xs font-bold tracking-widest uppercase">{sideArticle1.category?.name || "Analysis"}</span>
                  <h4 className="text-xl font-bold mt-2 group-hover:text-[#E10600] transition-colors leading-snug">
                    {sideArticle1.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">{formatDate(sideArticle1.publishedAt || sideArticle1.createdAt)}</div>
                </div>
              )}

              {sideArticle2 && (
                <div className="group cursor-pointer" onClick={() => handleReadArticle(sideArticle2.slug)}>
                  <div className="h-48 overflow-hidden rounded-md mb-4">
                    <img 
                      src={sideArticle2.thumbnail?.startsWith('http') ? sideArticle2.thumbnail : "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=600&auto=format&fit=crop"} 
                      alt={sideArticle2.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <span className="text-[#E10600] text-xs font-bold tracking-widest uppercase">{sideArticle2.category?.name || "News"}</span>
                  <h4 className="text-xl font-bold mt-2 group-hover:text-[#E10600] transition-colors leading-snug">
                    {sideArticle2.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">{formatDate(sideArticle2.publishedAt || sideArticle2.createdAt)}</div>
                </div>
              )}

            </div>
          </div>
        )}
      </section>
    </div>
  );
}