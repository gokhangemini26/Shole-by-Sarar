// Output PCM player AudioWorkletProcessor.
// Runs in the audio rendering thread; immune to main-thread jank.
//
// Holds a ~6-second ring buffer of Float32 samples at the context's
// sample rate (we run the parent context at 24 kHz, matching Gemini Live).
//
// Jitter buffer behaviour:
//   - When idle (fillCount === 0) we require PREBUFFER_MS of audio to
//     accumulate before resuming output. This absorbs Gemini's bursty
//     chunk delivery so we don't start playing on a near-empty buffer
//     and then underrun a few ms later.
//   - Once playing, the buffer can drain freely. If it hits zero we go
//     back to 'priming' mode silently — no crackle, just a short gap.
//
// Message protocol from the main thread:
//   { type: 'pcm', data: ArrayBuffer (Int16 little-endian samples) }
//   { type: 'stop' }   — fade out over ~25 ms then clear buffer
//   { type: 'clear' }  — instant clear, no fade
//
// Periodically posts back:
//   { type: 'level', bufferedMs: number, isPlaying: boolean }
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 6 s @ 24 kHz = 144 000 samples. Cheap (about 576 KB).
    this.bufferSize = 144000;
    this.buffer = new Float32Array(this.bufferSize);
    this.readIdx = 0;
    this.writeIdx = 0;
    this.fillCount = 0;

    // Wait until this many samples are buffered before (re)starting
    // playback. 250 ms @ 24 kHz = 6000 samples. Empirically this is
    // enough to mask Gemini's 200–500 ms inter-chunk gaps without
    // noticeable startup latency.
    this.prebufferSamples = 6000;
    this.priming = true; // start in 'wait for prebuffer' mode

    this.fadeOut = false;
    this.fadeFrames = 0;
    this.maxFadeFrames = 600; // ~25 ms @ 24 kHz

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
        if (this.fillCount > 0 && !this.priming) {
          this.fadeOut = true;
          this.fadeFrames = 0;
        } else {
          // Nothing playing — just clear so any tail can't sneak in.
          this.readIdx = 0;
          this.writeIdx = 0;
          this.fillCount = 0;
          this.priming = true;
        }
      } else if (msg.type === 'clear') {
        this.readIdx = 0;
        this.writeIdx = 0;
        this.fillCount = 0;
        this.fadeOut = false;
        this.fadeFrames = 0;
        this.priming = true;
      }
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0] && outputs[0][0];
    if (!out) return true;

    // Exit priming mode when the prebuffer is full.
    if (this.priming && this.fillCount >= this.prebufferSamples) {
      this.priming = false;
    }

    for (let i = 0; i < out.length; i++) {
      if (this.priming || this.fillCount === 0) {
        out[i] = 0;
        if (this.fillCount === 0 && !this.priming) {
          // Underrun → re-enter priming so the next chunks fill before
          // we resume, avoiding the next stutter.
          this.priming = true;
        }
        continue;
      }

      let sample = this.buffer[this.readIdx];
      if (this.fadeOut) {
        const t = this.fadeFrames / this.maxFadeFrames;
        if (t >= 1) {
          // fade done — clear ring buffer, output silence
          this.fillCount = 0;
          this.readIdx = 0;
          this.writeIdx = 0;
          this.fadeOut = false;
          this.priming = true;
          sample = 0;
        } else {
          sample *= 1 - t;
          this.fadeFrames++;
        }
      }
      out[i] = sample;
      this.readIdx = (this.readIdx + 1) % this.bufferSize;
      this.fillCount--;
    }

    // Telemetry every ~50 ms
    this.framesSinceLastReport += out.length;
    if (this.framesSinceLastReport >= 1200) {
      this.framesSinceLastReport = 0;
      const bufferedMs = (this.fillCount / sampleRate) * 1000;
      this.port.postMessage({
        type: 'level',
        bufferedMs,
        isPlaying: !this.priming && this.fillCount > 0,
        priming: this.priming,
      });
    }

    return true;
  }
}

registerProcessor('pcm-player', PCMPlayerProcessor);
