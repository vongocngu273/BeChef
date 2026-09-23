const express = require('express');
const router = express.Router();
const ttsService = require('../services/ttsService');

/**
 * POST /api/tts
 * Body: { text: string, voice?: string, rate?: string|number, pitch?: string|number, volume?: string|number }
 * Returns: audio/mpeg stream buffer
 */
router.post('/tts', async (req, res) => {
  try {
    const { text, voice, rate, pitch, volume } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        error: 'Tham số text là bắt buộc và phải là chuỗi không rỗng.'
      });
    }

    // Limit text length to prevent misuse
    if (text.length > 2000) {
      return res.status(400).json({
        error: 'Văn bản quá dài (tối đa 2000 ký tự).'
      });
    }

    const audioBuffer = await ttsService.synthesizeSpeech(text, voice, { rate, pitch, volume });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400'
    });

    return res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('Error in /api/tts endpoint:', error);
    return res.status(500).json({
      error: error.message || 'Lỗi khi tổng hợp giọng đọc từ Microsoft Edge TTS.'
    });
  }
});

/**
 * GET /api/tts?text=...&voice=...
 * Handy for direct audio element src or quick testing
 */
router.get('/tts', async (req, res) => {
  try {
    const { text, voice, rate, pitch, volume } = req.query;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        error: 'Tham số query text là bắt buộc.'
      });
    }

    const audioBuffer = await ttsService.synthesizeSpeech(text, voice, { rate, pitch, volume });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400'
    });

    return res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('Error in GET /api/tts:', error);
    return res.status(500).json({
      error: error.message || 'Lỗi khi tổng hợp giọng đọc từ Microsoft Edge TTS.'
    });
  }
});

module.exports = router;
