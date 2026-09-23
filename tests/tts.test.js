const request = require('supertest');
const app = require('../server');
const ttsService = require('../services/ttsService');

describe('Backend API: Edge TTS (/api/tts)', () => {
  describe('POST /api/tts validations', () => {
    test('should reject request when text is missing (400)', async () => {
      const res = await request(app).post('/api/tts').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('text là bắt buộc');
    });

    test('should reject request when text is empty string (400)', async () => {
      const res = await request(app).post('/api/tts').send({ text: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('text là bắt buộc');
    });

    test('should reject request when text exceeds length limit (400)', async () => {
      const longText = 'a'.repeat(2001);
      const res = await request(app).post('/api/tts').send({ text: longText });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('quá dài');
    });
  });

  describe('POST /api/tts success', () => {
    test('should return audio/mpeg stream with 200 status for valid text', async () => {
      const mockBuffer = Buffer.from([0xff, 0xf3, 0x64, 0xc4, 0x00, 0x01, 0x02]);
      const synthSpy = jest.spyOn(ttsService, 'synthesizeSpeech').mockResolvedValueOnce(mockBuffer);

      const res = await request(app)
        .post('/api/tts')
        .send({
          text: 'Bước 1: Nấu cháo nhừ mịn.',
          voice: 'vi-VN-HoaiMyNeural',
          rate: 1.0,
          pitch: 1.0,
          volume: 100
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('audio/mpeg');
      expect(res.body).toEqual(mockBuffer);
      expect(synthSpy).toHaveBeenCalledWith(
        'Bước 1: Nấu cháo nhừ mịn.',
        'vi-VN-HoaiMyNeural',
        expect.objectContaining({ rate: 1.0, pitch: 1.0, volume: 100 })
      );

      synthSpy.mockRestore();
    });

    test('should handle GET /api/tts query parameters', async () => {
      const mockBuffer = Buffer.from([0xff, 0xf3, 0x64, 0xc4]);
      const synthSpy = jest.spyOn(ttsService, 'synthesizeSpeech').mockResolvedValueOnce(mockBuffer);

      const res = await request(app)
        .get('/api/tts')
        .query({ text: 'Xin chào', voice: 'vi-VN-NamMinhNeural' });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('audio/mpeg');

      synthSpy.mockRestore();
    });
  });

  describe('POST /api/tts error handling', () => {
    test('should return 500 when ttsService throws error', async () => {
      const synthSpy = jest.spyOn(ttsService, 'synthesizeSpeech').mockRejectedValueOnce(new Error('TTS Service Timeout'));

      const res = await request(app)
        .post('/api/tts')
        .send({ text: 'Thử nghiệm lỗi' });

      expect(res.status).toBe(500);
      expect(res.body.error).toContain('TTS Service Timeout');

      synthSpy.mockRestore();
    });
  });
});
