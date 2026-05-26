import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async updateProfile(
    @Req() req,
    @Body()
    dto: {
      name?: string;
      email?: string;
      phone?: string;
      hasFskatt?: boolean;
      orgNumber?: string;
      vatNumber?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Delete('me')
  async deleteAccountGDPR(@Req() req) {
    await this.usersService.anonymizeUserGDPR(req.user.id);
    return { success: true, message: 'Account anonymized under EU GDPR rules. Financial records preserved.' };
  }
}
