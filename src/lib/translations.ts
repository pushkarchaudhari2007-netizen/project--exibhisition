/**
 * Multilingual Translations for GreenCoach AI
 * Source of Truth: PRD Section 18 & 04_Technical_Data_Content_REFINED.md
 */

import { LanguageCode } from '../../shared/types.js';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  navHome: string;
  navDiagnose: string;
  navHealth: string;
  navFitness: string;
  navFarm: string;
  navVillage: string;
  navExtensionWorker: string;
  
  // Voice Persona Hariya
  hariyaTitle: string;
  hariyaRole: string;
  hariyaPromptTapMic: string;
  hariyaListening: string;
  hariyaSpeaking: string;
  hariyaGreetingDefault: string;
  hariyaDiagnosePrompt: string;
  hariyaHeatPrompt: string;
  hariyaExplainMore: string;

  // Diagnose
  diagnoseTitle: string;
  capturePhoto: string;
  selectCrop: string;
  checkingCrop: string;
  qualityCheckTitle: string;
  qualityPassed: string;
  qualityFailed: string;
  retakePhoto: string;
  highConfidence: string;
  likelyConfidence: string;
  lowConfidence: string;
  ecoFirstRemedies: string;
  chemicalFallback: string;
  materialsNeeded: string;
  logTreatmentDone: string;
  treatmentLoggedSuccess: string;

  // Health
  healthTitle: string;
  heatStressAlert: string;
  hydrationTracker: string;
  symptomCheckin: string;
  drinkWaterNow: string;
  restingInShade: string;
  feelingFine: string;
  feelingDizzy: string;
  consentTitle: string;
  consentMessage: string;
  grantConsent: string;
  emergencyPhcContact: string;

  // Gamification
  farmFitnessScore: string;
  rollingAverage: string;
  ecoStreak: string;
  hydrationStreak: string;
  pesticideScore: string;
  soilScore: string;
  waterScore: string;
  healthScore: string;
  followthroughScore: string;
  villageRank: string;
  badgesTitle: string;
  villageChallengeTitle: string;

  // Offline & Common
  offlineMode: string;
  offlineBannerMsg: string;
  syncNow: string;
  allSynced: string;
  pendingSync: string;
  demoMode: string;
  switchRole: string;
  farmerRole: string;
  extensionOfficerRole: string;

  // New Features: Field Guide, Self-Diagnosis, Field Map & Rice Blast Forecast
  navFieldGuide: string;
  navFieldMap: string;
  navForecasts: string;
  fieldGuideTitle: string;
  selfDiagnosisTitle: string;
  rankedMatchesTitle: string;
  saveToFavorites: string;
  savedFavorites: string;
  outbreakForecastTitle: string;
  riceBlastForecast: string;
  compareWithGuide: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  hi: {
    appName: 'ग्रीनकोच AI',
    tagline: 'किसान का भरोसेमंद साथी',
    navHome: 'होम',
    navDiagnose: 'फसल जांचें',
    navHealth: 'स्वास्थ्य व धूप',
    navFitness: 'फार्म फिटनेस',
    navFarm: 'मेरा खेत',
    navVillage: 'गाँव हब',
    navExtensionWorker: 'विस्तार अधिकारी',
    
    hariyaTitle: 'हरिया साथी',
    hariyaRole: 'आपका आत्मीय कृषि व स्वास्थ्य साथी',
    hariyaPromptTapMic: 'हरिया से बात करने के लिए माइक छुएं',
    hariyaListening: 'हरिया सुन रहे हैं...',
    hariyaSpeaking: 'हरिया बोल रहे हैं...',
    hariyaGreetingDefault: 'राम राम रमेश जी! आज आपके खेत का क्या हाल है?',
    hariyaDiagnosePrompt: 'कृपया प्रभावित पत्ती की साफ फोटो लें।',
    hariyaHeatPrompt: 'रमेश जी, धूप तेज है। कृपया 10 मिनट छाया में आराम करें और पानी पिएं।',
    hariyaExplainMore: 'विस्तार से बताएं',

    diagnoseTitle: 'फसल रोग जांच',
    capturePhoto: 'फोटो खींचें',
    selectCrop: 'फसल चुनें',
    checkingCrop: 'आपकी फसल की जांच हो रही है...',
    qualityCheckTitle: 'फोटो गुणवत्ता जांच',
    qualityPassed: 'फोटो स्पष्ट है',
    qualityFailed: 'कृपया बेहतर रोशनी में फोटो लें',
    retakePhoto: 'दोबारा फोटो लें',
    highConfidence: 'सटीक पहचान (>85%)',
    likelyConfidence: 'संभावित पहचान (60-85%)',
    lowConfidence: 'अनिश्चित (<60%) - विस्तार अधिकारी समीक्षा',
    ecoFirstRemedies: 'प्राकृतिक व जैविक उपचार (पहले)',
    chemicalFallback: 'रासायनिक विकल्प (अंतिम उपाय)',
    materialsNeeded: 'आवश्यक सामग्री',
    logTreatmentDone: 'उपचार पूरा हुआ दर्ज करें',
    treatmentLoggedSuccess: 'उपचार दर्ज हो गया! फार्म फिटनेस स्कोर बढ़ा।',

    healthTitle: 'किसान स्वास्थ्य व लू सुरक्षा',
    heatStressAlert: 'लू व ताप सूचकांक चेतावनी',
    hydrationTracker: 'जलपान (पानी पीने) का समय',
    symptomCheckin: 'स्वास्थ्य जांच (आप कैसा महसूस कर रहे हैं?)',
    drinkWaterNow: 'पानी पिएं',
    restingInShade: 'छांव में आराम कर रहा हूँ',
    feelingFine: 'मैं ठीक हूँ, काम जारी रखूँ',
    feelingDizzy: 'चक्कर या कमजोरी लग रही है',
    consentTitle: 'स्वास्थ्य डेटा सहमति',
    consentMessage: 'हम आपकी सेहत सुरक्षित रखने और लू की चेतावनी देने के लिए सीमित स्वास्थ्य जानकारी दर्ज करते हैं।',
    grantConsent: 'हाँ, मुझे सहमति है',
    emergencyPhcContact: 'नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC): 108',

    farmFitnessScore: 'फार्म फिटनेस स्कोर',
    rollingAverage: '4-हफ्ते का औसत स्कोर',
    ecoStreak: 'सेंद्रिय / जैविक स्ट्रीक',
    hydrationStreak: 'जल सुरक्षा स्ट्रीक',
    pesticideScore: 'कीटनाशक नियंत्रण (30%)',
    soilScore: 'मृदा स्वास्थ्य (25%)',
    waterScore: 'जल दक्षता (20%)',
    healthScore: 'स्वास्थ्य अनुपालन (15%)',
    followthroughScore: 'सलाह पालन (10%)',
    villageRank: 'गाँव में स्थान',
    badgesTitle: 'सम्मान पदक',
    villageChallengeTitle: 'खरीफ 2026 गाँव पर्यावरण कप',

    offlineMode: 'ऑफ़लाइन मोड',
    offlineBannerMsg: 'इंटरनेट बंद है। डेटा फोन में सुरक्षित है और जुड़ने पर सिंक होगा।',
    syncNow: 'अभी सिंक करें',
    allSynced: 'सभी रिकॉर्ड सिंक हैं',
    pendingSync: 'सिंक कतार में बाकी',
    demoMode: 'स्थानीय मोड',
    switchRole: 'भूमिका बदलें',
    farmerRole: 'किसान (रमेश)',
    extensionOfficerRole: 'विस्तार अधिकारी (सुनीता)',

    navFieldGuide: 'फील्ड गाइड',
    navFieldMap: 'खेत का नक्शा',
    navForecasts: 'रोग प्रकोप अलर्ट',
    fieldGuideTitle: 'फसल कीट, रोग व खरपतवार गाइड',
    selfDiagnosisTitle: 'स्वयं-निदान फोटो तुलना',
    rankedMatchesTitle: 'AI शीर्ष संभावित परिणाम',
    saveToFavorites: 'पसंदीदा में सहेजें',
    savedFavorites: 'सहेजे गए उपचार',
    outbreakForecastTitle: 'मौसम व धान ब्लास्ट प्रकोप पूर्वानुमान',
    riceBlastForecast: 'धान ब्लास्ट (झोंका) प्रकोप जोखिम',
    compareWithGuide: 'गाइड से तुलना करें'
  },
  mr: {
    appName: 'ग्रीनकोच AI',
    tagline: 'शेतकऱ्यांचा विश्वासू सोबती',
    navHome: 'मुख्य',
    navDiagnose: 'पीक निदान',
    navHealth: 'आरोग्य व ऊन',
    navFitness: 'फार्म फिटनेस',
    navFarm: 'माझे शेत',
    navVillage: 'गाव केंद्र',
    navExtensionWorker: 'कृषी अधिकारी',
    
    hariyaTitle: 'हरिया मित्र',
    hariyaRole: 'आपला शेती व आरोग्य मार्गदर्शक',
    hariyaPromptTapMic: 'हरियाशी बोलण्यासाठी माइक दाबा',
    hariyaListening: 'हरिया ऐकत आहेत...',
    hariyaSpeaking: 'हरिया बोलत आहेत...',
    hariyaGreetingDefault: 'नमस्कार रमेश जी! आज शेतात कापूस कसा आहे?',
    hariyaDiagnosePrompt: 'कृपया प्रादुर्भाव झालेल्या पानाचा स्पष्ट फोटो काढा.',
    hariyaHeatPrompt: 'रमेश जी, उकाडा वाढला आहे. कृपया १० मिनिटे सावलीत बसा आणि पाणी प्या.',
    hariyaExplainMore: 'आणखी माहिती द्या',

    diagnoseTitle: 'पीक रोग निदान',
    capturePhoto: 'फोटो काढा',
    selectCrop: 'पीक निवडा',
    checkingCrop: 'पिकाची तपासणी सुरू आहे...',
    qualityCheckTitle: 'फोटो गुणवत्ता पडताळणी',
    qualityPassed: 'फोटो स्पष्ट आहे',
    qualityFailed: 'कृपया चांगल्या प्रकाशात फोटो काढा',
    retakePhoto: 'पुन्हा फोटो काढा',
    highConfidence: 'निश्चित निदान (>८५%)',
    likelyConfidence: 'संभाव्य निदान (६०-८५%)',
    lowConfidence: 'अंशतः खात्री (<६०%) - कृषी अधिकारी तपासणी',
    ecoFirstRemedies: 'सेंद्रिय व जैविक उपाय (प्रथम)',
    chemicalFallback: 'रासायनिक उपाय (शेवटचा पर्याय)',
    materialsNeeded: 'लागणारे साहित्य',
    logTreatmentDone: 'उपाय केला म्हणून नोंदवा',
    treatmentLoggedSuccess: 'नोंद झाली! फार्म फिटनेस गुण वाढले.',

    healthTitle: 'शेतकरी आरोग्य व उष्माघात सुरक्षा',
    heatStressAlert: 'उष्मा निर्देशांक व इशारा',
    hydrationTracker: 'पाणी पिण्याची आठवण',
    symptomCheckin: 'आरोग्य तपासणी (कसे वाटते आहे?)',
    drinkWaterNow: 'पाणी प्या',
    restingInShade: 'सावलीत विश्रांती घेत आहे',
    feelingFine: 'मी बरा आहे, काम चालू ठेवतो',
    feelingDizzy: 'चक्कर किंवा थकवा जाणवतोय',
    consentTitle: 'आरोग्य माहिती संमती',
    consentMessage: 'आपल्या सुरक्षेसाठी व उन्हाच्या त्रासापासून वाचवण्यासाठी आम्ही माहिती गोळा करतो.',
    grantConsent: 'होय, माझी संमती आहे',
    emergencyPhcContact: 'जवळचे प्राथमिक आरोग्य केंद्र (PHC): १०८',

    farmFitnessScore: 'फार्म फिटनेस स्कोअर',
    rollingAverage: '४ आठवड्यांची सरासरी',
    ecoStreak: 'सेंद्रिय सातत्य (स्ट्रीक)',
    hydrationStreak: 'आरोग्य सातत्य (स्ट्रीक)',
    pesticideScore: 'कीटकनाशक बचत (३०%)',
    soilScore: 'माती आरोग्य (२५%)',
    waterScore: 'पाणी कार्यक्षमता (२०%)',
    healthScore: 'आरोग्य काळजी (१५%)',
    followthroughScore: 'कृती पालन (१०%)',
    villageRank: 'गावातील क्रमवारी',
    badgesTitle: 'प्राप्त पदके',
    villageChallengeTitle: 'खरीप २०२६ गाव पर्यावरण चषक',

    offlineMode: 'ऑफलाइन मोड',
    offlineBannerMsg: 'इंटरनेट बंद आहे. माहिती सुरक्षित आहे, रेंज आल्यावर सिंक होईल.',
    syncNow: 'आता सिंक करा',
    allSynced: 'सर्व माहिती सिंक झाली',
    pendingSync: 'प्रलंबित नोंदी',
    demoMode: 'स्थानिक मोड',
    switchRole: 'भूमिका बदला',
    farmerRole: 'शेतकरी (रमेश)',
    extensionOfficerRole: 'कृषी अधिकारी (सुनीता)',

    navFieldGuide: 'शेत मार्गदर्शक',
    navFieldMap: 'शेताचा नकाशा',
    navForecasts: 'रोग प्रादुर्भाव अंदाज',
    fieldGuideTitle: 'पीक कीड, रोग व तण मार्गदर्शक',
    selfDiagnosisTitle: 'स्वयं-निदान फोटो तुलना',
    rankedMatchesTitle: 'AI शीर्ष संभाव्य परिणाम',
    saveToFavorites: 'आवडींमध्ये साठवा',
    savedFavorites: 'साठवलेले उपाय',
    outbreakForecastTitle: 'हवामान व भात करपा प्रादुर्भाव अंदाज',
    riceBlastForecast: 'भात करपा (ब्लास्ट) प्रादुर्भाव धोका',
    compareWithGuide: 'मार्गदर्शकाशी तुलना करा'
  },
  te: {
    appName: 'గ్రీన్‌కోచ్ AI',
    tagline: 'రైతు నమ్మకమైన నేస్తం',
    navHome: 'హోమ్',
    navDiagnose: 'పంట నిర్ధారణ',
    navHealth: 'ఆరోగ్యం & ఎండ',
    navFitness: 'ఫార్మ్ ఫిట్‌నెస్',
    navFarm: 'నా పొలం',
    navVillage: 'గ్రామ వేదిక',
    navExtensionWorker: 'అధికారి పోర్టల్',

    hariyaTitle: 'హరియా మిత్రుడు',
    hariyaRole: 'మీ వ్యవసాయ & ఆరోగ్య సహాయకుడు',
    hariyaPromptTapMic: 'హరియాతో మాట్లాడటానికి మైక్ నొక్కండి',
    hariyaListening: 'హరియా వింటున్నారు...',
    hariyaSpeaking: 'హరియా మాట్లాడుతున్నారు...',
    hariyaGreetingDefault: 'నమస్కారం రమేష్ గారూ! మీ పంట ఎలా ఉంది?',
    hariyaDiagnosePrompt: 'దయచేసి వ్యాధి సోకిన ఆకు ఫోటో తీయండి.',
    hariyaHeatPrompt: 'ఎండ తీవ్రంగా ఉంది. దయచేసి నీడలో విశ్రాంతి తీసుకోండి.',
    hariyaExplainMore: 'మరింత వివరించండి',

    diagnoseTitle: 'పంట వ్యాధి నిర్ధారణ',
    capturePhoto: 'ఫోటో తీయండి',
    selectCrop: 'పంటను ఎంచుకోండి',
    checkingCrop: 'పంటను తనిఖీ చేస్తున్నాము...',
    qualityCheckTitle: 'ఫోటో నాణ్యత',
    qualityPassed: 'ఫోటో స్పష్టంగా ఉంది',
    qualityFailed: 'మంచి వెలుతురులో ఫోటో తీయండి',
    retakePhoto: 'మళ్ళీ తీయండి',
    highConfidence: 'ఖచ్చితమైన నిర్ధారణ (>85%)',
    likelyConfidence: 'సంభావ్య నిర్ధారణ (60-85%)',
    lowConfidence: 'అనిశ్చిత నిర్ధారణ (<60%)',
    ecoFirstRemedies: 'సేంద్రీయ నివారణ చర్యలు',
    chemicalFallback: 'రసాయన ప్రత్యామ్నాయం',
    materialsNeeded: 'అవసరమైన సామాగ్రి',
    logTreatmentDone: 'నివారణ చర్య నమోదు చేయండి',
    treatmentLoggedSuccess: 'విజయవంతంగా నమోదైంది!',

    healthTitle: 'రైతు ఆరోగ్యం & ఉష్ణ రక్షణ',
    heatStressAlert: 'వేడి హెచ్చరిక',
    hydrationTracker: 'నీటి సేవన సమయం',
    symptomCheckin: 'ఆరోగ్య స్థితి',
    drinkWaterNow: 'నీరు త్రాగండి',
    restingInShade: 'నీడలో విశ్రాంతి',
    feelingFine: 'బాగానే ఉంది',
    feelingDizzy: 'తలతిరుగుతోంది',
    consentTitle: 'ఆరోగ్య సమాచార అనుమతి',
    consentMessage: 'మీ ఆరోగ్యాన్ని కాపాడటానికి సమాచారం అవసరం.',
    grantConsent: 'అంగీకరిస్తున్నాను',
    emergencyPhcContact: 'ప్రాథమిక ఆరోగ్య కేంద్రం: 108',

    farmFitnessScore: 'ఫార్మ్ ఫిట్‌నెస్ స్కోర్',
    rollingAverage: '4 వారాల సగటు',
    ecoStreak: 'సేంద్రీయ స్ట్రీక్',
    hydrationStreak: 'ఆరోగ్య స్ట్రీక్',
    pesticideScore: 'పురుగుమందు తగ్గింపు (30%)',
    soilScore: 'నేల ఆరోగ్యం (25%)',
    waterScore: 'నీటి సామర్థ్యం (20%)',
    healthScore: 'ఆరోగ్య నియమాలు (15%)',
    followthroughScore: 'ఆచరణ (10%)',
    villageRank: 'గ్రామ ర్యాంక్',
    badgesTitle: 'పతకాలు',
    villageChallengeTitle: 'గ్రామ పర్యావరణ పోటీ',

    offlineMode: 'ఆఫ్‌లైన్ మోడ్',
    offlineBannerMsg: 'ఇంటర్నెట్ లేదు. సమాచారం ఫోన్‌లో భద్రపరచబడింది.',
    syncNow: 'సింక్ చేయండి',
    allSynced: 'అన్నీ సింక్ అయ్యాయి',
    pendingSync: 'పెండింగ్ రికార్డులు',
    demoMode: 'డెమో మోడ్',
    switchRole: 'పాత్ర మార్చు',
    farmerRole: 'రైతు (రమేష్)',
    extensionOfficerRole: 'వ్యవసాయ అధికారి',

    navFieldGuide: 'ఫీల్డ్ గైడ్',
    navFieldMap: 'పొలం మ్యాప్',
    navForecasts: 'వ్యాధి హెచ్చరిక',
    fieldGuideTitle: 'చీడపీడలు, తెగుళ్ళు & కలుపు గైడ్',
    selfDiagnosisTitle: 'స్వీయ నిర్ధారణ ఫోటో పోలిక',
    rankedMatchesTitle: 'AI టాప్ సరిపోలిన ఫలితాలు',
    saveToFavorites: 'ఇష్టమైన వాటిలో భద్రపరచు',
    savedFavorites: 'భద్రపరిచిన నివారణలు',
    outbreakForecastTitle: 'వరి బ్లాస్ట్ వ్యాధి ముందస్తు అంచనా',
    riceBlastForecast: 'వరి బ్లాస్ట్ వ్యాప్తి ముప్పు',
    compareWithGuide: 'గైడ్‌తో పోల్చండి'
  },
  ta: {
    appName: 'கிரீன்கோச் AI',
    tagline: 'விவசாயியின் தோழன்',
    navHome: 'முகப்பு',
    navDiagnose: 'பயிர் ஆய்வு',
    navHealth: 'உடல்நலம் & வெப்பம்',
    navFitness: 'பண்ணை உடற்தகுதி',
    navFarm: 'என் பண்ணை',
    navVillage: 'கிராம மையம்',
    navExtensionWorker: 'அலுவலர் போர்டல்',

    hariyaTitle: 'ஹரியா தோழன்',
    hariyaRole: 'விவசாய & ஆரோக்கிய வழிகாட்டி',
    hariyaPromptTapMic: 'பேச மைக் பொத்தானை அழுத்தவும்',
    hariyaListening: 'ஹரியா கேட்கிறார்...',
    hariyaSpeaking: 'ஹரியா பேசுகிறார்...',
    hariyaGreetingDefault: 'வணக்கம் ரமேஷ் அவர்களே! பயிர் நிலை எப்படி உள்ளது?',
    hariyaDiagnosePrompt: 'பாதிக்கப்பட்ட இலையின் தெளிவான படம் எடுக்கவும்.',
    hariyaHeatPrompt: 'வெப்பம் அதிகம். நிழலில் ஓய்வெடுத்து தண்ணீர் குடியுங்கள்.',
    hariyaExplainMore: 'மேலும் விவரம்',

    diagnoseTitle: 'பயிர் நோய் கண்டறிதல்',
    capturePhoto: 'படம் எடுக்கவும்',
    selectCrop: 'பயிர் தேர்வு',
    checkingCrop: 'பயிர் ஆய்வு செய்யப்படுகிறது...',
    qualityCheckTitle: 'படத் தரம்',
    qualityPassed: 'படம் தெளிவாக உள்ளது',
    qualityFailed: 'நல்ல வெளிச்சத்தில் படம் எடுக்கவும்',
    retakePhoto: 'மீண்டும் எடுக்கவும்',
    highConfidence: 'உறுதியான முடிவு (>85%)',
    likelyConfidence: 'சாத்தியமான முடிவு (60-85%)',
    lowConfidence: 'நிச்சயமற்ற முடிவு (<60%)',
    ecoFirstRemedies: 'இயற்கை மருந்துகள்',
    chemicalFallback: 'இரசாயன முறை',
    materialsNeeded: 'தேவையான பொருட்கள்',
    logTreatmentDone: 'பதிவு செய்',
    treatmentLoggedSuccess: 'வெற்றிகரமாக பதிவு செய்யப்பட்டது!',

    healthTitle: 'விவசாயி உடல்நலம்',
    heatStressAlert: 'வெப்ப எச்சரிக்கை',
    hydrationTracker: 'தண்ணீர் பருகுதல்',
    symptomCheckin: 'உடல்நிலை பரிசோதனை',
    drinkWaterNow: 'தண்ணீர் குடியுங்கள்',
    restingInShade: 'நிழலில் ஓய்வு',
    feelingFine: 'நன்றாக உள்ளேன்',
    feelingDizzy: 'தலைச்சுற்றல் உள்ளது',
    consentTitle: 'அனுமதி கோரல்',
    consentMessage: 'பாதுகாப்பிற்காக சுகாதார தகவல்கள் தேவை.',
    grantConsent: 'ஒப்புக்கொள்கிறேன்',
    emergencyPhcContact: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலையம்: 108',

    farmFitnessScore: 'பண்ணை மதிப்பெண்',
    rollingAverage: '4 வார சராசரி',
    ecoStreak: 'இயற்கை முறை தொடர்',
    hydrationStreak: 'நீரேற்ற தொடர்',
    pesticideScore: 'பூச்சிக்கொல்லி குறைப்பு (30%)',
    soilScore: 'மண் வளம் (25%)',
    waterScore: 'நீர் பயன்பாடு (20%)',
    healthScore: 'உடல்நல அக்கறை (15%)',
    followthroughScore: 'செயல்முறை (10%)',
    villageRank: 'கிராம தரவரிசை',
    badgesTitle: 'விருதுகள்',
    villageChallengeTitle: 'கிராம சுற்றுச்சூழல் போட்டி',

    offlineMode: 'ஆஃப்லைன் முறை',
    offlineBannerMsg: 'இணையம் இல்லை. தகவல் பாதுகாப்பாக உள்ளது.',
    syncNow: 'இணைக்க',
    allSynced: 'முழுமையாக இணைக்கப்பட்டது',
    pendingSync: 'நிலுவையில் உள்ளவை',
    demoMode: 'டெமோ முறை',
    switchRole: 'பொறுப்பை மாற்றுக',
    farmerRole: 'விவசாயி',
    extensionOfficerRole: 'வேளாண் அலுவலர்',

    navFieldGuide: 'கள வழிகாட்டி',
    navFieldMap: 'பண்ணை வரைபடம்',
    navForecasts: 'நோய் முன்னறிவிப்பு',
    fieldGuideTitle: 'பூச்சிகள், நோய்கள் மற்றும் களைகள்',
    selfDiagnosisTitle: 'சுய பரிசோதனை ஒப்பீடு',
    rankedMatchesTitle: 'AI சிறந்த பொருத்தங்கள்',
    saveToFavorites: 'விருப்பங்களில் சேமி',
    savedFavorites: 'சேமிக்கப்பட்ட மருந்துகள்',
    outbreakForecastTitle: 'நெல் பிளாஸ்ட் நோய் முன்னறிவிப்பு',
    riceBlastForecast: 'நெல் பிளாஸ்ட் ஆபத்து',
    compareWithGuide: 'வழிகாட்டியுடன் ஒப்பிடுக'
  },
  kn: {
    appName: 'ಗ್ರೀನ್‌ಕೋಚ್ AI',
    tagline: 'ರೈತರ ನಂಬಿಕಸ್ಥ ಒಡನಾಡಿ',
    navHome: 'ಮುಖಪುಟ',
    navDiagnose: 'ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ',
    navHealth: 'ಆರೋಗ್ಯ & ಬಿಸಿಲು',
    navFitness: 'ಫಾರ್ಮ್ ಫಿಟ್‌ನೆಸ್',
    navFarm: 'ನನ್ನ ಜಮೀನು',
    navVillage: 'ಗ್ರಾಮ ಕೇಂದ್ರ',
    navExtensionWorker: 'ಕೃಷಿ ಅಧಿಕಾರಿ',

    hariyaTitle: 'ಹರಿಯಾ ಮಿತ್ರ',
    hariyaRole: 'ನಿಮ್ಮ ಕೃಷಿ ಮತ್ತು ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶಿ',
    hariyaPromptTapMic: 'ಹರಿಯಾ ಜೊತೆ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    hariyaListening: 'ಹರಿಯಾ ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ...',
    hariyaSpeaking: 'ಹರಿಯಾ ಮಾತನಾಡುತ್ತಿದ್ದಾರೆ...',
    hariyaGreetingDefault: 'ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ! ಜಮೀನಿನಲ್ಲಿ ಬೆಳೆ ಹೇಗಿದೆ?',
    hariyaDiagnosePrompt: 'ದಯವಿಟ್ಟು ರೋಗಪೀಡಿತ ಎಲೆಯ ಸ್ಪಷ್ಟ ಚಿತ್ರ ತೆಗೆಯಿರಿ.',
    hariyaHeatPrompt: 'ಬಿಸಿಲು ಹೆಚ್ಚಾಗಿದೆ. ನೆರಳಿನಲ್ಲಿ ಕುಳಿತು ನೀರು ಕುಡಿಯಿರಿ.',
    hariyaExplainMore: 'ಹೆಚ್ಚಿನ ವಿವರ',

    diagnoseTitle: 'ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷೆ',
    capturePhoto: 'ಚಿತ್ರ ತೆಗೆಯಿರಿ',
    selectCrop: 'ಬೆಳೆ ಆಯ್ಕೆ',
    checkingCrop: 'ಬೆಳೆ ತಪಾಸಣೆ ನಡೆಯುತ್ತಿದೆ...',
    qualityCheckTitle: 'ಚಿತ್ರದ ಗುಣಮಟ್ಟ',
    qualityPassed: 'ಚಿತ್ರ ಸ್ಪಷ್ಟವಾಗಿದೆ',
    qualityFailed: 'ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಚಿತ್ರ ತೆಗೆಯಿರಿ',
    retakePhoto: 'ಮತ್ತೆ ಚಿತ್ರ ತೆಗೆಯಿರಿ',
    highConfidence: 'ಖಚಿತ ರೋಗ ನಿರ್ಧಾರ (>85%)',
    likelyConfidence: 'ಸಂಭಾವ್ಯ ರೋಗ (60-85%)',
    lowConfidence: 'ಅನಿಶ್ಚಿತ ರೋಗ (<60%)',
    ecoFirstRemedies: 'ಸಾವಯವ ಮತ್ತು ನೈಸರ್ಗಿಕ ಪರಿಹಾರ',
    chemicalFallback: 'ರಾಸಾಯನಿಕ ಪರಿಹಾರ',
    materialsNeeded: 'ಅಗತ್ಯ ಸಾಮಗ್ರಿಗಳು',
    logTreatmentDone: 'ದಾಖಲಿಸಿ',
    treatmentLoggedSuccess: 'ದಾಖಲಾತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',

    healthTitle: 'ರೈತರ ಆರೋಗ್ಯ ಮತ್ತು ಬಿಸಿಲಿನ ರಕ್ಷಣೆ',
    heatStressAlert: 'ಶಾಖ ಸೂಚ್ಯಂಕ ಎಚ್ಚರಿಕೆ',
    hydrationTracker: 'ನೀರು ಕುಡಿಯುವ ನೆನಪು',
    symptomCheckin: 'ಆರೋಗ್ಯ ಪರಿಶೀಲನೆ',
    drinkWaterNow: 'ನೀರು ಕುಡಿಯಿರಿ',
    restingInShade: 'ನೆರಳಿನಲ್ಲಿ ವಿಶ್ರಾಂತಿ',
    feelingFine: 'ಆರಾಮವಾಗಿದ್ದೇನೆ',
    feelingDizzy: 'ತಲೆಸುತ್ತು ಬರುತ್ತಿದೆ',
    consentTitle: 'ಆರೋಗ್ಯ ಡೇಟಾ ಒಪ್ಪಿಗೆ',
    consentMessage: 'ನಿಮ್ಮ ರಕ್ಷಣೆಗಾಗಿ ಆರೋಗ್ಯ ವಿವರಗಳು ಅವಶ್ಯಕ.',
    grantConsent: 'ಒಪ್ಪಿಗೆ ನೀಡುತ್ತೇನೆ',
    emergencyPhcContact: 'ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ: 108',

    farmFitnessScore: 'ಫಾರ್ಮ್ ಫಿಟ್‌ನೆಸ್ ಅಂಕ',
    rollingAverage: '4 ವಾರಗಳ ಸರಾಸರಿ',
    ecoStreak: 'ಸಾವಯವ ಸತತತೆ',
    hydrationStreak: 'ಆರೋಗ್ಯ ಸತತತೆ',
    pesticideScore: 'ಕೀಟನಾಶಕ ಇಳಿಕೆ (30%)',
    soilScore: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ (25%)',
    waterScore: 'ನೀರಿನ ದಕ್ಷತೆ (20%)',
    healthScore: 'ಆರೋಗ್ಯ ಪಾಲನೆ (15%)',
    followthroughScore: 'ಅನುಷ್ಠಾನ (10%)',
    villageRank: 'ಗ್ರಾಮ ಶ್ರೇಯಾಂಕ',
    badgesTitle: 'ಪದಕಗಳು',
    villageChallengeTitle: 'ಖಾರೀಫ್ ಪರಿಸರ ಕಪ್',

    offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
    offlineBannerMsg: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಮಾಹಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    syncNow: 'ಸಿಂಕ್ ಮಾಡಿ',
    allSynced: 'ಎಲ್ಲಾ ಸಿಂಕ್ ಆಗಿದೆ',
    pendingSync: 'ಬಾಕಿ ಇರುವ ದಾಖಲೆಗಳು',
    demoMode: 'ಸ್ಥಳೀಯ ಮೋಡ್',
    switchRole: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    farmerRole: 'ರೈತ (ರಮೇಶ್)',
    extensionOfficerRole: 'ಕೃಷಿ ಅಧಿಕಾರಿ',

    navFieldGuide: 'ಫೀಲ್ಡ್ ಗೈಡ್',
    navFieldMap: 'ಜಮೀನಿನ ನಕ್ಷೆ',
    navForecasts: 'ರೋಗ ಮುನ್ಸೂಚನೆ',
    fieldGuideTitle: 'ಕೀಟಗಳು, ರೋಗಗಳು ಮತ್ತು ಕಳೆಗಳು',
    selfDiagnosisTitle: 'ಸ್ವಯಂ ರೋಗ ನಿರ್ಣಯ',
    rankedMatchesTitle: 'AI ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಗಳು',
    saveToFavorites: 'ಮೆಚ್ಚಿನವುಗಳಿಗೆ ಸೇರಿಸಿ',
    savedFavorites: 'ಉಳಿಸಿದ ಪರಿಹಾರಗಳು',
    outbreakForecastTitle: 'ಭತ್ತದ ಬ್ಲಾಸ್ಟ್ ರೋಗ ಮುನ್ಸೂಚನೆ',
    riceBlastForecast: 'ಭತ್ತದ ಬ್ಲಾಸ್ಟ್ ಅಪಾಯ',
    compareWithGuide: 'ಗೈಡ್ ಜೊತೆ ಹೋಲಿಸಿ'
  },
  pa: {
    appName: 'ਗ੍ਰੀਨਕੋਚ AI',
    tagline: 'ਕਿਸਾਨ ਦਾ ਸੱਚਾ ਸਾਥੀ',
    navHome: 'ਮੁੱਖ ਪੰਨਾ',
    navDiagnose: 'ਫ਼ਸਲ ਦੀ ਜਾਂਚ',
    navHealth: 'ਸਿਹਤ ਅਤੇ ਗਰਮੀ',
    navFitness: 'ਫ਼ਾਰਮ ਫਿਟਨੈਸ',
    navFarm: 'ਮੇਰਾ ਖੇਤ',
    navVillage: 'ਪਿੰਡ ਹੱਬ',
    navExtensionWorker: 'ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ',

    hariyaTitle: 'ਹਰੀਆ ਦੋਸਤ',
    hariyaRole: 'ਤੁਹਾਡਾ ਖੇਤੀ ਅਤੇ ਸਿਹਤ ਸਲਾਹਕਾਰ',
    hariyaPromptTapMic: 'ਹਰੀਆ ਨਾਲ ਗੱਲ ਕਰਨ ਲਈ ਮਾਈਕ ਦਬਾਓ',
    hariyaListening: 'ਹਰੀਆ ਸੁਣ ਰਹੇ ਹਨ...',
    hariyaSpeaking: 'ਹਰੀਆ ਬੋਲ ਰਹੇ ਹਨ...',
    hariyaGreetingDefault: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਰਮੇਸ਼ ਜੀ! ਖੇਤ ਵਿੱਚ ਫ਼ਸਲ ਕਿਵੇਂ ਹੈ?',
    hariyaDiagnosePrompt: 'ਕਿਰਪਾ ਕਰਕੇ ਬਿਮਾਰ ਪੱਤੇ ਦੀ ਸਾਫ਼ ਫ਼ੋਟੋ ਲਵੋ।',
    hariyaHeatPrompt: 'ਗਰਮੀ ਤੇਜ਼ ਹੈ, ਛਾਂ ਵਿੱਚ ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਓ।',
    hariyaExplainMore: 'ਹੋਰ ਵਿਸਥਾਰ ਦਿਓ',

    diagnoseTitle: 'ਫ਼ਸਲ ਬਿਮਾਰੀ ਜਾਂਚ',
    capturePhoto: 'ਫ਼ੋਟੋ ਖਿੱਚੋ',
    selectCrop: 'ਫ਼ਸਲ ਚੁਣੋ',
    checkingCrop: 'ਫ਼ਸਲ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...',
    qualityCheckTitle: 'ਫ਼ੋਟੋ ਦੀ ਗੁਣਵੱਤਾ',
    qualityPassed: 'ਫ਼ੋਟੋ ਸਾਫ਼ ਹੈ',
    qualityFailed: 'ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਿੱਚ ਦੁਬਾਰਾ ਫ਼ੋਟੋ ਲਵੋ',
    retakePhoto: 'ਦੁਬਾਰਾ ਖਿੱਚੋ',
    highConfidence: 'ਪੱਕੀ ਪਛਾਣ (>85%)',
    likelyConfidence: 'ਸੰਭਾਵਿਤ ਪਛਾਣ (60-85%)',
    lowConfidence: 'ਅਨਿਸ਼ਚਿਤ ਪਛਾਣ (<60%)',
    ecoFirstRemedies: 'ਕੁਦਰਤੀ ਅਤੇ ਜੈਵਿਕ ਇਲਾਜ',
    chemicalFallback: 'ਰਸਾਇਣਕ ਇਲਾਜ',
    materialsNeeded: 'ਲੋੜੀਂਦੀ ਸਮੱਗਰੀ',
    logTreatmentDone: 'ਇਲਾਜ ਦਰਜ ਕਰੋ',
    treatmentLoggedSuccess: 'ਕਾਮਯਾਬੀ ਨਾਲ ਦਰਜ ਹੋਇਆ!',

    healthTitle: 'ਕਿਸਾਨ ਸਿਹਤ ਅਤੇ ਲੂ ਬਚਾਅ',
    heatStressAlert: 'ਗਰਮੀ ਅਤੇ ਲੂ ਦੀ ਚੇਤਾਵਨੀ',
    hydrationTracker: 'ਪਾਣੀ ਪੀਣ ਦਾ ਸਮਾਂ',
    symptomCheckin: 'ਸਿਹਤ ਜਾਂਚ',
    drinkWaterNow: 'ਪਾਣੀ ਪੀਓ',
    restingInShade: 'ਛਾਂ ਵਿੱਚ ਆਰਾਮ',
    feelingFine: 'ਮੈਂ ਠੀਕ ਹਾਂ',
    feelingDizzy: 'ਚੱਕਰ ਆ ਰਹੇ ਹਨ',
    consentTitle: 'ਸਿਹਤ ਡੇਟਾ ਦੀ ਸਹਿਮਤੀ',
    consentMessage: 'ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਲਈ ਸਿਹਤ ਜਾਣਕਾਰੀ ਜ਼ਰੂਰੀ ਹੈ।',
    grantConsent: 'ਹਾਂ, ਸਹਿਮਤ ਹਾਂ',
    emergencyPhcContact: 'ਸਿਹਤ ਕੇਂਦਰ: 108',

    farmFitnessScore: 'ਫ਼ਾਰਮ ਫਿਟਨੈਸ ਸਕੋਰ',
    rollingAverage: '4 ਹਫ਼ਤਿਆਂ ਦੀ ਔਸਤ',
    ecoStreak: 'ਜੈਵਿਕ ਲਗਾਤਾਰਤਾ',
    hydrationStreak: 'ਸਿਹਤ ਲਗਾਤਾਰਤਾ',
    pesticideScore: 'ਕੀਟਨਾਸ਼ਕ ਕਟੌਤੀ (30%)',
    soilScore: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ (25%)',
    waterScore: 'ਪਾਣੀ ਦੀ ਬੱਚਤ (20%)',
    healthScore: 'ਸਿਹਤ ਸੰਭਾਲ (15%)',
    followthroughScore: 'ਅਮਲ (10%)',
    villageRank: 'ਪਿੰਡ ਵਿੱਚ ਰੈਂਕ',
    badgesTitle: 'ਤਮਗੇ',
    villageChallengeTitle: 'ਪਿੰਡ ਵਾਤਾਵਰਣ ਚੈਲੇਂਜ',

    offlineMode: 'ਆਫ਼ਲਾਈਨ ਮੋਡ',
    offlineBannerMsg: 'ਇੰਟਰਨੈੱਟ ਬੰਦ ਹੈ। ਡੇਟਾ ਫ਼ੋਨ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੈ।',
    syncNow: 'ਸਿੰਕ ਕਰੋ',
    allSynced: 'ਸਭ ਸਿੰਕ ਹੋ ਗਿਆ',
    pendingSync: 'ਬਾਕੀ ਰਿਕਾਰਡ',
    demoMode: 'ਲੋਕਲ ਮੋਡ',
    switchRole: 'ਰੋਲ ਬਦਲੋ',
    farmerRole: 'ਕਿਸਾਨ (ਰਮੇਸ਼)',
    extensionOfficerRole: 'ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ',

    navFieldGuide: 'ਫ਼ੀਲਡ ਗਾਈਡ',
    navFieldMap: 'ਖੇਤ ਦਾ ਨਕਸ਼ਾ',
    navForecasts: 'ਬਿਮਾਰੀ ਚੇਤਾਵਨੀ',
    fieldGuideTitle: 'ਕੀੜੇ, ਬਿਮਾਰੀਆਂ ਅਤੇ ਨਦੀਨ ਗਾਈਡ',
    selfDiagnosisTitle: 'ਸਵੈ-ਜਾਂਚ ਫ਼ੋਟੋ ਤੁਲਨਾ',
    rankedMatchesTitle: 'AI ਬਿਹਤਰੀਨ ਮੇਲ',
    saveToFavorites: 'ਮਨਪਸੰਦ ਵਿੱਚ ਸਾਂਭੋ',
    savedFavorites: 'ਸਾਂਭੇ ਹੋਏ ਇਲਾਜ',
    outbreakForecastTitle: 'ਝੋਨੇ ਦੇ ਬਲਾਸਟ ਰੋਗ ਦਾ ਅੰਦਾਜ਼ਾ',
    riceBlastForecast: 'ਝੋਨਾ ਬਲਾਸਟ ਖ਼ਤਰਾ',
    compareWithGuide: 'ਗਾਈਡ ਨਾਲ ਮਿਲਾਓ'
  },
  en: {
    appName: 'GreenCoach AI',
    tagline: 'Farmer Co-Pilot in Your Pocket',
    navHome: 'Home',
    navDiagnose: 'Diagnose',
    navHealth: 'Health & Heat',
    navFitness: 'Farm Fitness',
    navFarm: 'My Farm',
    navVillage: 'Village Hub',
    navExtensionWorker: 'Extension Portal',

    hariyaTitle: 'Hariya Co-Pilot',
    hariyaRole: 'Your Trusted Agri & Wellness Guide',
    hariyaPromptTapMic: 'Tap microphone to speak with Hariya',
    hariyaListening: 'Hariya is listening...',
    hariyaSpeaking: 'Hariya is speaking...',
    hariyaGreetingDefault: 'Namaste Ramesh ji! How is the crop looking today?',
    hariyaDiagnosePrompt: 'Please take a clear photo of the affected leaf.',
    hariyaHeatPrompt: 'Ramesh ji, heat index is high right now. Please drink water and rest in shade.',
    hariyaExplainMore: 'Explain More',

    diagnoseTitle: 'Crop Disease Diagnosis',
    capturePhoto: 'Capture Photo',
    selectCrop: 'Select Crop',
    checkingCrop: 'Checking your crop condition...',
    qualityCheckTitle: 'Image Quality Check',
    qualityPassed: 'Image Quality Verified',
    qualityFailed: 'Please take photo in better lighting',
    retakePhoto: 'Retake Photo',
    highConfidence: 'High Confidence (>85%)',
    likelyConfidence: 'Likely Diagnosis (60-85%)',
    lowConfidence: 'Uncertain (<60%) - Flagged for Extension Review',
    ecoFirstRemedies: 'Eco-Friendly & Organic Remedies (First)',
    chemicalFallback: 'Chemical Alternative (Last Resort)',
    materialsNeeded: 'Materials Needed',
    logTreatmentDone: 'Mark Treatment Applied',
    treatmentLoggedSuccess: 'Treatment logged! Farm Fitness Score increased.',

    healthTitle: 'Farmer Wellness & Heat Stress',
    heatStressAlert: 'Heat Index & Wet-Bulb Warning',
    hydrationTracker: 'Paced Hydration Schedule',
    symptomCheckin: 'Voice Symptom Check-In',
    drinkWaterNow: 'Drink Water Now',
    restingInShade: 'Resting in Shade',
    feelingFine: 'Feeling Fine, Continuing',
    feelingDizzy: 'Feeling Dizzy / Exhausted',
    consentTitle: 'Health Data Consent',
    consentMessage: 'We collect minimal health responses strictly to deliver timely heat warnings and hydration safety reminders.',
    grantConsent: 'I Agree & Grant Consent',
    emergencyPhcContact: 'Nearest Primary Health Centre (PHC): 108',

    farmFitnessScore: 'Farm Fitness Score',
    rollingAverage: 'Rolling 4-Week Average',
    ecoStreak: 'Eco-Streak',
    hydrationStreak: 'Hydration Streak',
    pesticideScore: 'Pesticide Reduction (30%)',
    soilScore: 'Soil Health (25%)',
    waterScore: 'Water Efficiency (20%)',
    healthScore: 'Health Compliance (15%)',
    followthroughScore: 'Follow-Through (10%)',
    villageRank: 'Village Standing',
    badgesTitle: 'Earned Badges',
    villageChallengeTitle: 'Kharif 2026 Eco-Warrior Cup',

    offlineMode: 'Offline Mode',
    offlineBannerMsg: 'No internet connection. Changes saved locally and will sync automatically.',
    syncNow: 'Sync Now',
    allSynced: 'All Data Synced',
    pendingSync: 'Pending Offline Queue',
    demoMode: 'Local / Offline Mode',
    switchRole: 'Switch Role',
    farmerRole: 'Farmer (Ramesh)',
    extensionOfficerRole: 'Extension Worker (Sunita)',

    navFieldGuide: 'Field Guide',
    navFieldMap: 'Field Map',
    navForecasts: 'Outbreak Alerts',
    fieldGuideTitle: 'Crop Pests, Diseases & Weeds Field Guide',
    selfDiagnosisTitle: 'Self-Diagnosis Visual Comparison',
    rankedMatchesTitle: 'AI Ranked Pest & Disease Matches',
    saveToFavorites: 'Save to Favorites',
    savedFavorites: 'Saved Treatments',
    outbreakForecastTitle: 'Weather & Rice Blast Outbreak Forecasts',
    riceBlastForecast: 'Rice Blast Outbreak Risk Index',
    compareWithGuide: 'Compare with Field Guide'
  }
};
