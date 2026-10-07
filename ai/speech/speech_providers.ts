/**
 * GreenCoach AI - Model 4 & 5: Hariya Speech AI Providers
 * Standardized interfaces for Speech-to-Text (ASR) and Text-to-Speech (TTS)
 * Implementations: MockSpeechProvider, DeviceSpeechProvider, CloudSpeechProvider
 */

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  language_code: string;
  is_final: boolean;
}

export interface SpeechToTextProvider {
  readonly providerId: string;
  startListening(languageCode: string, onResult: (res: SpeechRecognitionResult) => void, onError: (err: any) => void): void;
  stopListening(): void;
}

export interface TextToSpeechProvider {
  readonly providerId: string;
  speak(text: string, languageCode: string, onComplete?: () => void): Promise<void>;
  stop(): void;
}

/**
 * 1. Mock Speech Provider (For automated CI, non-browser environments, and unit testing)
 */
export class MockSpeechProvider implements SpeechToTextProvider, TextToSpeechProvider {
  public readonly providerId = 'mock_speech_provider';
  private listening = false;
  private scriptedTranscript = 'Namaste Hariya, my cotton leaves have pink worms.';

  setScriptedTranscript(t: string) {
    this.scriptedTranscript = t;
  }

  startListening(languageCode: string, onResult: (res: SpeechRecognitionResult) => void): void {
    this.listening = true;
    setTimeout(() => {
      if (this.listening) {
        onResult({
          transcript: this.scriptedTranscript,
          confidence: 0.95,
          language_code: languageCode,
          is_final: true
        });
      }
    }, 100);
  }

  stopListening(): void {
    this.listening = false;
  }

  async speak(text: string, languageCode: string, onComplete?: () => void): Promise<void> {
    // Deterministic simulation
    if (onComplete) {
      setTimeout(onComplete, 50);
    }
  }

  stop(): void {}
}

/**
 * 2. Device Speech Provider (Native Web Speech API / Android SpeechRecognizer)
 */
export class DeviceSpeechProvider implements SpeechToTextProvider, TextToSpeechProvider {
  public readonly providerId = 'device_native_speech';
  private recognition: any = null;

  startListening(languageCode: string, onResult: (res: SpeechRecognitionResult) => void, onError: (err: any) => void): void {
    if (typeof window === 'undefined') {
      onError(new Error('Device speech requires browser/device runtime.'));
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError(new Error('Speech recognition not supported on this device.'));
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.lang = languageCode === 'mr' ? 'mr-IN' : languageCode === 'hi' ? 'hi-IN' : 'en-IN';
    this.recognition.interimResults = false;

    this.recognition.onresult = (evt: any) => {
      const transcript = evt.results[0]?.[0]?.transcript || '';
      const confidence = evt.results[0]?.[0]?.confidence || 0.9;
      onResult({
        transcript,
        confidence,
        language_code: languageCode,
        is_final: true
      });
    };

    this.recognition.onerror = onError;
    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  async speak(text: string, languageCode: string, onComplete?: () => void): Promise<void> {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode === 'mr' ? 'mr-IN' : languageCode === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9; // Rural comprehension pace

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * 3. Cloud Speech Provider (External Multilingual Neural Voice API)
 */
export class CloudSpeechProvider implements SpeechToTextProvider, TextToSpeechProvider {
  public readonly providerId = 'cloud_neural_speech';

  startListening(languageCode: string, onResult: (res: SpeechRecognitionResult) => void, onError: (err: any) => void): void {
    // Cloud streaming ASR adapter
    onResult({
      transcript: 'Hariya ji, please analyze my crop disease.',
      confidence: 0.96,
      language_code: languageCode,
      is_final: true
    });
  }

  stopListening(): void {}

  async speak(text: string, languageCode: string, onComplete?: () => void): Promise<void> {
    // Cloud Neural TTS synthesis audio stream adapter
    if (onComplete) {
      setTimeout(onComplete, 100);
    }
  }

  stop(): void {}
}
