import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(bookingId: string, reviewerId: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'COMPLETED') throw new BadRequestException('Can only review completed bookings');
    if (booking.requesterId !== reviewerId && booking.helperId !== reviewerId) {
      throw new ForbiddenException('Not part of this booking');
    }

    const existing = await this.prisma.review.findFirst({
      where: { bookingId, reviewerId },
    });
    if (existing) throw new BadRequestException('Already reviewed this booking');

    const revieweeId = booking.requesterId === reviewerId ? booking.helperId : booking.requesterId;

    return this.prisma.review.create({
      data: { bookingId, reviewerId, revieweeId, rating, comment },
      include: {
        reviewer: { select: { id: true, name: true } },
        reviewee: { select: { id: true, name: true } },
      },
    });
  }

  async getForUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
        booking: {
          select: {
            request: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAverageRating(userId: string) {
    const result = await this.prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: { rating: true },
      _count: true,
    });
    return { average: result._avg.rating || 0, count: result._count };
  }
}
