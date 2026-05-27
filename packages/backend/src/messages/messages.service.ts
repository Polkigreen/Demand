import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.requesterId !== userId && booking.helperId !== userId) {
      throw new ForbiddenException('Not part of this booking');
    }

    return this.prisma.message.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });
  }

  async sendMessage(bookingId: string, senderId: string, content: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.requesterId !== senderId && booking.helperId !== senderId) {
      throw new ForbiddenException('Not part of this booking');
    }

    const receiverId = booking.requesterId === senderId ? booking.helperId : booking.requesterId;

    const message = await this.prisma.message.create({
      data: { bookingId, senderId, receiverId, content },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    return message;
  }

  async getUserThreads(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [{ requesterId: userId }, { helperId: userId }],
      },
      include: {
        request: { select: { id: true, title: true, price: true } },
        requester: { select: { id: true, name: true, bankidVerified: true } },
        helper: { select: { id: true, name: true, bankidVerified: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return bookings.map((b) => {
      const partner = b.requesterId === userId ? b.helper : b.requester;
      return {
        bookingId: b.id,
        requestId: b.request.id,
        taskTitle: b.request.title,
        price: b.request.price,
        partnerName: partner.name,
        partnerId: partner.id,
        partnerBankidVerified: partner.bankidVerified,
        lastMessage: b.messages[0]?.content || null,
        lastMessageAt: b.messages[0]?.createdAt || b.createdAt,
      };
    });
  }
}
