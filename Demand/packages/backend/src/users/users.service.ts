import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      hasFskatt?: boolean;
      orgNumber?: string;
      vatNumber?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * GDPR-Compliant Erasure (Right to be Forgotten)
   * Integrates with Swedish Bookkeeping Law (Bokföringslagen)
   * Retains billing relationships and ledger metrics, but wipes out identifying details.
   */
  async anonymizeUserGDPR(id: string) {
    const user = await this.findOne(id);

    // Perform anonymization on sensitive columns
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: 'Anonymized User (GDPR)',
        email: null,
        phone: null,
        personnummer: null, // Wipe Swedish ID reference
        googleId: null,
        avatarUrl: null,
        bankidVerified: false,
        bankidRef: null,
        hasFskatt: false,
        orgNumber: null,
        vatNumber: null,
      },
    });
  }
}
