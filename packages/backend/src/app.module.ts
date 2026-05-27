import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { TaxModule } from './tax/tax.module';
import { MessagesModule } from './messages/messages.module';
import { ApplicationsModule } from './applications/applications.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RequestsModule,
    NotificationsModule,
    PaymentsModule,
    TaxModule,
    MessagesModule,
    ApplicationsModule,
    BookingsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
