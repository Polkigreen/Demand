import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PaymentsModule } from '../payments/payments.module';
import { TaxModule } from '../tax/tax.module';

@Module({
  imports: [PaymentsModule, TaxModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
