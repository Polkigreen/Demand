import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { NotificationsController } from './notifications.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class NotificationsModule {}
