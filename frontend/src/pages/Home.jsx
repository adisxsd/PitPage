import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { articleService } from '../services/articleService';

export default function Home() {
  const { isAuthenticated, openModal } = useAuthStore();
  const navigate = useNavigate();

  // State untuk menyimpan data dari API
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data saat halaman dimuat
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setIsLoading(true);
        // Mengambil 4 artikel terbaru
        const response = await articleService.getLatestArticles(4);
        if (response.success) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // Fungsi navigasi ke detail artikel berdasarkan slug-nya
  const handleReadArticle = (slug) => {
    if (slug) navigate(`/articles/${slug}`);
  };

  // Fungsi format tanggal bawaan (contoh: Aug 5, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Memisahkan artikel sesuai posisi desainmu
  const heroArticle = articles[0];
  const mainArticle = articles[1];
  const sideArticle1 = articles[2];
  const sideArticle2 = articles[3];

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase">
        Memuat Data Paddock...
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
            // Jika thumbnail dari Adis berbentuk URL utuh, kita pakai. Jika tidak, pakai gambar default sementara.
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
                {formatDate(heroArticle.publishedAt)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold mb-4 leading-[1.1] tracking-tight">
              {heroArticle.title}
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {/* Memotong deskripsi jika terlalu panjang */}
              {heroArticle.content?.length > 150 ? heroArticle.content.substring(0, 150) + "..." : heroArticle.content}
            </p>
            
            <button 
              onClick={() => handleReadArticle(heroArticle.slug)} 
              className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-sm flex items-center transition-all hover:pr-5 group text-xs md:text-sm tracking-wider uppercase"
            >
              Read Full Analysis 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </div>
        </section>
      )}

      {/* 2. CATEGORY TABS */}
      <section className="px-6 md:px-16 py-6 border-b border-gray-800/50">
        <div className="flex space-x-3 text-xs md:text-sm font-semibold overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-[#E10600] text-white px-5 py-2 rounded-full whitespace-nowrap">All News</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">Race Reports</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">Tech Talk</button>
          <button className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white px-5 py-2 rounded-full whitespace-nowrap transition-colors">Rumors</button>
        </div>
      </section>

      {/* 3. LATEST ARTICLES GRID */}
      <section className="px-6 md:px-16 py-12 max-w-[1400px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 border-l-4 border-[#E10600] pl-4">Latest Articles</h2>
        
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
                {mainArticle.content?.substring(0, 120)}...
              </p>
              <div className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
                By {mainArticle.author?.name || "PitPage Team"} <span className="mx-2 text-gray-700">|</span> {formatDate(mainArticle.publishedAt)}
              </div>
            </div>
          )}

          {/* Artikel Kecil (Kanan) */}
          <div className="flex flex-col gap-8">
            
            {/* Kecil 1 */}
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
                <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">{formatDate(sideArticle1.publishedAt)}</div>
              </div>
            )}

            {/* Kecil 2 */}
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
                <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">{formatDate(sideArticle2.publishedAt)}</div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}