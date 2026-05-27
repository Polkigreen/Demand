import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@demand/database';
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

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bankidVerified: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async create(data: {
    title: string;
    description: string;
    location: string;
    category: string;
    price: number;
    latitude?: number;
    longitude?: number;
    requesterId: string;
  }) {
    return this.prisma.request.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        category: data.category,
        price: data.price,
        latitude: data.latitude,
        longitude: data.longitude,
        requesterId: data.requesterId,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bankidVerified: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      location?: string;
      category?: string;
      price?: number;
      latitude?: number;
      longitude?: number;
    },
  ) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only update your own requests');
    }

    return this.prisma.request.update({
      where: { id },
      data,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bankidVerified: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const request = await this.prisma.request.findUnique({ where: { id } });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.requesterId !== userId) {
      throw new ForbiddenException('You can only delete your own requests');
    }

    return this.prisma.request.delete({ where: { id } });
  }

  /**
    * Proximity Geospatial Search
    * Employs standard Haversine mathematical algorithm in raw SQL
    * to query all tasks inside a circular radius of X kilometers.
    */
  async findNearby(lat: number, lng: number, radiusKm: number) {
    return this.prisma.$queryRaw(
      Prisma.sql`
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
      `
    );
  }
}
