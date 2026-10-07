/**
 * Hariya Voice Assistant & Constrained RAG Advisory Engine
 * Source of Truth: PRD & 02_Architecture_Flow_AI_Logic_REFINED.md (Section 2.4 & Hariya Persona)
 * 
 * Flow:
 * Farmer question -> Intent/context extraction -> Retrieve vetted agricultural content ->
 * Generate constrained answer -> Safety validation -> Localized Hariya Narration
 */

import { GoogleGenAI } from '@google/genai';
import { AGRONOMIC_KNOWLEDGE_BASE } from './agronomicKnowledge.js';
import { HealthWellnessService } from '../services/healthService.js';

export interface HariyaVoiceResponse {
  spoken_text: string;
  display_text: string;
  detected_intent: 'diagnosis_help' | 'treatment_advice' | 'health_wellness' | 'farm_fitness' | 'weather' | 'general_agri' | 'safety_fallback';
  audio_earcon: 'chime_success' | 'alert_gentle' | 'neutral';
  suggested_actions?: string[];
  suggested_quick_replies?: string[];
}

export class HariyaVoiceEngine {
  private genAI: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.genAI = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      } catch (err) {
        console.warn('GoogleGenAI init failed, falling back to local vetted responses:', err);
      }
    }
  }

  /**
   * Process voice or text question with RAG agronomic context and strict safety guardrails
   */
  async converse(
    userQuery: string,
    farmerContext: {
      name: string;
      language: string;
      crops: string[];
      villageName?: string;
      currentHeatIndex?: number;
    }
  ): Promise<HariyaVoiceResponse> {
    const q = userQuery.toLowerCase().trim();
    const lang = farmerContext.language || 'hi';
    const name = farmerContext.name || 'Ramesh ji';

    // 1. Health & Medical emergency check (strict pre-approved guardrail)
    if (q.includes('dizzy') || q.includes('chakkar') || q.includes('चक्कर') || q.includes('बेहोश') || q.includes('vomit') || q.includes('faint') || q.includes('dizziness')) {
      const evalResult = HealthWellnessService.evaluateSymptomCheckin('dizzy');
      const textHi = `${name}, तुरंत छाया में बैठें या लेटें। ओआरएस (ORS) या नींबू-नमक का पानी धीरे-धीरे पिएं। अगर 15 मिनट में आराम न मिले तो प्राथमिक स्वास्थ्य केंद्र (PHC) से संपर्क करें।`;
      const textMr = `${name}, त्वरित सावलीत बसा किंवा झोपा. ओआरएस किंवा लिंबू-पाणी प्या. चक्कर येत असल्यास प्राथमिक आरोग्य केंद्राशी संपर्क साधा.`;
      const textEn = `${name}, please sit down in the shade immediately. Drink ORS or salted lemon water slowly. If you do not feel better shortly, contact the local health centre.`;

      return {
        spoken_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        display_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        detected_intent: 'health_wellness',
        audio_earcon: 'alert_gentle',
        suggested_actions: ['Log Hydration', 'View Nearest PHC', 'Call Family Contact'],
        suggested_quick_replies: ['I am resting now', 'Feeling better', 'Call Health Centre']
      };
    }

    // 2. Weather & Heat check
    if (q.includes('weather') || q.includes('mausam') || q.includes('मौसम') || q.includes('हवामान') || q.includes('धूप') || q.includes('heat') || q.includes('garmi')) {
      const hiVal = farmerContext.currentHeatIndex || 34;
      const textHi = `${name}, आज दोपहर में तापमान 34°C और उमस अधिक रहेगी। दोपहर 12 से 3 बजे के बीच धूप से बचें और हर आधे घंटे में पानी पिएं।`;
      const textMr = `${name}, आज दुपारी तापमान ३४°C आणि उकाडा जास्त राहील. दुपारी १२ ते ३ दरम्यान सावलीत विश्रांती घ्या आणि पाणी पित राहा.`;
      const textEn = `${name}, today will be warm with moderate humidity. Avoid direct noon sun and remember to take regular hydration breaks.`;

      return {
        spoken_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        display_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        detected_intent: 'weather',
        audio_earcon: 'chime_success',
        suggested_actions: ['Hydration Tracker', 'Spray Forecast'],
        suggested_quick_replies: ['When should I spray?', 'Show today forecast']
      };
    }

    // 3. Treatment / Neem / Organic remedy inquiry
    if (q.includes('neem') || q.includes('नीम') || q.includes('निंबोळी') || q.includes('dashaparni') || q.includes('दशपर्णी') || q.includes('organic') || q.includes('जैविक') || q.includes('सेंद्रिय')) {
      const textHi = `नीम का अर्क (NSKE 5%) तैयार करने के लिए 1 लीटर पानी में 50 ग्राम कुचला हुआ नीम का बीज मिलाएं। रातभर भिगोकर सुबह कपड़े से छान लें और थोड़ा साबुन मिलाकर पत्तियों के नीचे छिड़कें। यह रस चूसक कीटों और फफूंद दोनों के लिए उत्तम है।`;
      const textMr = `५% निंबोळी अर्क करण्यासाठी १ लिटर पाण्यात ५० ग्रॅम ठेचलेली निंबोळी रात्रभर भिजवा. सकाळी गाळून थोडे साबणाचे पाणी मिसळा आणि पानांवर फवारा. हे किडींपासून उत्तम संरक्षण देते.`;
      const textEn = `To prepare 5% Neem extract (NSKE), soak 50g crushed neem kernels per litre of water overnight. Filter through cloth and spray during cool morning hours. It effectively controls sucking pests and leaf spots.`;

      return {
        spoken_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        display_text: lang === 'hi' ? textHi : lang === 'mr' ? textMr : textEn,
        detected_intent: 'treatment_advice',
        audio_earcon: 'chime_success',
        suggested_actions: ['Log Organic Treatment', 'Diagnose Crop'],
        suggested_quick_replies: ['Mark treatment complete', 'Check soil condition']
      };
    }

    // 4. Try Gemini AI LLM with strict RAG context if client available
    if (this.genAI) {
      try {
        const vettedContextSnippet = AGRONOMIC_KNOWLEDGE_BASE.map(k => 
          `Crop: ${k.crop}, Disease: ${k.name}, Eco remedies: ${k.eco_remedies.map(r => r.title).join(', ')}, Safe chemical fallback: ${k.chemical_fallback.chemical_name}`
        ).join('\n');

        const systemInstruction = `You are "Hariya", a warm, respectful, culturally attuned agricultural and wellness companion for smallholder farmers in rural India.
Tone guidelines:
- Tone: Respectful elder-neighbor tone (like a trusted local agri-officer available 24/7), never corporate, never condescending.
- Culturally attuned greetings ("Ram Ram", "Namaskar", "Namaste").
- Speak simply, short (under 3 sentences), clear, encouraging.
- Never invent unverified chemicals or dangerous pesticides. Prioritize neem, bio-fungicides, and soil organic practices.
- For human health questions, only provide simple resting/hydration guidance, never prescribe medication.
- Always respond in language: ${lang} (if 'hi' use natural conversational Hindi, if 'mr' use Marathi, if 'te' Telugu, else English).
- Ground your answers in this vetted ICAR agronomic reference:
${vettedContextSnippet}`;

        const response = await this.genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userQuery,
          config: {
            systemInstruction,
            temperature: 0.3
          }
        });

        const reply = response.text?.trim();
        if (reply) {
          return {
            spoken_text: reply,
            display_text: reply,
            detected_intent: 'general_agri',
            audio_earcon: 'chime_success',
            suggested_actions: ['Diagnose Leaf Photo', 'View My Farm'],
            suggested_quick_replies: ['Tell me more', 'How to prepare spray?']
          };
        }
      } catch (err) {
        console.warn('Gemini RAG call failed, using local persona fallback:', err);
      }
    }

    // 5. Default warm conversational fallback
    const greeting = lang === 'mr' ? 'नमस्कार' : 'नमस्ते';
    const fallbackHi = `${greeting} ${name}! मैं आपकी फसल की बीमारी पहचानने, जैविक उपचार बताने और खेत में धूप से आपकी सेहत सुरक्षित रखने में मदद कर सकता हूँ। क्या आप किसी पौधे की पत्ती की फोटो जांचना चाहते हैं?`;
    const fallbackMr = `${greeting} ${name}! मी तुमच्या पिकाचे रोग ओळखण्यासाठी, सेंद्रिय उपाय सांगण्यासाठी आणि उन्हात आरोग्याची काळजी घेण्यासाठी सदैव सोबत आहे. पिकाचा फोटो तपासायचा आहे का?`;
    const fallbackEn = `Greetings ${name}! I can help you diagnose crop diseases with eco-friendly remedies, track your Farm Fitness, and keep you safe from field heat stress. Would you like to check a crop photo today?`;

    return {
      spoken_text: lang === 'hi' ? fallbackHi : lang === 'mr' ? fallbackMr : fallbackEn,
      display_text: lang === 'hi' ? fallbackHi : lang === 'mr' ? fallbackMr : fallbackEn,
      detected_intent: 'general_agri',
      audio_earcon: 'chime_success',
      suggested_actions: ['Diagnose Crop', 'Check Health', 'Village Hub'],
      suggested_quick_replies: ['Check a crop photo', 'Today heat alert', 'Show my score']
    };
  }
}

export const hariyaVoiceEngine = new HariyaVoiceEngine();
