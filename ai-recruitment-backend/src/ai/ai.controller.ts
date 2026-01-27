import { Controller } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // Kita tidak butuh endpoint GET/POST langsung ke sini untuk saat ini.
  // Biarkan kosong atau tambahkan nanti jika butuh.
}
