import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('threads')
  async getThreads(@Req() req) {
    return this.messagesService.getUserThreads(req.user.id);
  }

  @Get('booking/:bookingId')
  async getMessages(@Param('bookingId') bookingId: string, @Req() req) {
    return this.messagesService.findByBooking(bookingId, req.user.id);
  }

  @Post('booking/:bookingId')
  async sendMessage(
    @Param('bookingId') bookingId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    return this.messagesService.sendMessage(bookingId, req.user.id, content);
  }
}
