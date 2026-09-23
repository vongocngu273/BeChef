const { EdgeTTS } = require('edge-tts-universal');

/**
 * Synthesizes text to speech using Microsoft Edge TTS.
 * @param {string} text - Text to synthesize into speech.
 * @param {string} [voice="vi-VN-HoaiMyNeural"] - Preferred voice ('vi-VN-HoaiMyNeural' or 'vi-VN-NamMinhNeural').
 * @param {object} [options] - Optional rate, pitch, volume prosody adjustments.
 * @returns {Promise<Buffer>} - MP3 Audio buffer.
 */
async function synthesizeSpeech(text, voice = 'vi-VN-HoaiMyNeural', options = {}) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Văn bản cần đọc (text) là bắt buộc và phải là chuỗi không rỗng.');
  }

  // Format rate (e.g. "+0%", "+15%", "-10%")
  let rate = '+0%';
  if (options.rate !== undefined && options.rate !== null) {
    if (typeof options.rate === 'string' && (options.rate.includes('%') || options.rate.includes('Hz'))) {
      rate = options.rate;
    } else if (typeof options.rate === 'number') {
      const pct = Math.round((options.rate - 1) * 100);
      rate = pct >= 0 ? `+${pct}%` : `${pct}%`;
    }
  }

  // Format pitch (e.g. "+0Hz", "+5Hz", "-5Hz")
  let pitch = '+0Hz';
  if (options.pitch !== undefined && options.pitch !== null) {
    if (typeof options.pitch === 'string' && options.pitch.includes('Hz')) {
      pitch = options.pitch;
    } else if (typeof options.pitch === 'number') {
      const hz = Math.round((options.pitch - 1) * 50);
      pitch = hz >= 0 ? `+${hz}Hz` : `${hz}Hz`;
    }
  }

  // Format volume (e.g. "+0%", "-10%")
  let volume = '+0%';
  if (options.volume !== undefined && options.volume !== null) {
    if (typeof options.volume === 'string' && options.volume.includes('%')) {
      volume = options.volume;
    } else if (typeof options.volume === 'number') {
      const pct = Math.round(options.volume - 100);
      volume = pct >= 0 ? `+${pct}%` : `${pct}%`;
    }
  }

  const validVoices = ['vi-VN-HoaiMyNeural', 'vi-VN-NamMinhNeural'];
  const chosenVoice = validVoices.includes(voice) ? voice : 'vi-VN-HoaiMyNeural';

  const tts = new EdgeTTS(text.trim(), chosenVoice, { rate, pitch, volume });
  const result = await tts.synthesize();

  if (!result || !result.audio) {
    throw new Error('Không thể tạo luồng âm thanh từ Microsoft Edge TTS.');
  }

  const arrayBuffer = await result.audio.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = {
  synthesizeSpeech
};
