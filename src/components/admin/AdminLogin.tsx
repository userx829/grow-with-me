import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Lock, ArrowRight, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView, siteContent } = useProjects();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafaf5] dark:bg-[#151715] text-[#1a1c19] dark:text-[#f1f1ec] transition-colors">
      <div className="w-full max-w-md bg-[#f4f4ef] dark:bg-[#1c1f1c] p-8 sm:p-10 rounded-3xl border border-[#eeeee9] dark:border-[#2a302a] shadow-xl flex flex-col gap-6 relative">
        {/* Top Back Link */}
        <button
          onClick={() => setCurrentView('portfolio')}
          className="self-start text-xs font-semibold text-[#414844] dark:text-[#b9c1ba] hover:text-[#2d5342] dark:hover:text-[#528c70] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        {/* Lock Icon & Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2d5342]/10 dark:bg-[#528c70]/20 text-[#2d5342] dark:text-[#528c70] flex items-center justify-center mb-1">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1a1c19] dark:text-[#f1f1ec]">
            Creator Studio Lock
          </h2>
          <p className="text-xs text-[#414844] dark:text-[#b9c1ba]">
            Authorized access only for {siteContent.brandName}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1a1c19] dark:text-[#f1f1ec]">
              Enter Studio Passcode
            </label>
            <div className={`relative ${shake ? 'animate-shake' : ''}`}>
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                autoFocus
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter password..."
                className={`w-full bg-[#fafaf5] dark:bg-[#151715] pl-4 pr-11 py-3 rounded-xl text-sm text-[#1a1c19] dark:text-[#f1f1ec] border transition-all focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-[#eeeee9] dark:border-[#2a302a] focus:ring-[#2d5342]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#414844] dark:text-[#b9c1ba] hover:text-[#1a1c19] dark:hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs font-medium text-rose-500 mt-1">
                Incorrect passcode. Access denied.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2d5342] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#456b59] transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 mt-2"
          >
            <span>Unlock Studio Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#eeeee9] dark:border-[#2a302a] text-[11px] text-[#414844] dark:text-[#b9c1ba]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2d5342] dark:text-[#528c70]" />
          <span>Protected Administrative Access</span>
        </div>
      </div>
    </div>
  );
};
