# GreenCoach AI — AI Model & Service Inventory

## 1. Executive Summary & Purpose
This document establishes the official AI/ML inventory for GreenCoach AI. It strictly delineates between **trained statistical machine learning models**, **constrained LLM/RAG subsystems**, **speech services**, and **deterministic rule-based orchestration engines**.

In accordance with the project documentation, GreenCoach AI does **not** overengineer deterministic or safety-critical clinical pathways into unconstrained neural networks. Specifically:
- Crop disease diagnostics rely on two computer vision models (an on-device quantized model for zero-connectivity field conditions and a high-resolution cloud model for deep inference).
- Agricultural advice uses a vetted Retrieval-Augmented Generation (RAG) system with a safety gate that strictly prohibits inventing chemical dosages or unauthorized treatments.
- Farmer health, heat index warnings, confidence gating, context fusion, and gamification rely on testable, transparent, deterministic rule engines.

---

## 2. Complete Component & Model Inventory Table

| Component | Model/Service Type | Purpose | Local/Cloud | Training Required | MVP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **On-Device Crop Disease Model** | TRAINED ML MODEL | MobileNetV3-class quantized image classification on mobile device with zero internet connectivity | Local (On-Device) | YES (Supervised Fine-Tuning + INT8 Quantization) | YES |
| **Cloud Crop Disease Model** | TRAINED ML MODEL | High-resolution EfficientNet / Vision Transformer (ViT) for cloud-assisted disease diagnosis & verification | Cloud (Backend) | YES (Transfer Learning on Multiclass Field Dataset) | YES |
| **Agricultural Advisory LLM** | LLM | Low-literacy conversational adaptation, multilingual explanation of vetted diagnosis & agronomic guidance | Cloud / Server | NO (Pretrained Foundation Model with strict system prompt & guardrails) | YES |
| **Agronomic Retrieval Engine** | RAG SYSTEM | Semantic & metadata-filtered retrieval of vetted ICAR/KVK remedies, organic recipes & ICAR spray restrictions | Server / Local Cache | NO (Vector Indexing + Rule-Anchored Document Store) | YES |
| **Hariya Speech-to-Text (ASR)** | EXTERNAL AI SERVICE | Transcribing rural farmer voice queries in Hindi, Marathi, and regional Indian dialects | Local / Cloud hybrid | NO (Device native SpeechRecognizer / Multilingual ASR API) | YES |
| **Hariya Text-to-Speech (TTS)** | EXTERNAL AI SERVICE | High-naturalness voice generation with respectful elder-neighbor persona ("Hariya") in regional languages | Local / Cloud hybrid | NO (Device TextToSpeech engine / Multilingual Neural TTS API) | YES |
| **Confidence Gate Engine** | RULE-BASED ENGINE | Multi-tier threshold routing (>0.85 High, 0.60–0.85 Likely, <0.60 Low / Extension Review) | Local & Cloud | NO (Deterministic Boundary Logic) | YES |
| **Context Fusion Engine** | RULE-BASED ENGINE | Synthesizing visual prediction with soil pH, moisture, microclimate weather risks, and crop stage | Local & Cloud | NO (Deterministic Multi-Factor Scoring & Agronomic Rules) | YES |
| **Farmer Heat & Health Engine** | RULE-BASED ENGINE | Heat index calculation, clinical symptom check-ins, hydration pacing, and PHC emergency escalation | Local & Cloud | NO (Deterministic Clinical Decision Trees & ICMR Protocols) | YES |
| **Farm Fitness Gamification Engine** | RULE-BASED ENGINE | Weighted composite scoring (30/25/20/15/10%), streaks, decay grace days, and village league normalization | Server & Local | NO (Deterministic Mathematical Formulas) | YES |
| **Weather Service Provider** | EXTERNAL DATA SERVICE | Live meteorological parameters (temp, humidity, rain forecast, wind, solar radiation) | Cloud (Provider API) | NO (External Open-Meteo / IMD Integration with Mock Fallback) | YES |
| **Soil Data Provider** | EXTERNAL DATA SERVICE | Ingestion of Bluetooth IoT soil probes or village kiosk sensor records | Local / Server | NO (Hardware protocol parser & manual fallback) | YES |

---

## 3. Classification Definitions

The taxonomy above complies with the AI architectural mandate:

1. **TRAINED ML MODEL**:
   - Parameterized neural networks trained on proprietary or curated domain datasets.
   - Requires dataset splits, backpropagation, validation loss tracking, metrics evaluation (F1, precision, recall), and export to production runtimes (ONNX, TFLite, CoreML, PyTorch).
   - *Instances*: On-Device MobileNetV3 and Cloud EfficientNet/ViT.

2. **PRE-TRAINED MODEL / EXTERNAL AI SERVICE**:
   - Off-the-shelf foundation speech models utilized via device runtime or API endpoints without local weight retraining.
   - *Instances*: ASR and TTS providers for Hariya voice interaction.

3. **LLM**:
   - Large Language Model employed for natural conversation, query simplification, and multilingual translation.
   - Constrained by external retrieval; prohibited from autonomous pesticide calculation.
   - *Instances*: Gemini 3.8 Flash / Cloud LLM Co-pilot.

4. **RAG SYSTEM**:
   - Knowledge indexing and retrieval pipeline querying vetted agronomic documents (ICAR, KVK, State Agricultural Universities) with strict provenance metadata.

5. **RULE-BASED ENGINE**:
   - Deterministic, auditable boolean or mathematical decision matrices.
   - **Crucial Distinction**: Rule engines are NOT machine learning models and must never be represented as such to users, auditors, or agricultural extension officers.
   - *Instances*: Confidence Gating, Health Decision Trees, Context Fusion, Farm Fitness Scoring.

6. **EXTERNAL DATA SERVICE**:
   - Real-world telemetry providers delivering environmental ground truth (weather, sensor feeds).

---

## 4. Architectural Summary: Actual Model Count

- **Total Core ML Models Trained/Evaluated**: **2** (MobileNetV3 on-device + EfficientNet/ViT cloud).
- **Total Constrained Language/RAG Systems**: **1** (LLM + Agronomic RAG).
- **Total Voice Providers**: **2** (ASR + TTS).
- **Total Deterministic Orchestration Systems**: **4** (Health, Confidence, Context Fusion, Gamification).
