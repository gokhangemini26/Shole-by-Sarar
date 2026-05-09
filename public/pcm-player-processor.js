// Output PCM player AudioWorkletProcessor.
// Runs in the audio rendering thread; immune to main-thread jank.
// Holds a ~3-second ring buffer of Float32 samples at the context's
// sample rate (we run the parent context at 24 kHz, matching Gemini Live).
//
// Message protocol from the main thread:
//   { type: 'pcm', data: ArrayBuffer (Int16 little-endian samples) }
//   { type: 'stop' }   — fade out over ~20 ms then clear buffer
//   { type: 'clear' }  — instant clear, no fade
//
// Periodically posts back:
//   { type: 'level', bufferedMs: number, isPlaying: boolean }
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 3 s @ 24 kHz = 72000 samples
    this.bufferSize = 72000;
    this.buffer = new Float32Array(this.bufferSize);
    this.readIdx = 0;
    this.writeIdx = 0;
    this.fillCount = 0;
    this.fadeOut = false;
    this.fadeFrames = 0;
    this.maxFadeFrames = 480; // 20 ms @ 24 kHz
    this.framesSinceLastReport = 0;

    this.port.onmessage = (ev) => {
      const msg = ev.data;
      if (!msg) return;
      if (msg.type === 'pcm' && msg.data) {
        const i16 = new Int16Array(msg.data);
        for (let i = 0; i < i16.length; i++) {
          if (this.fillCount >= this.bufferSize) break; // overflow drop
          this.buffer[this.writeIdx] = i16[i] / 32768;
          this.writeIdx = (this.writeIdx + 1) % this.bufferSize;
          this.fillCount++;
        }
        // New audio cancels any pending fade-out.
        this.fadeOut = false;
        this.fadeFrames = 0;
      } else if (msg.type === 'stop') {
        if (this.fillCount > 0) {
          this.fadeOut = true;
          this.fadeFrames = 0;
        }
      } else if (msg.type === 'clear') {
        this.readIdx = 0;
        this.writeIdx = 0;
        this.fillCount = 0;
        this.fadeOut = false;
        this.fadeFrames = 0;
      }
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0] && outputs[0][0];
    if (!out) return true;

    for (let i = 0; i < out.length; i++) {
      if (this.fillCount > 0) {
        let sample = this.buffer[this.readIdx];
        if (this.fadeOut) {
          const t = this.fadeFrames / this.maxFadeFrames;
          if (t >= 1) {
            // fade done — clear ring buffer, output silence
            this.fillCount = 0;
            this.readIdx = 0;
            this.writeIdx = 0;
            this.fadeOut = false;
            sample = 0;
          } else {
            sample *= 1 - t;
            this.fadeFrames++;
          }
        }
        out[i] = sample;
        this.readIdx = (this.readIdx + 1) % this.bufferSize;
        this.fillCount--;
      } else {
        out[i] = 0; // underrun → silence (no crackle)
      }
    }

    // Telemetry every ~50 ms
    this.framesSinceLastReport += out.length;
    if (this.framesSinceLastReport >= 1200) {
      this.framesSinceLastReport = 0;
      const bufferedMs = (this.fillCount / sampleRate) * 1000;
      this.port.postMessage({
        type: 'level',
        bufferedMs,
        isPlaying: this.fillCount > 0,
      });
    }

    return true;
  }
}

registerProcessor('pcm-player', PCMPlayerProcessor);
