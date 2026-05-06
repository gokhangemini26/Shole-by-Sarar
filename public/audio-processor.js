// AudioWorklet processor for low-latency microphone capture
// Runs on the audio rendering thread — no main-thread jank
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = new Float32Array(0);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0]; // mono

    // Check energy — skip silence
    let energy = 0;
    for (let i = 0; i < channelData.length; i++) {
      energy += Math.abs(channelData[i]);
    }
    const avgEnergy = energy / channelData.length;

    // Send audio level for visualization
    this.port.postMessage({ type: 'level', level: avgEnergy * 5 });

    // Convert Float32 to Int16 PCM
    const pcm = new Int16Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      pcm[i] = s * 0x7FFF;
    }

    // Send PCM buffer to main thread
    this.port.postMessage(
      { type: 'audio', buffer: pcm.buffer },
      [pcm.buffer]
    );

    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
