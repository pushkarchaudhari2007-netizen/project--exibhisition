/**
 * Health & Wellness Service
 * Source of Truth: PRD & 02_Architecture_Flow_AI_Logic_REFINED.md (Flow B & Section 2)
 * 
 * Pre-approved safety decision trees for farmer heat-stress & hydration.
 * Strictly avoids unrestricted LLM medical claims.
 */

export interface HeatIndexResult {
  temperature_c: number;
  humidity_percent: number;
  heat_index_c: number;
  level: 'normal' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger';
  voice_alert: {
    en: string;
    hi: string;
    mr: string;
    te: string;
  };
  recommended_rest_interval_mins: number;
  recommended_water_ml_per_hour: number;
}

export class HealthWellnessService {
  /**
   * Calculate Heat Index using NOAA Rothfusz regression equation
   */
  static calculateHeatIndex(tempC: number, humidity: number): HeatIndexResult {
    const tempF = (tempC * 9 / 5) + 32;
    const rh = humidity;

    // Simple Steadman index first
    let hiF = 0.5 * (tempF + 61.0 + ((tempF - 68.0) * 1.2) + (rh * 0.094));

    if (hiF >= 80) {
      hiF = -42.379 +
        (2.04901523 * tempF) +
        (10.14333127 * rh) -
        (0.22475541 * tempF * rh) -
        (0.00683783 * tempF * tempF) -
        (0.05481717 * rh * rh) +
        (0.00122874 * tempF * tempF * rh) +
        (0.00085282 * tempF * rh * rh) -
        (0.00000199 * tempF * tempF * rh * rh);

      // Adjustments
      if (rh < 13 && tempF >= 80 && tempF <= 112) {
        hiF -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
      } else if (rh > 85 && tempF >= 80 && tempF <= 87) {
        hiF += ((rh - 85) / 10) * ((87 - tempF) / 5);
      }
    }

    const hiC = Number(((hiF - 32) * 5 / 9).toFixed(1));

    let level: 'normal' | 'caution' | 'extreme_caution' | 'danger' | 'extreme_danger' = 'normal';
    let restMins = 60;
    let waterMl = 500;

    let alertEn = "Weather conditions are comfortable for field work.";
    let alertHi = "खेत में काम करने के लिए मौसम सामान्य है।";
    let alertMr = "शेतातील कामासाठी हवामान अनुकूल आहे.";
    let alertTe = "పొలం పనికి వాతావరణం అనుకూలంగా ఉంది.";

    if (hiC >= 54) {
      level = 'extreme_danger';
      restMins = 15;
      waterMl = 1200;
      alertEn = "EXTREME DANGER: Severe heat stroke imminent! Halt field work immediately and move to cool shade.";
      alertHi = "अत्यधिक खतरा! लू लगने का गंभीर जोखिम है। तुरंत खेत का काम रोकें और ठंडी छांव में जाएं।";
      alertMr = "अति धोकादायक! उष्माघाताचा तीव्र धोका आहे. त्वरित काम थांबवा आणि थंड सावलीत विश्रांती घ्या.";
      alertTe = "తీవ్ర ప్రమాదం! తక్షణమే పొలం పని ఆపి చల్లని నీడలోకి వెళ్లండి.";
    } else if (hiC >= 41) {
      level = 'danger';
      restMins = 20;
      waterMl = 1000;
      alertEn = "DANGER: High heat stress. Please rest in the shade for 15 minutes and drink water regularly.";
      alertHi = "खतरा: तेज धूप और उमस है। कृपया 15 मिनट छाया में आराम करें और पानी पिएं।";
      alertMr = "धोका: कडक ऊन व उकाडा आहे. कृपया सावलीत १५ मिनिटे विश्रांती घ्या आणि पाणी प्या.";
      alertTe = "హెచ్చరిక: తీవ్రమైన వేడి ఉంది. 15 నిమిషాలు నీడలో విశ్రాంతి తీసుకోండి.";
    } else if (hiC >= 32) {
      level = 'extreme_caution';
      restMins = 30;
      waterMl = 750;
      alertEn = "CAUTION: Rising temperature and humidity. Stay hydrated and take regular shade breaks.";
      alertHi = "सावधानी: धूप तेज हो रही है। समय-समय पर पानी पिएं और गमछा या टोपी पहनें।";
      alertMr = "खबरदारी: ऊन वाढत आहे. वेळोवेळी पाणी प्या आणि डोक्यावर रुमाल बांधा.";
      alertTe = "జాగ్రత్త: ఉష్ణోగ్రత పెరుగుతోంది. క్రమం తప్పకుండా నీరు త్రాగండి.";
    } else if (hiC >= 27) {
      level = 'caution';
      restMins = 45;
      waterMl = 600;
      alertEn = "Warm weather today. Keep your water jug handy.";
      alertHi = "आज हल्की गर्मी है। पानी की बोतल साथ रखें।";
      alertMr = "आज उकाडा जाणवू शकतो. पाण्याची बाटली सोबत ठेवा.";
      alertTe = "వేడిగా ఉంది. తగినంత నీరు త్రాగండి.";
    }

    return {
      temperature_c: tempC,
      humidity_percent: humidity,
      heat_index_c: hiC,
      level,
      voice_alert: {
        en: alertEn,
        hi: alertHi,
        mr: alertMr,
        te: alertTe
      },
      recommended_rest_interval_mins: restMins,
      recommended_water_ml_per_hour: waterMl
    };
  }

