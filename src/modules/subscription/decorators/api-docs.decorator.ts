import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCheckoutSessionDto } from '../dto/create-checkout-session.dto';

export function ApiCreateCheckoutSession() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a checkout session',
      description:
        'Create a checkout session for a user to subscribe to a plan',
    }),
    ApiBody({ type: CreateCheckoutSessionDto }),
    ApiResponse({
      status: 201,
      description: 'Redirect link generated successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data or user/plans not found',
    }),
  );
}
