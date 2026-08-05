import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Articles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Data Dummy untuk Daftar Artikel (Nanti diganti dengan data dari API GET /articles)
  const allArticles = [
    {
      id: 1,
      slug: "verstappen-dominates-under-the-lights",
      title: "Verstappen Dominates Under the Lights: A Masterclass in Tire Management",
      category: "Race Report",
      author: "Mark Thompson",
      date: "2 hours ago",
      image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Red Bull's reigning champion extends his lead with a flawless execution of a one-stop strategy..."
    },
    {
      id: 2,
      slug: "decoding-new-floor-upgrades",
      title: "Decoding the New Floor Upgrades: Downforce Secrets Revealed",
      category: "Tech Talk",
      author: "Sarah Jenkins",
      date: "4 hours ago",
      image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop",
      excerpt: "A deep dive into the aero updates brought to this weekend's race and how they alter airflow..."
    },
    {
      id: 3,
      slug: "strategy-blunders-cost-podium",
      title: "Strategy Blunders Cost Podium Place for Contenders",
      category: "Analysis",
      author: "Mark Thompson",
      date: "6 hours ago",
      image: "https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Costly pit wall decisions threw away valuable championship points in a chaotic finale."
    },
    {
      id: 4,
      slug: "rookie-sensation-contract-extension",
      title: "Rookie Sensation Secures Multi-Year Contract Extension",
      category: "Rumors",
      author: "David Croft",
      date: "8 hours ago",
      image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1000&auto=format&fit=crop",
      excerpt: "Following a stellar string of performances, the young talent locks in his future seat."
    }
  ];

  // Filter artikel berdasarkan pencarian dan kategori
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <section className="bg-[#1A1A1A] border-b border-gray-800 py-16 px-6 md:px-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
          F1 Paddock <span className="text-[#E10600]">Articles</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-8">
          Explore the latest race reports, technical breakdowns, telemetry insights, and paddock rumors.
        </p>
        
        {/* Search Bar & Filter */}
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search articles by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-[#121212] border border-gray-700 text-white text-sm rounded-sm px-4 py-3 focus:outline-none focus:border-[#E10600] transition-colors"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#121212] border border-gray-700 text-white text-sm rounded-sm px-4 py-3 focus:outline-none focus:border-[#E10600] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Race Report">Race Report</option>
            <option value="Tech Talk">Tech Talk</option>
            <option value="Analysis">Analysis</option>
            <option value="Rumors">Rumors</option>
          </select>
        </div>
      </section>

      {/* ARTICLES GRID SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-16 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold border-l-4 border-[#E10600] pl-3 uppercase">
            Showing {filteredArticles.length} Articles
          </h2>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <div 
                key={art.id} 
                onClick={() => navigate('/article/detail')}
                className="bg-[#1A1A1A] border border-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:border-[#E10600] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-black/80 text-[#E10600] border border-[#E10600]/30 text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider backdrop-blur-md">
                      {art.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 flex justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider border-t border-gray-800/60 pt-4">
                  <span>By {art.author}</span>
                  <span>{art.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No articles found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}