// AudioWorklet processor for low-latency microphone capture.
// Runs on the audio rendering thread — no main-thread jank.
//
// Buffer size: 320 samples = 20 ms at 16 kHz. Smaller chunks = lower
// barge-in latency (Gemini Live VAD reacts faster to start-of-speech).
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 320;
    this._buffer = new Float32Array(this.bufferSize);
    this._bytesWritten = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0]; // mono

    // Energy → UI level meter (amplified for visual feedback)
    let energy = 0;
    for (let i = 0; i < channelData.length; i++) {
      energy += Math.abs(channelData[i]);
    }
    const avgEnergy = energy / channelData.length;
    this.port.postMessage({ type: 'level', level: avgEnergy * 5 });

    // Append to PCM buffer; flush every 20 ms
    for (let i = 0; i < channelData.length; i++) {
      this._buffer[this._bytesWritten++] = channelData[i];

      if (this._bytesWritten >= this.bufferSize) {
        const pcm = new Int16Array(this.bufferSize);
        for (let j = 0; j < this.bufferSize; j++) {
          const s = Math.max(-1, Math.min(1, this._buffer[j]));
          pcm[j] = s * 0x7FFF;
        }

        this.port.postMessage(
          { type: 'audio', buffer: pcm.buffer },
          [pcm.buffer]
        );

        this._bytesWritten = 0;
      }
    }

    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
