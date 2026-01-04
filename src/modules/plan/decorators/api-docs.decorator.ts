import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiFindAllPlans() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all plans',
      description: 'List all available plans',
    }),
    ApiResponse({
      status: 200,
      description: 'Plans found successfully',
      schema: {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Básico Mensal',
            email: 'Plano ideal para começar',
            tier: 'BASIC',
            interval: 'MONTHLY',
            price: '29.9',
            currency: 'BRL',
            intervalCount: 1,
            isRecurring: true,
            features: {
              storage: '1GB',
              support: 'Email',
              analytics: false,
              maxImages: 5,
              maxProducts: 50,
              customDomain: false,
            },
            active: true,
            createdAt: '2025-12-30T00:15:12.750Z',
            updatedAt: '2025-12-30T00:15:12.750Z',
          },
        ],
      },
    }),
  );
}
