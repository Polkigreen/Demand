import { Controller, Post, Body, Req, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CollectBankIdDto, EmailLoginDto, EmailRegisterDto, GoogleAuthDto, InitiateBankIdDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('bankid/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateBankId(@Body() dto: InitiateBankIdDto, @Ip() ipAddress: string) {
    // Falls back to a default ip in localhost development
    const ip = ipAddress === '::1' || ipAddress === '127.0.0.1' ? '127.0.0.1' : ipAddress;
    return this.authService.initiateBankId(dto, ip);
  }

  @Post('bankid/collect')
  @HttpCode(HttpStatus.OK)
  async collectBankId(@Body() dto: CollectBankIdDto) {
    return this.authService.collectBankId(dto.orderRef);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.authenticateGoogle(dto);
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async registerEmail(@Body() dto: EmailRegisterDto) {
    return this.authService.registerEmail(dto);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  async loginEmail(@Body() dto: EmailLoginDto) {
    return this.authService.loginEmail(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
