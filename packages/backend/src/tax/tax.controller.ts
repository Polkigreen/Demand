import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TaxService } from './tax.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tax')
@UseGuards(JwtAuthGuard)
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get('helper-report')
  async getHelperReport(@Req() req, @Query('year') year?: string) {
    return this.taxService.getHelperReport(req.user.id, year ? parseInt(year) : undefined);
  }

  @Get('requester-report')
  async getRequesterReport(@Req() req, @Query('year') year?: string) {
    return this.taxService.getRequesterReport(req.user.id, year ? parseInt(year) : undefined);
  }
}
