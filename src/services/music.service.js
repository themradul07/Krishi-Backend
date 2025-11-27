import { GoogleGenAI } from "@google/genai";
import { Buffer } from "buffer";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1alpha",
});

/**
 * Generate music from text prompt and return a WAV audio buffer
 * @param {string} prompt - Music prompt (genre, instrument, mood, etc.)
 * @returns {Promise<Buffer>} - WAV audio file buffer
 */
export async function generateMusic(prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      let chunks = []; // store PCM16 chunks

      const session = await client.live.music.connect({
        model: "models/lyria-realtime-exp",
        callbacks: {
          onmessage: (message) => {
            if (message.serverContent?.audioChunks) {
              for (const chunk of message.serverContent.audioChunks) {
                const audioBuffer = Buffer.from(chunk.data, "base64");
                chunks.push(audioBuffer);
              }
            }
          },
          onerror: (err) => {
            console.error("Lyria error:", err);
            reject(err);
          },
          onclose: () => {
            // When stream closes, finalize WAV
            const pcmData = Buffer.concat(chunks);
            const wav = pcm16ToWav(pcmData, 44100, 2);
            resolve(wav);
          },
        },
      });

      // Set prompt
      await session.setWeightedPrompts({
        weightedPrompts: [
          { text: prompt, weight: 1.0 },
        ],
      });

      // Configuration
      await session.setMusicGenerationConfig({
        musicGenerationConfig: {
          bpm: 100,
          temperature: 1.0,
          audioFormat: "pcm16",
          sampleRateHz: 44100,
        },
      });

      // Start music
      session.play();

      // Auto-stop after 5 seconds (modify as needed)
      setTimeout(async () => {
        await session.stop();
        await session.close();
      }, 5000);

    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Convert PCM16 audio buffer to WAV format
 */
function pcm16ToWav(pcmData, sampleRate = 44100, channels = 2) {
  const header = Buffer.alloc(44);

  const byteRate = (sampleRate * channels * 16) / 8;
  const blockAlign = (channels * 16) / 8;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM
  header.writeUInt16LE(1, 20);  // Audio format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(pcmData.length, 40);

  return Buffer.concat([header, pcmData]);
}
