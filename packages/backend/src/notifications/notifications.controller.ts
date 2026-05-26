import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsString, Length } from 'class-validator';

class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
}

class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('sms/send-otp')
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.smsService.sendOtp(dto.phone);
    return { success: true, message: 'OTP sent to your phone number.' };
  }

  @Post('sms/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const verified = this.smsService.verifyOtp(dto.phone, dto.otp);
    return { verified };
  }
}
