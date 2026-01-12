
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#0a0715] text-white overflow-hidden font-display">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center brightness-50 opacity-60"
        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsxT2fyyB7FLmUAJKaVT--aEBU9MApzmUplTvgjhKVw3VnWDNfeZdvnHK5yknUVSWelUeCDMcN1OKYbrg19gsTGHvOh2HUFw-hiRYYqc2CERQEN0IaV2dpEEV_nLojPQ6ezWWzozpxmAbs99BV-dRwe1uUahK0FYGoehztntrotUwATgj0Wxvh6nvXHB8ZuTV4SEIU_rEKoGadDdVTfhzOvoFtWiYHy9NMjQ2tMjedTJR2CL6G1IBo7mcbMym5Jff5dpXk1oAVD1cy')` }}
      />
      <div className="absolute inset-0 z-1 w-full h-full bg-gradient-to-b from-[#1e003c80] to-[#0a0014e6] mix-blend-hard-light" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-12 h-full">
        <div className="w-full flex justify-start mb-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-white/50 flex items-center justify-center font-bold text-xl">C</div>
            <span className="font-bold text-xl tracking-tight text-white/90">CouCou</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuD54VNdHpKbv2mgyWGEv9U-Q0ZVysP9Io9JmHMr-K_xlsZCApFLRbVHIq_OIIEcBw4EX5_qCA2n7YCrnV8t-g3gz2cRnUR4p2nE9fro9GNZ_4_kcGcM0yI7pMSK_NZYdyNgzUwunke_OZfoYv9aArxKCWn3wTVHeUdt2KYdAPpLTYij1_6HsNUiBe_lGOGLLj4odeVtmr35_LykgCfPGwRMuuFYRCY8apqxHQmZGVsD3NHTwEUE1GNLz-_E46acvY_IEHiRc8Sw82Pp" 
               className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
               alt="Active lifestyle"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
             <div className="absolute bottom-4 left-4 right-4 text-white/90 font-medium">
               <span className="block text-[#00e5e5] text-[10px] font-bold uppercase tracking-wider mb-1">Upcoming Event / 即将开始</span>
               夜市跑 Night Market Run
               <div className="text-xs opacity-70 font-normal">今晚 Tonight • 8:00 PM</div>
             </div>
          </div>
        </div>

        <div className="w-full text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-lg">
            欢迎来到 <span className="text-[#00e5e5] drop-shadow-[0_0_15px_rgba(0,229,229,0.6)]">凑凑</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-1">一起运动、一起拼单、一起凑个热闹</p>
          <p className="text-white/50 text-base">Join the fun, together.</p>
        </div>

        <button 
          onClick={() => navigate('/home')}
          className="group relative w-full flex items-center justify-center gap-3 rounded-xl h-14 bg-[#00e5e5] text-[#0a0715] shadow-[0_0_20px_rgba(0,229,229,0.3)] hover:shadow-[0_0_30px_rgba(0,229,229,0.5)] active:scale-95 transition-all duration-300"
        >
          <span className="text-lg font-bold tracking-wide">立即开始</span>
          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        
        <p className="mt-4 text-[10px] text-white/40">
          点击开始即代表同意 <a className="underline hover:text-[#00e5e5]" href="#">用户协议</a> 和 <a className="underline hover:text-[#00e5e5]" href="#">隐私政策</a>
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
