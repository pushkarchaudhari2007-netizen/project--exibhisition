/**
 * GreenCoach AI - Main Application Entry
 * Voice-first, multilingual, offline-ready AI co-pilot for smallholder farmers
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { BottomNav, ScreenTab } from './components/BottomNav.tsx';
import { HomeView } from './components/HomeView.tsx';
import { DiagnoseFlow } from './components/DiagnoseFlow.tsx';
import { HealthWellnessView } from './components/HealthWellnessView.tsx';
import { FarmFitnessView } from './components/FarmFitnessView.tsx';
import { MyFarmView } from './components/MyFarmView.tsx';
import { FieldGuideView } from './components/FieldGuideView.tsx';
import { FieldMapView } from './components/FieldMapView.tsx';
import { OutbreakForecastView } from './components/OutbreakForecastView.tsx';
import { SelfDiagnosisModal } from './components/SelfDiagnosisModal.tsx';
import { ExtensionWorkerPortal } from './components/ExtensionWorkerPortal.tsx';
import { VoiceHubModal } from './components/VoiceHubModal.tsx';
import { TestRunnerModal } from './components/TestRunnerModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { syncManager } from './lib/syncManager.ts';
import { 
  auth, 
  onAuthStateChanged, 
  FirebaseUser,
  fetchUserProfile, 
  fetchUserFarm, 
  fetchUserDiagnoses, 
  saveUserDiagnosis, 
  logOutUser 
} from './lib/firebase.ts';
import { Diagnosis, Farm, Farmer, FieldGuideItem, LanguageCode } from '../shared/types.ts';
import { WifiOff, AlertCircle, Mic } from 'lucide-react';
import { TRANSLATIONS } from './lib/translations.ts';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('hi');
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [currentRole, setCurrentRole] = useState<'farmer' | 'extension_worker'>('farmer');

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const [isVoiceHubOpen, setIsVoiceHubOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);

  // Auth & Account state
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Self-diagnosis modal state
  const [isSelfDiagModalOpen, setIsSelfDiagModalOpen] = useState(false);
  const [selectedSelfDiagItem, setSelectedSelfDiagItem] = useState<FieldGuideItem | null>(null);

  // Farmer & Farm profile state
  const [farmer, setFarmer] = useState<Farmer>({
    farmer_id: 'farmer-ramesh',
    name: 'Ramesh Patil',
    village_id: 'vil-khadakwasla',
    language_pref: 'hi',
    phone_number: '******7890',
    onboarded_at: '2026-06-15T08:00:00Z',
    consent_health_data: true,
    consent_leaderboard_public: true
  });

  const [farm, setFarm] = useState<Farm>({
    farm_id: 'farm-ramesh',
    farmer_id: 'farmer-ramesh',
    crop_types: ['cotton', 'tomato'],
    acreage: 1.5,
    geo_location: { lat: 18.432, lng: 73.765 },
    soil_type: 'Medium Black Loam'
  });

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [recentDiagnosis, setRecentDiagnosis] = useState<Diagnosis | null>(null);

  // Listen to Firebase Auth state & sync user progress from Firestore
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        setFirebaseUser(user);
        // Load custom profile from Firestore
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setFarmer({
            farmer_id: user.uid,
            name: profile.displayName || user.displayName || 'Farmer',
            village_id: profile.villageId || 'vil-khadakwasla',
            language_pref: profile.languagePref || 'hi',
            phone_number: profile.phoneNumber || user.phoneNumber || '******7890',
            onboarded_at: profile.createdAt || new Date().toISOString(),
            consent_health_data: profile.consentHealthData ?? true,
            consent_leaderboard_public: profile.consentLeaderboardPublic ?? true
          });
          if (profile.languagePref) setLanguage(profile.languagePref);
          if (profile.role) setCurrentRole(profile.role);
        } else {
          setFarmer(prev => ({
            ...prev,
            farmer_id: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Farmer'
          }));
        }

        // Load farm parcels from Firestore
        const userFarm = await fetchUserFarm(user.uid);
        if (userFarm) {
          setFarm(userFarm);
        }

        // Load diagnoses history from Firestore
        const userDiags = await fetchUserDiagnoses(user.uid);
        if (userDiags && userDiags.length > 0) {
          setDiagnoses(userDiags);
          setRecentDiagnosis(userDiags[0]);
        }
      } else {
        setFirebaseUser(null);
      }
    });

    return () => unsubAuth();
  }, []);

  // Sync manager lifecycle
  useEffect(() => {
    const unsub = syncManager.subscribe((online, count) => {
      setIsOnline(online);
      setPendingSyncCount(count);
    });
    return unsub;
  }, []);

  // Fetch default profile & diagnoses for fallback / initial display
  useEffect(() => {
    fetch('/api/auth/current?role=farmer')
      .then(res => res.json())
      .then(data => {
        if (!firebaseUser) {
          if (data.farmer) setFarmer(data.farmer);
          if (data.farm) setFarm(data.farm);
        }
      })
      .catch(console.error);

    fetch('/api/diagnoses?farm_id=farm-ramesh')
      .then(res => res.json())
      .then(data => {
        if (!firebaseUser && Array.isArray(data)) {
          setDiagnoses(data);
          if (data.length > 0) setRecentDiagnosis(data[0]);
        }
      })
      .catch(console.error);
  }, [firebaseUser]);

  const handleUpdateConsent = async (granted: boolean) => {
    setFarmer(prev => ({ ...prev, consent_health_data: granted }));
    try {
      await fetch(`/api/farmers/${farmer.farmer_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent_health_data: granted })
      });
    } catch (err) {
      console.warn('Consent update saved locally:', err);
    }
  };

  const handleDiagnosisAdded = (newDiag: Diagnosis) => {
    setDiagnoses(prev => [newDiag, ...prev]);
    setRecentDiagnosis(newDiag);
    // If logged into Firebase, save directly to user's Firestore diagnoses collection
    if (firebaseUser) {
      saveUserDiagnosis(firebaseUser.uid, newDiag).catch(err => {
        console.warn('Diagnosis saved to local sync queue:', err);
      });
    }
  };

  const handleAuthSuccess = (profile: any) => {
    setFarmer(prev => ({
      ...prev,
      farmer_id: profile.uid,
      name: profile.displayName,
      village_id: profile.villageId || prev.village_id,
      language_pref: profile.languagePref || prev.language_pref
    }));
    if (profile.languagePref) setLanguage(profile.languagePref);
    if (profile.role) setCurrentRole(profile.role);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;

  const quickNavTabs = [
    { id: 'home', label: t.navHome, icon: '🏠' },
    { id: 'diagnose', label: t.navDiagnose, icon: '📸' },
    { id: 'guide', label: t.navFieldGuide, icon: '📖' },
    { id: 'map', label: t.navFieldMap, icon: '🗺️' },
    { id: 'forecasts', label: t.navForecasts, icon: '⛈️' },
    { id: 'health', label: t.navHealth, icon: '❤️' },
    { id: 'fitness', label: t.navFitness, icon: '🏆' },
    { id: 'farm', label: t.navFarm, icon: '🚜' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
      
      {/* Device wrapper: Can toggle between authentic mobile shell or luxurious fluid layout */}
      <div className={`w-full transition-all duration-300 flex flex-col flex-1 ${
        isMobileDeviceView
          ? 'max-w-[420px] mx-auto my-6 rounded-[2.5rem] shadow-2xl border-8 border-stone-900 bg-[#FBF9F5] overflow-hidden relative'
          : 'w-full bg-[#F8F6F0]'
      }`}>

        {/* Mobile Device Status Bar Header if in frame mode */}
        {isMobileDeviceView && (
          <div className="bg-stone-900 text-stone-300 px-7 py-2 flex items-center justify-between text-[11px] font-semibold shrink-0">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top App Bar Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          isOnline={isOnline}
          onToggleSimulatedOffline={(offline) => syncManager.setSimulatedOffline(offline)}
          pendingSyncCount={pendingSyncCount}
          currentRole={currentRole}
          onSwitchRole={setCurrentRole}
          onOpenTestRunner={() => setIsTestRunnerOpen(true)}
          isMobileDeviceView={isMobileDeviceView}
          onToggleMobileDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
          currentUser={firebaseUser ? { displayName: farmer.name, email: firebaseUser.email || undefined } : null}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSignOut={async () => {
            await logOutUser();
            setFirebaseUser(null);
          }}
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Offline Banner Notification */}
        {!isOnline && (
          <div className="bg-amber-600 text-amber-50 px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>{t.offlineBannerMsg}</span>
            </div>
            {pendingSyncCount > 0 && (
              <span className="text-[10px] font-black bg-amber-800 px-2 py-0.5 rounded-full shrink-0">
                {pendingSyncCount} Q
              </span>
            )}
          </div>
        )}

        {/* Farmer Quick Mode Switcher Pills (Visible on mobile/tablet or in mobile device frame) */}
        {currentRole === 'farmer' && (
          <div className={`${isMobileDeviceView ? 'flex' : 'lg:hidden flex'} bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 items-center gap-2 overflow-x-auto no-scrollbar shrink-0 shadow-2xs`}>
            {quickNavTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as ScreenTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === tab.id
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto ${
          isMobileDeviceView ? 'p-4' : 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }`}>
          {currentRole === 'extension_worker' ? (
            <ExtensionWorkerPortal onBackToFarmer={() => setCurrentRole('farmer')} />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeView
                  language={language}
                  farmer={farmer}
                  farm={farm}
                  recentDiagnosis={recentDiagnosis}
                  onNavigateTo={(screen) => {
                    if (screen === 'village') setCurrentTab('fitness');
                    else setCurrentTab(screen as ScreenTab);
                  }}
                  onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
                />
              )}

              {currentTab === 'diagnose' && (
                <DiagnoseFlow
                  language={language}
                  farmerName={farmer.name}
                  farmId={farm.farm_id}
                  farmerId={farmer.farmer_id}
                  onDiagnosisComplete={handleDiagnosisAdded}
                  onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
                  onViewOnMap={() => setCurrentTab('map')}
                />
              )}

              {currentTab === 'guide' && (
                <FieldGuideView
                  language={language}
                  onOpenSelfDiagnosis={(item) => {
                    setSelectedSelfDiagItem(item);
                    setIsSelfDiagModalOpen(true);
                  }}
                />
              )}

              {currentTab === 'map' && (
                <FieldMapView
                  language={language}
                  farm={farm}
                  diagnoses={diagnoses}
                  onSelectDiagnosis={(_d) => {
                    setCurrentTab('diagnose');
                  }}
                />
              )}

              {currentTab === 'forecasts' && (
                <OutbreakForecastView
                  language={language}
                  onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
                />
              )}

              {currentTab === 'health' && (
                <HealthWellnessView
                  language={language}
                  farmerName={farmer.name}
                  farmerId={farmer.farmer_id}
                  hasConsent={farmer.consent_health_data}
                  onUpdateConsent={handleUpdateConsent}
                  onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
                />
              )}

              {currentTab === 'fitness' && (
                <FarmFitnessView
                  language={language}
                  farmId={farm.farm_id}
                  farmerName={farmer.name}
                  onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
                />
              )}

              {currentTab === 'farm' && (
                <MyFarmView
                  language={language}
                  farm={farm}
                  farmer={farmer}
                  diagnoses={diagnoses}
                  onSelectDiagnosis={(_diag) => {
                    setCurrentTab('diagnose');
                  }}
                  onViewOnMap={() => setCurrentTab('map')}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Nav Bar (visible on mobile screens only, hidden on wide desktop) */}
        {currentRole === 'farmer' && (
          <div className={isMobileDeviceView ? 'block' : 'lg:hidden'}>
            <BottomNav
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              language={language}
              onOpenVoiceHub={() => setIsVoiceHubOpen(true)}
            />
          </div>
        )}

      </div>

      {/* Floating Hariya Voice Trigger on Desktop */}
      {!isMobileDeviceView && (
        <button
          onClick={() => setIsVoiceHubOpen(true)}
          className="hidden lg:flex fixed bottom-6 right-8 z-40 items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-[#06281C] to-[#0D4B34] text-white shadow-2xl border border-[#D4AF37]/50 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Talk with Hariya Voice Assistant"
        >
          <div className="w-9 h-9 rounded-full bg-white text-emerald-950 flex items-center justify-center font-bold ring-2 ring-[#D4AF37] group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5 text-emerald-900" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#E6CA65] block leading-none">Hariya Co-Pilot</span>
            <span className="text-xs font-bold text-white block mt-0.5">Voice Assistant</span>
          </div>
        </button>
      )}

      {/* Voice Assistant Modal (Hariya Persona) */}
      <VoiceHubModal
        isOpen={isVoiceHubOpen}
        onClose={() => setIsVoiceHubOpen(false)}
        language={language}
        farmerName={farmer.name}
        onNavigateTo={(screen) => {
          if (screen === 'village') setCurrentTab('fitness');
          else setCurrentTab(screen as ScreenTab);
        }}
      />

      {/* Standalone Self-Diagnosis Comparator Modal */}
      <SelfDiagnosisModal
        isOpen={isSelfDiagModalOpen}
        onClose={() => setIsSelfDiagModalOpen(false)}
        userImage={null}
        cropType="cotton"
        language={language}
        initialGuideItem={selectedSelfDiagItem}
        onConfirmMatch={(_item) => {
          setIsSelfDiagModalOpen(false);
          setCurrentTab('diagnose');
        }}
      />

      {/* Test Verification Suite Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />

      {/* Account Login & Registration Modal (Google & Email) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
