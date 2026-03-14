
export class AudioService {
  private static instance: AudioService;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private getContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      try {
        this.audioContext = new AudioContextClass({ sampleRate: 24000 });
      } catch (e) {
        this.audioContext = new AudioContextClass();
      }
    }
    return this.audioContext!;
  }

  public async recreateContext(): Promise<void> {
    if (this.audioContext) {
      try {
        await this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  public async stop() {
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {}
      this.currentSource = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Unlocks the AudioContext on iOS/Safari.
   * Should be called on a user interaction (click/touchstart).
   */
  public async unlock(): Promise<void> {
    const ctx = this.getContext();
    
    // Prime speech synthesis for iOS
    if (window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }

    const state = ctx.state as string;
    if (state === 'suspended' || state === 'interrupted') {
      try {
        await ctx.resume();
        if (ctx.state === 'suspended') {
          // If still suspended after resume, force recreate
          await this.recreateContext();
        }
      } catch (e) {
        console.warn("Failed to resume AudioContext, recreating...", e);
        await this.recreateContext();
      }
    }
    
    // Play a short silent buffer to fully unlock
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      console.warn("Failed to play silent buffer:", e);
    }
  }

  private decodeBase64(base64: string): Uint8Array {
    try {
      const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, '').trim();
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      console.error("Base64 decoding failed:", e);
      return new Uint8Array(0);
    }
  }

  public async playFromBase64(base64: string): Promise<void> {
    await this.stop();
    const ctx = this.getContext();
    
    // Always try to resume before playing
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    const data = this.decodeBase64(base64);
    if (data.length === 0) return;

    // Small delay to ensure context is fully resumed on some mobile devices
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Use a promise wrapper for decodeAudioData to support older Safari
      const buffer = await new Promise<AudioBuffer>((resolve, reject) => {
        try {
          // Use exact slice of the buffer to avoid issues with offset/length
          const audioData = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          ctx.decodeAudioData(audioData, resolve, (err) => {
            reject(err);
          });
        } catch (e) {
          reject(e);
        }
      });
      await this.playBuffer(buffer);
    } catch (e) {
      console.log("Browser decoding failed, trying manual PCM");
      try {
        const audioBuffer = this.createBufferFromPCM(data, ctx);
        await this.playBuffer(audioBuffer);
      } catch (err) {
        console.error("Both decoding methods failed", err);
        throw err;
      }
    }
  }

  private createBufferFromPCM(data: Uint8Array, ctx: AudioContext): AudioBuffer {
    // Ensure we have enough data for Int16
    const len = Math.floor(data.length / 2) * 2;
    const alignedBuffer = new ArrayBuffer(len);
    new Uint8Array(alignedBuffer).set(data.slice(0, len));
    const dataInt16 = new Int16Array(alignedBuffer);
    
    const sampleRate = 24000;
    const numChannels = 1;
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  private async playBuffer(buffer: AudioBuffer) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    this.currentSource = source;
    source.start(0);

    return new Promise<void>((resolve) => {
      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        if (this.currentSource === source) this.currentSource = null;
        resolve();
      };

      source.onended = finish;
      // Safety timeout: resolve if onended doesn't fire (e.g. buffer duration + 1s)
      setTimeout(finish, (buffer.duration * 1000) + 1000);
    });
  }

  public speakFallback(text: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}