  /**
   * Pre-approved clinical escalation decision tree
   */
  static evaluateSymptomCheckin(symptom: 'normal' | 'tired' | 'dizzy' | 'severe'): {
    escalation_required: boolean;
    instructions: string;
    instructions_hi: string;
    instructions_mr: string;
    action_type: 'routine' | 'shade_rest' | 'urgent_aid' | 'emergency_phc';
  } {
    switch (symptom) {
      case 'severe':
        return {
          escalation_required: true,
          instructions: 'CRITICAL ALERT: Symptoms indicate heat stroke. Move to shade immediately, apply wet cloths to neck and forehead, loosen clothes, and contact Primary Health Centre (PHC) ambulance at 108.',
          instructions_hi: 'गंभीर चेतावनी: यह लू (हीट स्ट्रोक) का संकेत है। तुरंत छाया में लेटें, माथे और गर्दन पर गीला कपड़ा रखें, और 108 पर संपर्क करें।',
          instructions_mr: 'तातडीची मदत आवश्यक: उष्माघाताची लक्षणे दिसत आहेत. त्वरित सावलीत झोपा, डोक्यावर ओला कपडा ठेवा आणि १०८ ला संपर्क करा.',
          action_type: 'emergency_phc'
        };
      case 'dizzy':
        return {
          escalation_required: true,
          instructions: 'Sit or lie down in shade right now. Drink ORS or salted lemon water slowly. Rest for at least 20 minutes before standing up.',
          instructions_hi: 'तुरंत छाया में बैठें या लेटें। ओआरएस (ORS) या नींबू-नमक का पानी धीरे-धीरे पिएं। कम से कम 20 मिनट आराम करें।',
          instructions_mr: 'त्वरित सावलीत बसा किंवा झोपा. ओआरएस (ORS) किंवा लिंबू-पाणी प्या. किमान २० मिनिटे विश्रांती घ्या.',
          action_type: 'urgent_aid'
        };
      case 'tired':
        return {
          escalation_required: false,
          instructions: 'Take a 10-minute rest under a shady tree. Drink two glasses of cool water and splash some on your face.',
          instructions_hi: 'पेड़ की छांव में 10 मिनट आराम करें। दो गिलास ठंडा पानी पिएं और चेहरे पर पानी छिड़कें।',
          instructions_mr: 'झाडाच्या सावलीत १० मिनिटे विश्रांती घ्या. दोन ग्लास थंड पाणी प्या.',
          action_type: 'shade_rest'
        };
      case 'normal':
      default:
        return {
          escalation_required: false,
          instructions: 'You are doing great! Keep your water bottle close and sip water every 30 minutes.',
          instructions_hi: 'बहुत बढ़िया! पानी की बोतल पास रखें और हर 30 मिनट में पानी पीते रहें।',
          instructions_mr: 'छान! पाण्याची बाटली जवळ ठेवा आणि दर ३० मिनिटांनी पाणी पित राहा.',
          action_type: 'routine'
        };
    }
  }
}
