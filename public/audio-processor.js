// AudioWorklet processor for low-latency microphone capture
// Runs on the audio rendering thread — no main-thread jank
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this._buffer = new Float32Array(this.bufferSize);
    this._bytesWritten = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0]; // mono

    // Check energy — skip silence for UI level, not for data
    let energy = 0;
    for (let i = 0; i < channelData.length; i++) {
      energy += Math.abs(channelData[i]);
    }
    const avgEnergy = energy / channelData.length;
    this.port.postMessage({ type: 'level', level: avgEnergy * 5 });

    // Append to buffer
    for (let i = 0; i < channelData.length; i++) {
      this._buffer[this._bytesWritten++] = channelData[i];

      if (this._bytesWritten >= this.bufferSize) {
        // Convert Float32 to Int16 PCM
        const pcm = new Int16Array(this.bufferSize);
        for (let j = 0; j < this.bufferSize; j++) {
          const s = Math.max(-1, Math.min(1, this._buffer[j]));
          pcm[j] = s * 0x7FFF;
        }

        // Send PCM buffer to main thread
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
