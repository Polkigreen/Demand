import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomBytes } from 'crypto';

interface OtpEntry {
  otp: string;
  expiry: number; // Unix timestamp ms
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly otpCache = new Map<string, OtpEntry>();

  constructor(private readonly config: ConfigService) {}

  async sendSms(to: string, message: string): Promise<boolean> {
    const username = this.config.get<string>('ELKS_API_USER');
    const password = this.config.get<string>('ELKS_API_PASSWORD');

    if (!username || !password) {
      this.logger.warn(
        `[MOCK 46elks] SMS to=${to} | msg="${message}"`,
      );
      return true;
    }

    try {
      const basicAuth = Buffer.from(`${username}:${password}`).toString(
        'base64',
      );
      const params = new URLSearchParams();
      params.append('from', 'Demand');
      params.append('to', to);
      params.append('message', message);

      await axios.post('https://api.46elks.com/a1/sms', params, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.logger.log(`SMS dispatched to ${to}`);
      return true;
    } catch (err: any) {
      this.logger.error('46elks dispatch failed', err?.message);
      return false;
    }
  }

  async sendOtp(phone: string): Promise<string> {
    // Generate a cryptographically random 6-digit OTP
    const otp = (parseInt(randomBytes(3).toString('hex'), 16) % 900000 + 100000).toString();

    this.otpCache.set(phone, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    const message = `Your Demand verification code is: ${otp}. Valid for 5 minutes.`;
    await this.sendSms(phone, message);

    return otp; // Return for mock/dev usage
  }

  verifyOtp(phone: string, inputOtp: string): boolean {
    const entry = this.otpCache.get(phone);

    if (!entry) {
      throw new BadRequestException('No OTP found for this phone number. Please request a new code.');
    }
    if (Date.now() > entry.expiry) {
      this.otpCache.delete(phone);
      throw new BadRequestException('OTP has expired. Please request a new code.');
    }
    if (entry.otp !== inputOtp) {
      return false;
    }

    this.otpCache.delete(phone); // Single-use
    return true;
  }
}
