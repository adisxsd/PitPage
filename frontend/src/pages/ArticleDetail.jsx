import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShareAlt, FaBookmark, FaRegComment, FaUserCircle } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { isAuthenticated, openModal } = useAuthStore();
  
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Data dummy komentar
  const [comments, setComments] = useState([
    { id: 1, user: "MaxFan99", text: "Analisis aerodinamika yang sangat mendalam! Lantai RB19 memang revolusioner.", time: "1 hour ago" },
    { id: 2, user: "Tifosi_99", text: "Sayang sekali tim lain masih kesulitan mengejar gap di high-speed corners.", time: "30 mins ago" }
  ]);

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

  return (
    <div className="bg-[#121212] text-white min-h-screen pb-20">
      
      {/* KONTEN UTAMA DENGAN SIDEBAR (GRID 3 KOLOM) */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* KOLOM KIRI & TENGAH (KONTEN ARTIKEL - 2 Kolom) */}
          <div className="lg:col-span-2">
            
            {/* 1. HERO IMAGE ARTIKEL DENGAN JUDUL DI DALAMNYA */}
            <div className="relative h-[350px] md:h-[480px] rounded-lg overflow-hidden mb-8 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2000&auto=format&fit=crop" 
                alt="F1 Car" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="flex items-center space-x-3 mb-3 text-xs font-bold tracking-wider">
                  <span className="text-[#E10600] uppercase border border-[#E10600] px-2 py-0.5 rounded-sm bg-black/40 backdrop-blur-sm">
                    Race Report
                  </span>
                  <span className="text-gray-300">2 hours ago</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                  Red Bull's Dominance: A Technical Analysis
                </h1>
              </div>
            </div>

            {/* 2. AUTHOR & SHARE BAR */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop" 
                  alt="Author" 
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <h3 className="font-bold text-base text-white">Mark Thompson</h3>
                  <p className="text-xs text-gray-400">Senior Technical Analyst</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-full border border-gray-800 bg-[#1A1A1A] hover:border-gray-600 transition-colors ${isBookmarked ? 'text-[#E10600]' : 'text-gray-400'}`}
                >
                  <FaBookmark />
                </button>
                <button className="p-2.5 rounded-full border border-gray-800 bg-[#1A1A1A] text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* 3. TEKS ISI ARTIKEL */}
            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
              <p className="font-bold text-white text-lg md:text-xl leading-snug">
                The RB19 has established itself as one of the most formidable machines in modern racing history. Through a deep dive into telemetry data, we uncover the secrets behind its cornering supremacy.
              </p>
              
              <p>
                Examining the telemetry from the latest Grand Prix reveals a stark contrast in downforce generation compared to its closest rivals. The aggressive floor design, heavily scrutinized during pre-season, appears to be yielding significant dividends in high-speed sectors.
              </p>

              {/* BLOCKQUOTE KHAS F1 */}
              <blockquote className="border-l-4 border-[#E10600] pl-6 py-2 my-8 italic text-white font-semibold text-xl md:text-2xl bg-[#1A1A1A]/40 rounded-r-md">
                "It's not just about peak downforce; it's the consistency of the aerodynamic platform across different ride heights that gives them the edge."
              </blockquote>

              <p>
                Furthermore, the integration of the power unit with the chassis allows for a tighter packaging around the rear, reducing drag without compromising cooling efficiency. This dual-threat capability makes it nearly impossible to out-develop over a single season.
              </p>
            </div>

            {/* 4. TAGS KATEGORI DI BAWAH ARTIKEL */}
            <div className="flex flex-wrap gap-2 my-10 pt-6 border-t border-gray-800">
              <span className="bg-[#1A1A1A] border border-gray-800 text-gray-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">F1 Tech</span>
              <span className="bg-[#1A1A1A] border border-gray-800 text-gray-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">Aerodynamics</span>
              <span className="bg-[#1A1A1A] border border-gray-800 text-gray-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">Telemetry</span>
            </div>

            {/* 5. KOLOM KOMENTAR */}
            <div className="border-t border-gray-800 pt-10 mt-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaRegComment className="mr-3 text-[#E10600]" /> Discussion ({comments.length})
              </h3>

              {/* Form Komentar */}
              <form onSubmit={handleAddComment} className="mb-8 bg-[#1A1A1A] p-5 rounded-lg border border-gray-800">
                <textarea 
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={isAuthenticated ? "Share your thoughts on this analysis..." : "Login to join the paddock discussion..."}
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

              {/* List Komentar */}
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

          {/* KOLOM KANAN (SIDEBAR: RELATED ANALYSIS) */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white border-l-4 border-[#E10600] pl-3 uppercase">
                Related Analysis
              </h3>

              <div className="space-y-6">
                {/* Related Item 1 */}
                <div className="group cursor-pointer flex gap-4 items-center">
                  <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                    <img 
                      src="https://images.unsplash.com/photo-1517457221379-994df55845cb?q=80&w=600&auto=format&fit=crop" 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#E10600] uppercase tracking-widest">Telemetry</span>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2 mt-1">
                      Decoding Sector 2: Where Time is Lost
                    </h4>
                  </div>
                </div>

                {/* Related Item 2 */}
                <div className="group cursor-pointer flex gap-4 items-center">
                  <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                    <img 
                      src="https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=600&auto=format&fit=crop" 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#E10600] uppercase tracking-widest">Strategy</span>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#E10600] transition-colors leading-snug line-clamp-2 mt-1">
                      The Undercut: Analyzing Pit Stop Windows
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}