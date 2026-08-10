import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import logo from '../assets/logo.png';

export default function AuthModal() {
  const { isModalOpen, closeModal, modalView, setModalView, login, register } = useAuthStore();

  // State untuk menangkap inputan form
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // State untuk loading dan pesan error/sukses
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 🟢 FITUR BARU: Otomatis kosongkan form setiap kali modal ditutup
  useEffect(() => {
    if (!isModalOpen) {
      setLoginUser('');
      setLoginPass('');
      setRegName('');
      setRegUser('');
      setRegEmail('');
      setRegPass('');
      setRegConfirm('');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  // Fungsi ganti layar
  const switchView = (view) => {
    setModalView(view);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Eksekusi Login
const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const res = await login(loginUser, loginPass);
    if (res && res.success) {
      window.location.reload(); 
    } else { 
      setErrorMsg(res?.message || 'Gagal melakukan login.');
      setIsLoading(false);
    }
  };

  // Eksekusi Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPass !== regConfirm) {
      setErrorMsg('Konfirmasi password tidak cocok!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    const res = await register(regName, regUser, regEmail, regPass);
    if (res && res.success) {
      // 🟢 FITUR BARU: Notif Register Berhasil & Otomatis ke Login
      alert("🟢 REGISTRASI BERHASIL! Silakan login dengan akun barumu.");
      setRegName(''); setRegUser(''); setRegEmail(''); setRegPass(''); setRegConfirm('');
      switchView('login'); // Otomatis pindah ke tab login
    } else {
      setErrorMsg(res?.message || 'Gagal membuat akun.');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={closeModal}></div>
      
      <div className="relative bg-[#1A1A1A] border border-gray-800 w-full max-w-md p-8 rounded-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">✕</button>

        <div className="flex justify-center mb-6 mt-2">
          <img src={logo} alt="PitPage Logo" className="h-16 md:h-20 object-contain drop-shadow-xl" />
        </div>

        {/* Notifikasi Error / Sukses */}
        {errorMsg && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-xs text-center">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400 text-xs text-center">{successMsg}</div>}

        {/* --- TAMPILAN LOGIN --- */}
        {modalView === 'login' ? (
          <div>
            <h2 className="text-2xl font-bold text-white text-center mb-1">Paddock Access</h2>
            <p className="text-sm text-gray-400 text-center mb-6">Enter your telemetry credentials to continue.</p>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                <input 
                  type="text" 
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="driver99" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" 
                  required 
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                </div>
                <input 
                  type="password" 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#E10600] hover:bg-red-700 text-white font-bold py-2.5 rounded-sm flex items-center justify-center transition-colors text-sm tracking-widest uppercase mt-6 disabled:opacity-50"
              >
                {isLoading ? 'CONNECTING...' : '➔ ENGAGE'}
              </button>
            </form>

            <div className="text-center text-[10px] text-gray-500 mt-8">
              <p>Protected by PitPage Security.</p>
              <p className="mt-4">
                Don't have an account? <span onClick={() => switchView('register')} className="text-[#E10600] cursor-pointer hover:underline font-bold">Register</span>
              </p>
            </div>
          </div>
        ) : (
          
        /* --- TAMPILAN REGISTER --- */
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-sm text-gray-400 mb-6">Join the paddock for exclusive data and insights.</p>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                  placeholder="Charles Leclerc" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                <input 
                  type="text" value={regUser} onChange={(e) => setRegUser(e.target.value)}
                  placeholder="charles16" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="driver@team.com" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                <input 
                  type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#121212] border border-gray-800 text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-[#E10600]" required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-transparent border border-gray-700 hover:border-[#E10600] text-white hover:text-[#E10600] font-bold py-2.5 rounded-sm flex items-center justify-center transition-colors text-xs tracking-widest uppercase mt-6 disabled:opacity-50"
              >
                {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="text-center border-t border-gray-800 pt-6 mt-4">
              <p className="text-xs text-gray-400">
                Already have an account? <span onClick={() => switchView('login')} className="text-[#E10600] cursor-pointer hover:underline font-bold">Login</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}