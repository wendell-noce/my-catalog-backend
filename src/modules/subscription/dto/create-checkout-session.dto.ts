import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'price_123' })
  planId: string;

  @ApiProperty({ example: 'https://app.cataloguei/purchase-success' })
  successUrl: string;

  @ApiProperty({ example: 'https://app.cataloguei/cancel-subscription' })
  cancelUrl: string;
}
