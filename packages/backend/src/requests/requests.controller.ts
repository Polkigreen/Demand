import { Controller, Get, Query, ParseFloatPipe, DefaultValuePipe } from '@nestjs/common';
import { RequestsService } from './requests.service';

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
}
