import React, { useState } from 'react';
import { 
  X, User, Mail, Lock, ShieldCheck, Sparkles, 
  MapPin, Globe, CheckCircle2, AlertCircle, LogIn, UserPlus 
} from 'lucide-react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail 
} from '../lib/firebase.ts';
import { LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';
import { audioEngine } from '../lib/audioService.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onAuthSuccess: (userProfile: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onAuthSuccess
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'farmer' | 'extension_worker'>('farmer');
  const [villageId, setVillageId] = useState('vil-khadakwasla');
  const [languagePref, setLanguagePref] = useState<LanguageCode>(language);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      audioEngine.playSuccessChime();
      onAuthSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Farmer',
        role: 'farmer',
        villageId: 'vil-khadakwasla',
        languagePref
      });
      onClose();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setErrorMsg(err.message || 'Google sign-in could not be completed. Please check popup permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (activeTab === 'signin') {
        const user = await loginWithEmail(email, password);
        audioEngine.playSuccessChime();
        onAuthSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Farmer',
          role
        });
        onClose();
      } else {
        if (!displayName.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password should be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const user = await registerWithEmail(
          email,
          password,
          displayName,
          role,
          villageId,
          languagePref
        );
        audioEngine.playSuccessChime();
        onAuthSuccess({
          uid: user.uid,
          email: user.email,
          displayName,
          role,
          villageId,
          languagePref
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please verify your credentials or register a new account.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please switch to Sign In.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill sample credentials
  const fillDemoAccount = (demoRole: 'farmer' | 'extension') => {
    if (demoRole === 'farmer') {
      setEmail('ramesh.patil@greencoach.org');
      setPassword('farmer1234');
      setDisplayName('Ramesh Patil');
      setRole('farmer');
    } else {
      setEmail('sunita.deshmukh@krishi.gov.in');
      setPassword('officer1234');
      setDisplayName('Sunita Deshmukh');
      setRole('extension_worker');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GreenCoach AI Account</span>
            </div>
            <h2 className="text-xl font-black">
              {activeTab === 'signin' ? 'Welcome Back, Farmer' : 'Create Farmer Account'}
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Save your diagnoses, treatment logs & Farm Fitness score
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-200 bg-stone-100 p-1 shrink-0">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
            className={`flex-1 min-h-[42px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'signin'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(null); }}
            className={`flex-1 min-h-[42px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>New Registration</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* 1. Google Sign-in Button (First class citizen) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full min-h-[48px] rounded-2xl bg-white border border-stone-300 hover:border-emerald-500 hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99]"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] font-bold text-stone-700 uppercase">Or with email</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Farmer Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full h-11 pl-9 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Account Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full h-11 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="farmer">Farmer (किसान)</option>
                      <option value="extension_worker">Extension Worker (कृषि अधिकारी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Village
                    </label>
                    <select
                      value={villageId}
                      onChange={(e) => setVillageId(e.target.value)}
                      className="w-full h-11 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="vil-khadakwasla">Khadakwasla (खडकवासला)</option>
                      <option value="vil-ralegan">Ralegan Siddhi (राळेगण)</option>
                      <option value="vil-hiware">Hiware Bazar (हिवरे बाजार)</option>
                      <option value="vil-patan">Patan (पाटण)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full h-11 pl-9 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-9 pr-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[48px] rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{activeTab === 'signin' ? 'Sign In to My Account' : 'Register & Start Farming'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <span className="text-[11px] font-bold text-stone-700 block">
              Quick 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('farmer')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 text-left border border-stone-200 transition-colors"
              >
                <span className="text-xs font-bold block">Ramesh Patil</span>
                <span className="text-[10px] text-stone-700">Farmer · Cotton/Tomato</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('extension')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 text-left border border-stone-200 transition-colors"
              >
                <span className="text-xs font-bold block">Sunita Deshmukh</span>
                <span className="text-[10px] text-stone-700">Extension Officer · Pune</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
