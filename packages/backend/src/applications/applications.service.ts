import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRequest(requestId: string) {
    const request = await this.prisma.request.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');

    return this.prisma.application.findMany({
      where: { requestId },
      include: {
        helper: {
          select: { id: true, name: true, bankidVerified: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async apply(requestId: string, helperId: string, priceProposal?: number, coverLetter?: string) {
    const request = await this.prisma.request.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');
    if (request.requesterId === helperId) {
      throw new BadRequestException('Cannot apply to your own request');
    }
    if (request.status !== 'OPEN') {
      throw new BadRequestException('Request is not open for applications');
    }

    const existing = await this.prisma.application.findFirst({
      where: { requestId, helperId },
    });
    if (existing) throw new BadRequestException('Already applied to this request');

    return this.prisma.application.create({
      data: { requestId, helperId, priceProposal, coverLetter },
      include: {
        helper: {
          select: { id: true, name: true, bankidVerified: true, avatarUrl: true },
        },
      },
    });
  }

  async accept(applicationId: string, requesterId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { request: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.request.requesterId !== requesterId) {
      throw new ForbiddenException('Not your request');
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: applicationId },
        data: { status: 'ACCEPTED' },
      });
      await tx.application.updateMany({
        where: { requestId: application.requestId, id: { not: applicationId }, status: 'PENDING' },
        data: { status: 'REJECTED' },
      });
      await tx.request.update({
        where: { id: application.requestId },
        data: { status: 'IN_PROGRESS' },
      });

      return tx.booking.create({
        data: {
          requestId: application.requestId,
          requesterId: application.request.requesterId,
          helperId: application.helperId,
        },
      });
    });

    return booking;
  }

  async reject(applicationId: string, requesterId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { request: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    if (application.request.requesterId !== requesterId) {
      throw new ForbiddenException('Not your request');
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' },
    });
  }
}
