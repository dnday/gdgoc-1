import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AiService } from '../src/ai/ai.service';
import { AppModule } from './../src/app.module';

describe('Recruitment System (E2E)', () => {
  let app: INestApplication;
  let aiService: AiService;

  // Variabel untuk menyimpan data antar test
  let accessToken: string;
  let jobId: string;

  // Supaya email tidak error duplikat saat di-test berkali-kali
  const uniqueEmail = `hr_${Date.now()}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get AI service dan mock methodsnya
    aiService = moduleFixture.get<AiService>(AiService);

    // Mock extractTextFromPdf untuk return text dummy
    jest
      .spyOn(aiService, 'extractTextFromPdf')
      .mockResolvedValue(
        'John Doe\nSoftware Engineer\nExperience: 5 years\nSkills: JavaScript, TypeScript, Node.js',
      );

    // Mock analyzeCandidate untuk return hasil AI dummy
    jest.spyOn(aiService, 'analyzeCandidate').mockResolvedValue({
      skills: ['JavaScript', 'TypeScript', 'Node.js'],
      summary: 'Experienced software engineer with strong backend skills',
      matchScore: 85,
      explanation: 'Good match for the position',
    });
  });

  // --- STEP 1: REGISTER ---
  it('/auth/register (POST) - Harus sukses daftar User baru', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: uniqueEmail,
        password: 'password123',
        name: 'Jest Tester',
      })
      .expect(201) // Harapannya Created
      .expect((res) => {
        // Pastikan dapet token langsung (sesuai logika auth service kita)
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  // --- STEP 2: LOGIN ---
  it('/auth/login (POST) - Harus sukses login & dapat Token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        // SIMPAN TOKEN UNTUK TEST BERIKUTNYA
        accessToken = res.body.accessToken;
      });
  });

  // --- STEP 3: CREATE JOB ---
  it('/jobs (POST) - Harus sukses buat Job pakai Token tadi', () => {
    return request(app.getHttpServer())
      .post('/jobs')
      .set('Authorization', `Bearer ${accessToken}`) // Pasang Token
      .send({
        title: 'Automation Engineer',
        description: 'Test pake Jest',
        requirements: 'Bisa coding',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        // SIMPAN ID JOB UNTUK TEST BERIKUTNYA
        jobId = res.body.id;
      });
  });

  // --- STEP 4: APPLY JOB (UPLOAD FILE) ---
  it('/applications (POST) - Harus sukses upload PDF & AI Scoring', () => {
    // Buat dummy PDF buffer (tidak perlu valid karena sudah di-mock)
    const fakePdfBuffer = Buffer.from('dummy pdf content');

    return (
      request(app.getHttpServer())
        .post('/applications')
        // .set('Authorization', ...) // Kalau endpoint ini public, gak perlu auth
        .field('jobId', jobId) // Kirim Field biasa
        .field('candidateName', 'Kandidat Jest')
        .field('email', 'kandidat@jest.com')
        .attach('resume', fakePdfBuffer, 'cv-test.pdf') // Kirim File!
        .expect(201)
        .expect((res) => {
          // Cek apakah AI bekerja
          console.log('🤖 AI Response di Jest:', res.body);
          expect(res.body).toHaveProperty('matchScore');
          expect(res.body).toHaveProperty('summary');
        })
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
