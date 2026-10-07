import React, { useState, useEffect } from 'react';
import { Mic, Volume2, VolumeX, X, Send, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../lib/audioService.ts';
import { LanguageCode } from '../../shared/types.ts';
import { TRANSLATIONS } from '../lib/translations.ts';

interface VoiceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  farmerName: string;
  onNavigateTo: (screen: 'home' | 'diagnose' | 'health' | 'fitness' | 'farm' | 'village') => void;
}

interface Message {
  id: string;
  sender: 'hariya' | 'farmer';
  text: string;
  intent?: string;
  actions?: string[];
}

export const VoiceHubModal: React.FC<VoiceHubModalProps> = ({
  isOpen,
  onClose,
  language,
  farmerName,
  onNavigateTo
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.hi;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const greeting = t.hariyaGreetingDefault;
      setMessages([
        {
          id: 'welcome',
          sender: 'hariya',
          text: greeting,
          intent: 'greeting',
          actions: [t.navDiagnose, t.heatStressAlert, t.villageChallengeTitle]
        }
      ]);
      if (voiceEnabled) {
        setIsSpeaking(true);
        audioEngine.playSuccessChime();
        audioEngine.speakText(greeting, language, () => setIsSpeaking(false));
      }
    } else {
      audioEngine.stopSpeaking();
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, [isOpen, language, voiceEnabled]);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'farmer',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await fetch('/api/hariya/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language,
          farmer_id: 'farmer-ramesh'
        })
      });

      const data = await res.json();
      const hariyaMsg: Message = {
        id: `hariya-${Date.now()}`,
        sender: 'hariya',
        text: data.spoken_text || data.display_text,
        intent: data.detected_intent,
        actions: data.suggested_actions
      };

      setMessages(prev => [...prev, hariyaMsg]);

      // Play audio earcon and speak
      if (data.audio_earcon === 'alert_gentle') {
        audioEngine.playGentleAlert();
      } else {
        audioEngine.playSuccessChime();
      }

      if (voiceEnabled) {
        setIsSpeaking(true);
        audioEngine.speakText(data.spoken_text, language, () => setIsSpeaking(false));
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `fallback-${Date.now()}`,
        sender: 'hariya',
        text: language === 'mr' 
          ? 'माफ करा, मी पुन्हा प्रयत्न करत आहे. तुम्ही विचारलेला प्रश्न पुन्हा सांगा.' 
          : 'क्षमा करें, कृपया दोबारा पूछें। मैं आपकी सहायता के लिए तैयार हूँ।'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action.includes(t.navDiagnose) || action.includes('Diagnose') || action.includes('जांच')) {
      onClose();
      onNavigateTo('diagnose');
    } else if (action.includes('Heat') || action.includes('धूप') || action.includes('उकाडा') || action.includes(t.heatStressAlert)) {
      onClose();
      onNavigateTo('health');
    } else if (action.includes('Village') || action.includes('गाँव') || action.includes('गाव') || action.includes('Challenge')) {
      onClose();
      onNavigateTo('fitness');
    } else {
      handleSendQuery(action);
    }
  };

  const handleSimulateVoiceInput = () => {
    // If Web Speech recognition available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        if (transcript) handleSendQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        handleSendQuery(language === 'mr' ? 'कपाशीवर काय फवारावे?' : 'नीम का अर्क कैसे बनाएं?');
      };
    } else {
      // Friendly speech simulation fallback
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const defaultPrompt = language === 'mr'
          ? 'कपाशीच्या पानावरील ठिपक्यांवर सेंद्रिय उपाय काय?'
          : 'कपास की पत्ती पर धब्बे हैं, नीम का स्प्रे कैसे करें?';
        handleSendQuery(defaultPrompt);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 flex flex-col h-[90vh] max-h-[700px] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center text-emerald-100 shadow-inner">
              <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{t.hariyaTitle}</h2>
              <p className="text-xs text-emerald-200/90 font-medium">{t.hariyaRole}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (voiceEnabled) audioEngine.stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-2 rounded-xl text-emerald-100 hover:bg-emerald-700/50 transition-colors"
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
              aria-label="Toggle voice output"
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-amber-300" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-100 hover:bg-emerald-700/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'farmer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'farmer'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none'
                }`}
              >
                {msg.sender === 'hariya' && (
                  <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-stone-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Hariya
                    </span>
                    {voiceEnabled && (
                      <button
                        onClick={() => {
                          audioEngine.speakText(msg.text, language);
                          setIsSpeaking(true);
                        }}
                        className="text-stone-400 hover:text-emerald-700 p-1"
                        title="Replay audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Action suggestions */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(act)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 shadow-xs transition-colors"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isSpeaking && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-200/50 w-fit">
              <Volume2 className="w-4 h-4 animate-bounce text-emerald-600" />
              <span>{t.hariyaSpeaking}</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 w-fit animate-pulse">
              <Mic className="w-4 h-4 text-amber-600" />
              <span>{t.hariyaListening}</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/70 overflow-x-auto flex gap-2 no-scrollbar">
          <button
            onClick={() => handleSendQuery(language === 'mr' ? 'कपाशीवर काय उपाय करावा?' : 'कपास की फसल में क्या स्प्रे करें?')}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800 transition-colors font-medium shadow-2xs"
          >
            {language === 'mr' ? '🌱 कपाशीवरील उपाय' : '🌱 कपास पर उपाय'}
          </button>
          <button
            onClick={() => handleSendQuery(language === 'mr' ? 'आज शेतात उकाडा कसा आहे?' : 'आज धूप और लू कैसी है?')}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800 transition-colors font-medium shadow-2xs"
          >
            {language === 'mr' ? '☀️ ऊन व हवामान' : '☀️ धूप व मौसम'}
          </button>
          <button
            onClick={() => handleSendQuery(language === 'mr' ? 'मला चक्कर येत आहे' : 'मुझे चक्कर आ रहा है')}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-colors font-medium shadow-2xs"
          >
            {language === 'mr' ? '⚠️ चक्कर येतेय' : '⚠️ चक्कर आ रहा है'}
          </button>
        </div>

        {/* Input & Big Voice Action Bar */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateVoiceInput}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all ${
              isListening
                ? 'bg-amber-600 text-white ring-4 ring-amber-300 animate-pulse'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95'
            }`}
            title="Tap to speak"
            aria-label="Microphone input"
          >
            <Mic className="w-7 h-7" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(inputText)}
              placeholder={language === 'mr' ? 'हरियाला विचारा किंवा बोला...' : 'हरिया से पूछें या बोलें...'}
              className="w-full h-12 pl-4 pr-12 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSendQuery(inputText)}
              disabled={!inputText.trim()}
              className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-emerald-800"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
