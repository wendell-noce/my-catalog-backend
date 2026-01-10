import { SubscriptionStatus } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsString()
  @IsOptional() // Pode ser opcional se você criar o registro antes da Stripe responder
  stripeSubscriptionId?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;

  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @IsString()
  @IsOptional()
  stripeItemId?: string;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsNumber()
  amount: number;

  @IsDate()
  currentPeriodStart: Date;

  @IsDate()
  currentPeriodEnd: Date;
}
