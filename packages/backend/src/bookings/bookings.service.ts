import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StripeService } from '../payments/stripe.service';
import { TaxService } from '../tax/tax.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly taxService: TaxService,
  ) {}

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        OR: [{ requesterId: userId }, { helperId: userId }],
      },
      include: {
        request: { select: { id: true, title: true, price: true, category: true, location: true } },
        requester: { select: { id: true, name: true, bankidVerified: true } },
        helper: { select: { id: true, name: true, bankidVerified: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async payForBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { request: true, payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.requesterId !== userId) throw new ForbiddenException('Only requester can pay');
    if (booking.payment) throw new BadRequestException('Booking already has a payment');

    const { paymentIntentId, clientSecret } = await this.stripeService.holdEscrow(
      booking.request.price,
      bookingId,
    );

    await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.request.price,
        stripePaymentIntentId: paymentIntentId,
        status: 'PENDING',
      },
    });

    return { paymentIntentId, clientSecret };
  }

  async completeBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true, request: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.requesterId !== userId) throw new ForbiddenException('Only requester can complete');
    if (!booking.payment) throw new BadRequestException('Payment not made yet');

    // Release escrow (90% to helper, 10% platform)
    await this.stripeService.releaseEscrow(
      booking.payment.stripePaymentIntentId!,
      'mock-helper-stripe-account',
      booking.request.price,
    );

    // Log tax transaction
    await this.taxService.logTransaction(booking.helperId, booking.requesterId, booking.request.price);

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
    });

    await this.prisma.payment.update({
      where: { id: booking.payment.id },
      data: { status: 'PAID' },
    });

    await this.prisma.request.update({
      where: { id: booking.requestId },
      data: { status: 'COMPLETED' },
    });

    return updated;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.requesterId !== userId && booking.helperId !== userId) {
      throw new ForbiddenException('Not part of this booking');
    }
    if (booking.status === 'COMPLETED') throw new BadRequestException('Cannot cancel completed booking');

    if (booking.payment && booking.payment.stripePaymentIntentId) {
      await this.stripeService.refundEscrow(booking.payment.stripePaymentIntentId);
      await this.prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'REFUNDED' },
      });
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }
}
