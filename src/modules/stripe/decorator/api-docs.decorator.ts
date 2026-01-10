import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiStripeWebhook() {
  return applyDecorators(
    ApiOperation({
      summary: 'Recebe eventos da Stripe',
      description:
        'Endpoint para processar Webhooks da Stripe (Checkout, Renewal, Cancellation). Não testar via Swagger sem uma assinatura válida.',
    }),
    ApiHeader({
      name: 'stripe-signature',
      description:
        'Assinatura enviada pela Stripe para validar a autenticidade do evento.',
      required: true,
    }),
    ApiResponse({ status: 201, description: 'Evento processado com sucesso.' }),
    ApiResponse({
      status: 400,
      description: 'Assinatura ou corpo da requisição inválidos.',
    }),
  );
}
