import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { driverService } from '../services/driverService';
import { articleService } from '../services/articleService';
import { FaChevronLeft, FaRegCalendarAlt, FaUser } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

export default function DriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const initialDriver = location.state?.driver || null;
  
  const [driver, setDriver] = useState(initialDriver);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';

  useEffect(() => {
    const fetchDriverAndArticles = async () => {
      try {
        setIsLoading(true);
        let loadedArticles = [];

        try {
          const articlesRes = await articleService.getArticlesByDriver(id);
          if (articlesRes && articlesRes.success && Array.isArray(articlesRes.data)) {
            loadedArticles = articlesRes.data;
          } else if (Array.isArray(articlesRes)) {
            loadedArticles = articlesRes;
          }
        } catch (err) {
          console.warn("⚠️ API Endpoint Error.");
        }

        if (loadedArticles.length === 0) {
          try {
            const allRes = await articleService.getAllArticles();
            let allArticles = [];
            if (allRes && allRes.success && Array.isArray(allRes.data)) allArticles = allRes.data;
            else if (Array.isArray(allRes)) allArticles = allRes;

            loadedArticles = allArticles.filter(art => 
              (art.driver && art.driver.id?.toString() === id.toString()) || 
              (art.driverId && art.driverId?.toString() === id.toString())
            );
          } catch (err2) {
            console.error("Gagal melakukan filter lokal:", err2);
          }
        }

        setArticles(loadedArticles);

        let loadedDriver = initialDriver;
        if (!loadedDriver) {
          try {
            const driverRes = await driverService.getDriverById(id);
            if (driverRes && (driverRes.success || driverRes.data)) {
              loadedDriver = driverRes.data || driverRes;
            }
          } catch (err) {
          }
        }

        if (!loadedDriver && loadedArticles.length > 0) {
          const artWithDriver = loadedArticles.find(a => a.driver && a.driver.name);
          if (artWithDriver && artWithDriver.driver) {
            loadedDriver = artWithDriver.driver;
          }
        }

        if (loadedDriver) setDriver(loadedDriver);

      } catch (error) {
        console.error("Error loading driver profile:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchDriverAndArticles();
  }, [id, initialDriver, user]);

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  };

  if (isLoading && !driver) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase text-xs pt-20">
        {currentLang === 'id' ? 'MEMUAT DATA PEMBALAP...' : 'LOADING DRIVER DATA...'}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-24 pt-16 md:pt-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* TOMBOL KEMBALI */}
        <button 
          onClick={() => navigate('/drivers')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <FaChevronLeft className="text-[#E10600]" /> {currentLang === 'id' ? 'Kembali ke Pembalap' : 'Back to Drivers'}
        </button>

        {/* HEADER DRIVER INFO */}
        <div className="relative bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 md:p-10 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
          <div className="relative z-10 border-l-4 border-[#E10600] pl-4">
            <span className="text-xs font-bold text-[#E10600] uppercase tracking-widest bg-[#E10600]/10 border border-[#E10600]/30 px-2.5 py-1 rounded">
              {driver?.team || 'F1 Team'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mt-3">
              {driver?.name || (currentLang === 'id' ? 'Pembalap F1' : 'F1 Driver')}
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {currentLang === 'id' 
                ? `Menampilkan seluruh artikel berita dan pembaruan untuk ${driver?.name || 'pembalap ini'}.` 
                : `Showing all news articles and updates for ${driver?.name || 'this driver'}.`}
            </p>
          </div>

          <div className="relative z-10 bg-[#121212] border border-gray-800 px-6 py-3 rounded-lg flex items-center gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Car Number</p>
              <p className="text-3xl font-black text-white font-mono">#{driver?.number || '-'}</p>
            </div>
          </div>
        </div>

        {/* DAFTAR ARTIKEL TERKAIT */}
        <div className="mb-8 border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-[#E10600] rounded-sm inline-block"></span>
            {currentLang === 'id' ? 'Artikel Terkait' : 'Related Articles'} 
            {!isLoading && (
              <span className="text-gray-500 text-base font-normal">({articles.length})</span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 border border-dashed border-gray-800 rounded-xl bg-[#181818]/30">
            <div className="text-[#E10600] font-bold tracking-widest uppercase text-xs animate-pulse flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#E10600] animate-ping"></span>
              {currentLang === 'id' ? 'Memuat artikel driver terkait...' : 'Loading related driver articles...'}
            </div>
          </div>
        ) : articles.length === 0 ? (
          
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-xl bg-[#181818]/30">
            <span className="text-5xl mb-4 block grayscale opacity-40">🏁</span>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-2">
              {currentLang === 'id' ? 'TIDAK ADA ARTIKEL DITEMUKAN' : 'NO ARTICLES FOUND'}
            </h3>
            <p className="text-gray-400 text-xs font-medium">
              {currentLang === 'id' 
                ? `Belum ada artikel yang ditulis untuk ${driver?.name || 'pembalap ini'}.` 
                : `There are no published articles for ${driver?.name || 'this driver'} yet.`}
            </p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div 
                key={article.id}
                onClick={() => navigate(`/articles/${article.slug}`)}
                className="group bg-[#1A1A1A] border border-gray-800/80 hover:border-[#E10600] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_10px_25px_rgba(225,6,0,0.15)] flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-black/50">
                  <img 
                    src={article.thumbnail?.startsWith('http') ? article.thumbnail : "https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop"} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-md uppercase tracking-wider">
                    {article.category?.name || "News"}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-grow">
                    {article.content ? stripHtmlTags(article.content) : ""}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-800/80 pt-3 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FaUser className="text-[#E10600]" />
                      {article.author?.name || 'PitPage Team'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaRegCalendarAlt />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}