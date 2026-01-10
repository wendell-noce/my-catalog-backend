import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { SubscriptionService } from 'src/modules/subscription/service/subscription.service';
import Stripe from 'stripe';
import { ApiStripeWebhook } from '../decorator/api-docs.decorator';
import { StripeService } from '../service/stripe.service';
@ApiTags('Stripe Webhooks')
@SkipThrottle()
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('webhook')
  @ApiStripeWebhook()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature || !req.rawBody) {
      throw new BadRequestException('Webhook signature or body missing.');
    }

    try {
      // 1. Validamos se o evento realmente veio da Stripe
      const event = this.stripeService.constructEvent(req.rawBody, signature);

      // 2. Usamos o switch para lidar com cada tipo de situação
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`Checkout finalizado: ${session.id}`);

          await this.subscriptionService.handleCheckoutCompleted(session);
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as unknown as Stripe.Invoice;
          console.log(`Renovação paga: ${invoice.id}`);
          await this.subscriptionService.handleRenewal(event);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`Assinatura encerrada: ${subscription.id}`);
          await this.subscriptionService.handleCancellation(subscription);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`Assinatura atualizada/agendada: ${subscription.id}`);
          await this.subscriptionService.handleCancellation(subscription);
          break;
        }

        default:
          console.log(`Evento não monitorado: ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.error(`Erro no Webhook: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
