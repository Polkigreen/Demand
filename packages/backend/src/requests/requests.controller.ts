import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseFloatPipe, DefaultValuePipe, UseGuards, Req } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getRequests() {
    return this.requestsService.findAll();
  }

  @Get('nearby')
  async getNearbyRequests(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', new DefaultValuePipe(10), ParseFloatPipe) radius: number,
  ) {
    return this.requestsService.findNearby(lat, lng, radius);
  }

  @Get(':id')
  async getRequest(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRequest(
    @Req() req,
    @Body()
    dto: {
      title: string;
      description: string;
      location: string;
      category: string;
      price: number;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.requestsService.create({ ...dto, requesterId: req.user.id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateRequest(
    @Req() req,
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      description?: string;
      location?: string;
      category?: string;
      price?: number;
      latitude?: number;
      longitude?: number;
    },
  ) {
    return this.requestsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRequest(@Req() req, @Param('id') id: string) {
    await this.requestsService.delete(id, req.user.id);
    return { success: true, message: 'Request deleted successfully' };
  }
}
