import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bankidVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Proximity Geospatial Search
   * Employs standard Haversine mathematical algorithm in raw SQL
   * to query all tasks inside a circular radius of X kilometers.
   */
  async findNearby(lat: number, lng: number, radiusKm: number) {
    return this.prisma.$queryRawUnsafe(`
      SELECT 
        r.id, 
        r.title, 
        r.description, 
        r.location, 
        r.latitude, 
        r.longitude, 
        r.category, 
        r.price, 
        r.status, 
        r."createdAt",
        u.name as "requesterName",
        u."bankidVerified"
      FROM "Request" r
      JOIN "User" u ON r."requesterId" = u.id
      WHERE (
        6371 * acos(
          cos(radians(${lat})) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(${lng})) + 
          sin(radians(${lat})) * sin(radians(r.latitude))
        )
      ) <= ${radiusKm}
      ORDER BY r."createdAt" DESC
    `);
  }
}
