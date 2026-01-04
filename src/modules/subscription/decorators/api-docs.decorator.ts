import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiCreateSubscription() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create subscription',
    }),
    ApiResponse({
      status: 200,
      description: 'Assinatura criada com sucesso! Trial de 7 dias iniciado.',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'João Silva',
          email: 'joao@example.com',
          // ...
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Plano não encontrado',
    }),
  );
}

export function ApiGetUserPlans() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get de planos do usuário',
    }),
    ApiResponse({
      status: 200,
      description: 'Assinaturas listadas com sucesso',
    }),
  );
}
