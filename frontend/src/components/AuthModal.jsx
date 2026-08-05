import React from 'react';
import useAuthStore from '../store/useAuthStore';
import logo from '../assets/logo.png';

export default function AuthModal() {
  const { isModalOpen, closeModal, modalView, setModalView, login } = useAuthStore();

  // Jika state isModalOpen false, pop-up tidak akan muncul
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Area luar pop-up (klik untuk menutup) */}
      <div className="absolute inset-0" onClick={closeModal}></div>
      
      {/* Kotak Pop-up */}
      <div className="relative bg-[#1A1A1A] border border-gray-800 w-full max-w-md p-8 rounded-lg shadow-2xl z-10">
        
        {/* Tombol Tutup (X) */}
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          ✕
        </button>

        {/* Tampilan LOGIN */}
        {modalView === 'login' ? (
          <div>
            <div className="flex justify-center mb-6">
              <img src={logo} alt="PitPage Logo" className="h-8 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-1">Paddock Access</h2>
            <p className="text-sm text-gray-400 text-center mb-6">Enter your telemetry credentials to continue.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email or Username</label>
                <input type="text" placeholder="driver@team.com" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                  <span className="text-[10px] text-[#E10600] cursor-pointer hover:underline">Forgot?</span>
                </div>
                <input type="password" placeholder="••••••••" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required />
              </div>
              
              <div className="flex items-center space-x-2 my-4">
                <input type="checkbox" className="accent-[#E10600] w-4 h-4 bg-[#121212] border-gray-800 rounded-sm" />
                <label className="text-xs text-gray-400">Remember telemetry session</label>
              </div>

              <button type="submit" className="w-full bg-[#E10600] hover:bg-red-700 text-white font-bold py-2.5 rounded-sm flex items-center justify-center transition-colors text-sm tracking-widest uppercase">
                ➔ ENGAGE
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="px-3 text-[10px] text-gray-500 uppercase tracking-widest">Or Connect Via</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <div className="flex space-x-3 mb-6">
              <button className="flex-1 bg-[#121212] border border-gray-800 hover:border-gray-600 text-white py-2 rounded-sm text-xs font-semibold flex items-center justify-center transition-colors">
                 Google
              </button>
              <button className="flex-1 bg-[#121212] border border-gray-800 hover:border-gray-600 text-white py-2 rounded-sm text-xs font-semibold flex items-center justify-center transition-colors">
                 Apple
              </button>
            </div>

            <div className="text-center text-[10px] text-gray-500">
              <p>Protected by PitPage Security.</p>
              <p>Telemetry data encrypted end-to-end.</p>
              <p className="mt-4">
                Don't have an account? <span onClick={() => setModalView('register')} className="text-[#E10600] cursor-pointer hover:underline font-bold">Register</span>
              </p>
            </div>
          </div>
        ) : (
          
          /* Tampilan REGISTER */
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-sm text-gray-400 mb-6">Join the paddock for exclusive data and insights.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" placeholder="Charles Leclerc" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input type="email" placeholder="driver@team.com" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" />
              </div>

              <div className="space-y-2 mt-4 mb-6">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="accent-[#E10600] w-4 h-4 bg-[#121212] border-gray-800 mt-0.5" />
                  <label className="text-xs text-gray-400">I agree to the <span className="text-[#E10600]">Terms of Service</span> and <span className="text-[#E10600]">Privacy Policy</span></label>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="accent-[#E10600] w-4 h-4 bg-[#121212] border-gray-800 mt-0.5" />
                  <label className="text-xs text-gray-400">Join the PitPage Newsletter for exclusive updates</label>
                </div>
              </div>

              <button type="button" onClick={() => setModalView('login')} className="w-full bg-transparent border border-gray-700 hover:border-gray-500 text-white font-bold py-2.5 rounded-sm flex items-center justify-center transition-colors text-xs tracking-widest uppercase mb-4">
                CREATE ACCOUNT
              </button>
            </form>

            <div className="text-center border-t border-gray-800 pt-6 mt-2">
              <p className="text-xs text-gray-400">
                Already have an account? <span onClick={() => setModalView('login')} className="text-[#E10600] cursor-pointer hover:underline font-bold">Login</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}