import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticate user with email and password',
    }),
    ApiResponse({
      status: 200,
      description: 'Login successful',
      schema: {
        example: {
          success: true,
          message: 'Operation successful',
          data: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              email: 'userexample.com',
              name: 'John Doe',
            },
            plan: {
              active: true,
              createdAt: '2026-01-10T03:49:01.989Z',
              trialStart: null,
              trialEnd: null,
              currentPeriodStart: '2026-01-10T03:48:59.000Z',
              currentPeriodEnd: '2026-02-10T03:48:59.000Z',
              cancelAtPeriodEnd: null,
              cancelAt: null,
              canceledAt: null,
              name: 'Unlimited',
              price: '199.9',
              tier: 'UNLIMITED',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid email or password',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Request password reset',
      description:
        'Send password reset token to user email (Rate limited: 3 attempts per 15 minutes)',
    }),
    ApiBody({ type: ForgotPasswordDto }),
    ApiResponse({
      status: 200,
      description: 'Password reset email sent successfully',
      schema: {
        example: {
          message: 'Password reset email sent successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid email format',
      schema: {
        example: {
          statusCode: 400,
          message: ['Invalid email address'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Email not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset user password',
      description: 'Reset user password using the token received via email',
    }),
    ApiBody({ type: ResetPasswordDto }),
    ApiResponse({
      status: 200,
      description: 'Password reset successfully',
      schema: {
        example: {
          message: 'Password reset successfully',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data or passwords do not match',
      schema: {
        example: {
          statusCode: 400,
          message: 'Passwords do not match',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid or expired token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid or expired reset token',
          error: 'Unauthorized',
        },
      },
    }),
  );
}

export function ApiValidateResetToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Validate password reset token',
      description: 'Check if the password reset token is valid and not expired',
    }),
    ApiParam({
      name: 'token',
      description: 'Password reset token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    ApiResponse({
      status: 200,
      description: 'Token is valid',
      schema: {
        example: {
          valid: true,
          message: 'Token is valid',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid or expired token',
      schema: {
        example: {
          valid: false,
          message: 'Invalid or expired token',
        },
      },
    }),
  );
}
