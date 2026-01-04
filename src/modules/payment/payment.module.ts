// src/modules/payment/payment.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeAdapter } from './adapters/stripe.adapter';
import { PaymentService } from './payment.service';

@Module({
  imports: [ConfigModule],
  providers: [PaymentService, StripeAdapter],
  exports: [PaymentService], // Exporta pra outros módulos usarem
})
export class PaymentModule {}
