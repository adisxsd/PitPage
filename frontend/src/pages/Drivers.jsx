import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { driverService } from '../services/driverService';
import { articleService } from '../services/articleService';
import useAuthStore from '../store/useAuthStore';

export default function Drivers() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentLang = localStorage.getItem('pitpage_lang') || 'en';

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setIsLoading(true);
        let loadedDrivers = [];

        try {
          const res = await driverService.getAllDrivers();
          if (res && res.success && Array.isArray(res.data)) loadedDrivers = res.data;
          else if (Array.isArray(res)) loadedDrivers = res;
        } catch (err) {
          console.warn("⚠️ Mode Guest: Mengambil data dari artikel...");
        }

        if (loadedDrivers.length === 0) {
          try {
            const artRes = await articleService.getAllArticles();
            let articles = [];
            if (artRes && artRes.success && Array.isArray(artRes.data)) articles = artRes.data;
            else if (Array.isArray(artRes)) articles = artRes;

            const driverMap = new Map();
            articles.forEach(art => {
              if (art.driver && art.driver.id) {
                if (!driverMap.has(art.driver.id)) driverMap.set(art.driver.id, art.driver);
              }
            });
            loadedDrivers = Array.from(driverMap.values());
          } catch (fallbackErr) {
            console.error("Gagal memuat data:", fallbackErr);
          }
        }

        setDrivers(loadedDrivers);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center text-[#E10600] font-bold tracking-widest uppercase text-xs">
        {currentLang === 'id' ? 'MEMUAT GRID PEMBALAP...' : 'LOADING DRIVER GRID...'}
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-24 pt-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* HEADER SECTION (BERSIH TANPA SEARCHBOX) */}
        <div className="mb-12 pb-6 border-b border-gray-800/80">
          <div className="border-l-4 border-[#E10600] pl-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              F1 <span className="text-[#E10600]">Drivers</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-2 font-medium tracking-wide">
              {currentLang === 'id' 
                ? 'Pilih pembalap di bawah untuk menyaring berita dan telemetri.' 
                : 'Select a driver below to filter news and telemetry.'}
            </p>
          </div>
        </div>

        {/* DRIVER GRID */}
        {drivers.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-xl bg-[#181818]/30">
            <span className="text-5xl mb-3 block grayscale opacity-40">🏁</span>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
              {currentLang === 'id' ? 'Tidak ada pembalap ditemukan.' : 'No drivers found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drivers.map((drv) => (
              <div 
                key={drv.id}
                onClick={() => navigate(`/drivers/${drv.id}`, { state: { driver: drv } })}
                className="group relative bg-[#1A1A1A] border border-gray-800/80 hover:border-[#E10600] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(225,6,0,0.2)] flex flex-col justify-between h-[360px]"
              >
                {/* Aksen Garis Merah Menyala di Atas saat di-Hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-transparent group-hover:bg-[#E10600] transition-colors z-30"></div>

                {/* Nomor Mobil Raksasa (Watermark Background) */}
                <div className="absolute top-4 right-4 text-8xl font-black text-white/[0.03] group-hover:text-[#E10600]/10 transition-colors pointer-events-none select-none z-0 leading-none">
                  {drv.number || '00'}
                </div>

                {/* Foto Pembalap (Jika Ada) */}
                {drv.photo ? (
                  <div className="absolute inset-0 z-10 flex items-end justify-center pt-10">
                    <img 
                      src={drv.photo} 
                      alt={drv.name} 
                      className="h-64 w-auto object-cover object-top opacity-60 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1A1A] z-10"></div>
                )}

                {/* Informasi Atas (Nomor & Tim) */}
                <div className="relative z-20 p-5 flex justify-between items-start">
                  <span className="text-3xl font-black text-white group-hover:text-[#E10600] transition-colors font-mono">
                    #{drv.number || '00'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-black/60 border border-gray-800 px-2.5 py-1 rounded backdrop-blur-md">
                    {drv.team || 'F1 Team'}
                  </span>
                </div>

                {/* Informasi Bawah (Nama & Tombol Aksi) */}
                <div className="relative z-20 p-5 pt-0 flex justify-between items-end border-t border-gray-800/60 mt-auto bg-[#1A1A1A]/80 backdrop-blur-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Driver</p>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#E10600] transition-colors leading-snug">
                      {drv.name}
                    </h2>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-gray-800/80 group-hover:bg-[#E10600] text-gray-300 group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-2 shadow-md">
                    <FaChevronRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
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