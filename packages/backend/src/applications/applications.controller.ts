import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('request/:requestId')
  async getApplications(@Param('requestId') requestId: string) {
    return this.applicationsService.findByRequest(requestId);
  }

  @Post('request/:requestId')
  async apply(
    @Param('requestId') requestId: string,
    @Body() dto: { priceProposal?: number; coverLetter?: string },
    @Req() req,
  ) {
    return this.applicationsService.apply(requestId, req.user.id, dto.priceProposal, dto.coverLetter);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string, @Req() req) {
    return this.applicationsService.accept(id, req.user.id);
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Req() req) {
    return this.applicationsService.reject(id, req.user.id);
  }
}
