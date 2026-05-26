import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logTransaction(helperId: string, requesterId: string, amount: number) {
    const year = new Date().getFullYear();

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.yearlyTaxSummary.findUnique({
        where: {
          helperId_requesterId_year: { helperId, requesterId, year },
        },
      });

      if (existing) {
        return tx.yearlyTaxSummary.update({
          where: { id: existing.id },
          data: { totalAmount: { increment: amount } },
        });
      }

      return tx.yearlyTaxSummary.create({
        data: { helperId, requesterId, year, totalAmount: amount },
      });
    });
  }

  async getHelperReport(helperId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    const records = await this.prisma.yearlyTaxSummary.findMany({
      where: { helperId, year: targetYear },
      include: {
        requester: { select: { id: true, name: true } },
      },
    });

    const totalEarnings = records.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      year: targetYear,
      helperId,
      totalEarnings,
      requiresT2Declaration: totalEarnings >= 24300,
      records: records.map((r) => ({
        requesterId: r.requesterId,
        requesterName: r.requester.name,
        amount: r.totalAmount,
        exceedsKu30Limit: r.totalAmount >= 10000,
      })),
    };
  }

  async getRequesterReport(requesterId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    const records = await this.prisma.yearlyTaxSummary.findMany({
      where: { requesterId, year: targetYear },
      include: {
        helper: { select: { id: true, name: true } },
      },
    });

    const totalPaid = records.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      year: targetYear,
      requesterId,
      totalPaid,
      records: records.map((r) => ({
        helperId: r.helperId,
        helperName: r.helper.name,
        amount: r.totalAmount,
        requiresKu30: r.totalAmount >= 10000,
      })),
    };
  }
}
