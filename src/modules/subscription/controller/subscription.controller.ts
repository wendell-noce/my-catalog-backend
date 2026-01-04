import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import {
  ApiCreateSubscription,
  ApiGetUserPlans,
} from '../decorators/api-docs.decorator';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionService } from '../service/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiCreateSubscription()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiGetUserPlans()
  getUserPlans(@Request() req) {
    return this.subscriptionService.getSubscriptionsByUserId(req.user.id);
  }
}
