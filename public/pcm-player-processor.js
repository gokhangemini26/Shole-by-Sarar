// Output PCM player AudioWorkletProcessor.
// Runs in the audio rendering thread; immune to main-thread jank.
//
// Holds a ~6-second ring buffer of Float32 samples at the context's
// sample rate (we run the parent context at 24 kHz, matching Gemini Live).
//
// Dual-mode jitter buffer:
//   COLD priming (350 ms): After a stop/clear/barge-in. Absorbs Gemini's
//       bursty recovery delivery so we don't play a near-empty buffer.
//   HOT priming (80 ms): After a natural end-of-turn drain. The next
//       response starts with minimal latency — no perceptible gap.
//
// Message protocol from the main thread:
//   { type: 'pcm', data: ArrayBuffer (Int16 little-endian samples) }
//   { type: 'stop' }        — fade out over ~25 ms then clear buffer
//   { type: 'clear' }       — instant clear, no fade
//   { type: 'turn_ended' }  — mark that the current turn is done (buffer
//                              will drain naturally; don't report underrun)
//
// Periodically posts back:
//   { type: 'level', bufferedMs: number, isPlaying: boolean, priming: boolean }
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // 6 s @ 24 kHz = 144 000 samples. Cheap (about 576 KB).
    this.bufferSize = 144000;
    this.buffer = new Float32Array(this.bufferSize);
    this.readIdx = 0;
    this.writeIdx = 0;
    this.fillCount = 0;

    // ── Dual-mode prebuffer thresholds ────────────────────────────────
    // COLD: after stop/clear/barge-in — need more buffer to survive the
    //       burst-then-gap pattern Gemini sends during recovery.
    this.coldPrebufferSamples = 9600; // 400 ms @ 24 kHz
    // HOT: after natural end-of-turn drain — the next response's chunks
    //       arrive in a tight burst, but can still have 100-200ms gaps.
    this.hotPrebufferSamples  = 4800; // 200 ms @ 24 kHz

    this.prebufferSamples = this.coldPrebufferSamples; // start cold
    this.priming = true;

    // When true, the current turn's audio is done — buffer draining to
    // zero is expected and should NOT be reported as an underrun.
    this.turnEnded = false;
    // Track whether we were actively playing (had audio) before drain.
    this.wasPlaying = false;

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
        // New audio cancels any pending fade-out and clears turn-ended flag.
        this.fadeOut = false;
        this.fadeFrames = 0;
        this.turnEnded = false;
      } else if (msg.type === 'stop') {
        if (this.fillCount > 0 && !this.priming) {
          this.fadeOut = true;
          this.fadeFrames = 0;
        } else {
          this.readIdx = 0;
          this.writeIdx = 0;
          this.fillCount = 0;
          this.priming = true;
          this.prebufferSamples = this.coldPrebufferSamples; // cold after barge-in
        }
        this.turnEnded = false;
      } else if (msg.type === 'clear') {
        this.readIdx = 0;
        this.writeIdx = 0;
        this.fillCount = 0;
        this.fadeOut = false;
        this.fadeFrames = 0;
        this.priming = true;
        this.prebufferSamples = this.coldPrebufferSamples; // cold after clear
        this.turnEnded = false;
      } else if (msg.type === 'turn_ended') {
        // The server has sent turnComplete. When the buffer drains, it's
        // a natural end — not an underrun. Next turn uses hot priming.
        this.turnEnded = true;
      }
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0] && outputs[0][0];
    if (!out) return true;

    // Exit priming mode when enough audio has accumulated.
    if (this.priming && this.fillCount >= this.prebufferSamples) {
      this.priming = false;
      this.wasPlaying = true;
    }

    for (let i = 0; i < out.length; i++) {
      if (this.priming || this.fillCount === 0) {
        out[i] = 0;
        if (this.fillCount === 0 && !this.priming && this.wasPlaying) {
          // Buffer drained while we were playing.
          this.priming = true;
          this.wasPlaying = false;
          if (this.turnEnded) {
            // Natural end-of-turn → use HOT priming for the next response.
            this.prebufferSamples = this.hotPrebufferSamples;
          } else {
            // Mid-turn underrun → use COLD priming (more conservative).
            this.prebufferSamples = this.coldPrebufferSamples;
          }
        }
        continue;
      }

      let sample = this.buffer[this.readIdx];
      if (this.fadeOut) {
        const t = this.fadeFrames / this.maxFadeFrames;
        if (t >= 1) {
          // Fade done — clear ring buffer, output silence.
          this.fillCount = 0;
          this.readIdx = 0;
          this.writeIdx = 0;
          this.fadeOut = false;
          this.priming = true;
          this.prebufferSamples = this.coldPrebufferSamples; // cold after barge-in fade
          this.wasPlaying = false;
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
