import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('booking/:bookingId')
  async createReview(
    @Param('bookingId') bookingId: string,
    @Body() dto: { rating: number; comment?: string },
    @Req() req,
  ) {
    return this.reviewsService.create(bookingId, req.user.id, dto.rating, dto.comment);
  }

  @Get('user/:userId')
  async getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getForUser(userId);
  }

  @Get('user/:userId/rating')
  async getUserRating(@Param('userId') userId: string) {
    return this.reviewsService.getAverageRating(userId);
  }
}
