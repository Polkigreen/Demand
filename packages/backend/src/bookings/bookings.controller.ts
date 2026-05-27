import { Controller, Get, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getUserBookings(@Req() req) {
    return this.bookingsService.getUserBookings(req.user.id);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: string, @Req() req) {
    return this.bookingsService.payForBooking(id, req.user.id);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Req() req) {
    return this.bookingsService.completeBooking(id, req.user.id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }
}
