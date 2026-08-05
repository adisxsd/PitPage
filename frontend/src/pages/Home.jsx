import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Home() {
  const { isAuthenticated, openModal } = useAuthStore();
  const navigate = useNavigate();

  // Fungsi navigasi ke detail artikel (Guest bebas akses baca)
  const handleReadArticle = () => {
    navigate('/article/detail');
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative min-h-[70vh] md:h-[85vh] bg-cover bg-center flex items-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2000&auto=format&fit=crop')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
        
        <div className="relative z-10 px-6 md:px-16 max-w-4xl mt-12 md:mt-0">
          <div className="flex items-center space-x-3 mb-5 text-[10px] md:text-xs font-bold tracking-widest uppercase">
            <span className="bg-white/10 text-gray-200 px-2 py-1 rounded-sm border border-white/20 backdrop-blur-sm">
              Race Report
            </span>
            <span className="text-gray-400">
              2 Hours Ago
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold mb-4 leading-[1.1] tracking-tight">
            Verstappen Dominates Under the Lights: A Masterclass in Tire Management
          </h1>
          
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Red Bull's reigning champion extends his lead with a flawless execution of a one-stop strategy, leaving rivals struggling in his wake on the abrasive street circuit.
          </p>
          
          <button onClick={handleReadArticle} className="bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-sm flex items-center transition-all hover:pr-5 group text-xs md:text-sm tracking-wider uppercase">
            Read Full Analysis 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">➔</span>
          </button>
        </div>
      </section>

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
          <div className="lg:col-span-2 group cursor-pointer" onClick={handleReadArticle}>
            <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-md mb-5">
              <img 
                src="https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop" 
                alt="F1 Mechanic" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 right-4 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-xs font-bold px-3 py-1.5 rounded-sm backdrop-blur-md tracking-wider">
                ⚙️ TECHNICAL
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-tight">
              Decoding the New Floor Upgrades: Downforce Secrets Revealed
            </h3>
            <p className="text-gray-400 mb-4 line-clamp-2 text-base md:text-lg">
              A deep dive into the aero updates brought to this weekend's race and how they alter the airflow around the diffuser.
            </p>
            <div className="text-xs text-gray-500 font-semibold tracking-wider uppercase">
              By Mark Thompson <span className="mx-2 text-gray-700">|</span> 4 hrs ago
            </div>
          </div>

          {/* Artikel Kecil (Kanan) */}
          <div className="flex flex-col gap-8">
            
            {/* Kecil 1 */}
            <div className="group cursor-pointer" onClick={handleReadArticle}>
              <div className="h-48 overflow-hidden rounded-md mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop" 
                  alt="Rain Race" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[#E10600] text-xs font-bold tracking-widest uppercase">Analysis</span>
              <h4 className="text-xl font-bold mt-2 group-hover:text-[#E10600] transition-colors leading-snug">
                Strategy Blunders Cost Podium Place for Contenders
              </h4>
              <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">6 hrs ago</div>
            </div>

            {/* Kecil 2 */}
            <div className="group cursor-pointer" onClick={handleReadArticle}>
              <div className="h-48 overflow-hidden rounded-md mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=600&auto=format&fit=crop" 
                  alt="Driver" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-[#E10600] text-xs font-bold tracking-widest uppercase">News</span>
              <h4 className="text-xl font-bold mt-2 group-hover:text-[#E10600] transition-colors leading-snug">
                Rookie Sensation Secures Multi-Year Contract Extension
              </h4>
              <div className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider">8 hrs ago</div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}