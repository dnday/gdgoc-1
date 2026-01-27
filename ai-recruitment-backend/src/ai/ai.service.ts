import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // [UPDATE] Menggunakan 'gemini-2.5-flash' sesuai permintaan
    // Jika nanti error 404, coba ganti jadi 'gemini-2.0-flash-exp' atau 'gemini-1.5-flash'
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    // Handling library pdf-parse agar aman
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfModule = require('pdf-parse');
    const pdfFunc = pdfModule.default ? pdfModule.default : pdfModule;

    try {
      const data = await pdfFunc(buffer);
      return data.text.replace(/\n\n/g, '\n').trim();
    } catch (error) {
      console.error('❌ Error Extract PDF:', error);
      throw new Error('Gagal mengekstrak teks dari PDF.');
    }
  }

  async analyzeCandidate(resumeText: string, jobRequirements: string) {
    const prompt = `
      Act as an HR Recruiter. Analyze the RESUME below against the JOB REQUIREMENTS.
      
      JOB REQUIREMENTS: "${jobRequirements}"
      RESUME: "${resumeText.substring(0, 15000)}"
      
      Return valid JSON:
      {
        "skills": ["skill1", "skill2"],
        "summary": "Short summary.",
        "matchScore": 85,
        "explanation": "Reason for score."
      }
    `;

    try {
      console.log('🤖 Mengirim ke Gemini 2.5 Flash...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Bersihkan format JSON dari markdown
      text = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      console.log('✅ Respons AI Diterima!');
      return JSON.parse(text);
    } catch (e) {
      console.error('❌ AI ERROR:', e);

      // Fallback Data jika model belum support/error
      return {
        matchScore: 0,
        explanation:
          'Gagal: Model 2.5 Flash belum ditemukan atau API Key salah.',
        skills: [],
        summary: 'Error System',
      };
    }
  }
}
