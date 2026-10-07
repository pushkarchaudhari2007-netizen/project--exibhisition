# GreenCoach AI

> **Voice-first, multilingual, offline-ready AI co-pilot for smallholder farmers in rural India.**

GreenCoach AI unifies four critical domains into a single low-literacy-friendly mobile application:
1. **Crop Health Diagnostics** (AI camera leaf scan + soil & weather context fusion + strict confidence gates)
2. **Eco-Friendly Pest & Disease Management** (Biological, cultural, and organic remedies prioritized over chemicals)
3. **Farmer Heat-Stress & Wellness Monitoring** (Wet-bulb temperature/humidity index, hydration pacing, and clinical symptom check-ins)
4. **Gamified Sustainable-Farming Tracking** (Farm Fitness Score with 30/25/20/15/10% component weights, streaks, and collective village competitions)

---

## 🌾 The Central Voice Persona: "Hariya"
* **Tone**: Respectful elder-neighbor (like a trusted local agricultural officer available 24/7).
* **Languages**: Hindi (हिंदी), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Punjabi (ਪੰਜਾਬੀ), and English.
* **Audio Cues (Earcons)**:
  * Major Triad Arpeggio Chime: Success & encouragement.
  * Amber Repeating Tone: Heat alerts & hydration reminders.
* **Honest about Uncertainty**: Never sounds robotic or condescending. Transparently asks for another photo when confidence is low.

---

## 🏗️ Architecture & Technology Stack

```
Farmer / Voice / Camera / UI
           ↓
Local Application Layer (React 19 / TypeScript / Vite / Tailwind CSS)
           ↓
Local Storage & Offline Sync Queue (Idempotency Keys, Append-Only)
           ↓
Express API Gateway (server.ts / REST)
 ├── /api/auth
 ├── /api/farmers & /api/farms
 ├── /api/diagnoses (AI Vision & Context Fusion)
 ├── /api/treatments (Eco-First Log)
 ├── /api/health (Heat Index & Decision Tree)
 ├── /api/gamification (Farm Fitness Engine)
 ├── /api/leaderboards & /api/challenges
 ├── /api/extension-workers (Review Queue & Broadcasts)
 └── /api/sync (Batch Idempotent Uploads)
           ↓
AI / ML Services Layer
 ├── On-Device Lite Model Adapter (MobileNetV3-class)
 ├── Cloud CV Model Adapter (Gemini 3.8 Flash via @google/genai)
 ├── Context Fusion (Soil pH/moisture + Weather humidity/rain)
 └── Agronomic RAG Knowledge Base (ICAR / KVK validated remedies)
```

---

## 🔬 Strict AI Confidence Gating & Logic
* **> 85% (High Confidence)**: Shows probable disease, confidence, clear voice explanation, and step-by-step eco-friendly remedies.
* **60% – 85% (Likely)**: Presents as likely, asking farmer for confirmation or second photo from another angle.
* **< 60% (Low Confidence)**: Does **not** present a definitive diagnosis. Spoken prompt: *"I am not fully sure from this photo — can you take one more picture in better light?"* and automatically flags the scan for agricultural extension worker review.

---

## 📊 Farm Fitness Score Algorithm
Deterministic, testable composite index with smoothed rolling 4-week average:

| Component | Weight | Source |
| :--- | :--- | :--- |
| **Pesticide Reduction** | 30% | Organic/cultural vs chemical ratio |
| **Soil Health Trend** | 25% | pH balance (6.5–7.5) & moisture stability |
| **Water Efficiency** | 20% | Irrigation timing vs weather windows |
| **Health Compliance** | 15% | Acknowledged heat alerts & hydration |
| **Diagnosis Follow-Through** | 10% | Verified execution of eco-remedies |

---

## 🏃 Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Application
```bash
npm run dev
```
Starts Express server on port `3000` with mounted Vite middleware.

### 3. Build for Production
```bash
npm run build
npm start
```

### 4. Execute Automated Test Suite
Open the web app and click **"Run Tests"** in the top navigation bar to execute the automated verification suite:
* AI Confidence Boundary Gates (`0.90`, `0.85`, `0.84`, `0.60`, `0.59`, `0.20`)
* Scoring Weight Matrix (30/25/20/15/10%)
* 4-Week Rolling Average calculation
* Anomaly Detection (+25 pts with 0 diagnoses flagged)
* Health Heat Index calculation (<27°C normal, >41°C danger)
* Clinical Emergency Escalation Decision Tree
* Offline Queue Idempotency & Batch Sync

---

## 🛡️ Security & Privacy Guardrails
1. **Health Data Protection**: Explicit consent modal required before health telemetry or symptom check-ins are logged.
2. **Leaderboard Anonymity**: Individual farmers are anonymized by default as `"Farmer #N"`.
3. **No Unrestricted Medical LLM Generation**: Health and heat stroke advice uses strictly pre-approved clinical safety decision trees and emergency PHC 108 ambulance contacts.
4. **No Secrets Exposed**: Gemini API key is accessed exclusively server-side via `process.env.GEMINI_API_KEY`.
