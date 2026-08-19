import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 

export default function Footer() {
  return (
    <footer className="bg-[#121212] py-16 mt-10 border-t border-gray-800 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center max-w-4xl mx-auto px-6">
        
        {/* Logo Tengah */}
        <Link to="/" className="mb-8 group">
          <img 
            src={logo} 
            alt="PitPage Logo" 
            className="h-24 md:h-32 object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>

        {/* Menu Navigasi */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-gray-400 font-medium mb-10">
          <Link to="/" className="hover:text-[#E10600] transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-[#E10600] transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-[#E10600] transition-colors">Cookie Policy</Link>
          <Link to="/" className="hover:text-[#E10600] transition-colors">Contact Support</Link>
        </div>

        {/* Copyright & Telemetry Data */}
        <div className="text-xs text-gray-500/70 text-center font-medium">
          &copy; {new Date().getFullYear()} PitPage. Data provided by official telemetry.
        </div>
        
      </div>
    </footer>
  );
}