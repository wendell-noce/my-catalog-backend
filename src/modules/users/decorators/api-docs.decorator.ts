import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

export function ApiGetUserById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'User ID (UUID)',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'User found successfully',
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
      description: 'User not found',
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

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description: 'Create a new user account with email, password and name',
    }),
    ApiBody({ type: CreateUserDto, description: 'User registration data' }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
      // ...
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data or email already exists',
      // ...
    }),
  );
}

export function ApiRegisterUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description: 'Create a new user account with email, password and name',
    }),
    ApiBody({ type: RegisterUserDto, description: 'User registration data' }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data or email already exists',
    }),
  );
}

export function ApiUserProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user profile',
    }),
    ApiResponse({
      status: 200,
      description: 'User found successfully',
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
      description: 'User not found',
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

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve a list of all users',
    }),
    ApiResponse({
      status: 200,
      description: 'Users found successfully',
      schema: {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'João Silva',
            email: 'joao@example.com',
            // ...
          },
          // ...
        ],
      },
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update user',
      description: 'Update user details by ID',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'User ID (UUID)',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );
}

export function ApiRestoreUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Restore deleted or blocked user',
      description: 'Restore a soft-deleted user by clearing deletedAt',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'User ID (UUID)',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'User restored successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 409,
      description: 'User is not deleted',
    }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete user (soft delete)',
      description: 'Soft delete a user by setting deletedAt timestamp',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'User ID (UUID)',
    }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function findWithAddressById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user with address by ID',
      description:
        'Retrieve a specific user along with their address by user ID',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'User ID (UUID)',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'User with address found successfully',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'João Silva',
          email: 'joao@example.com',
          // ...
          address: {
            street: 'Av. Paulista',
            number: '123',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brazil',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
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
