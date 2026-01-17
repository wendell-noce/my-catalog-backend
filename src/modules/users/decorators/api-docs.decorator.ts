import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

export function ApiGetUserById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
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
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data or email already exists',
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
    ApiBearerAuth('JWT-auth'),
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
    ApiBearerAuth('JWT-auth'),
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
    ApiBearerAuth('JWT-auth'),
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
    ApiBearerAuth('JWT-auth'),
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
    ApiBearerAuth('JWT-auth'),
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
    ApiBearerAuth('JWT-auth'),
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

export function ApiCheckProfileCompleted() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Check if user profile is completed',
      description:
        'Verify if the authenticated user has completed their profile information',
    }),
    ApiResponse({
      status: 200,
      description: 'Profile completion status retrieved successfully',
      schema: {
        example: {
          profileCompleted: true,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
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

export function ApiUploadAvatar() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Upload de avatar do usuário',
      description:
        'Envia uma imagem para o perfil do usuário logado. Formatos aceitos: JPG, PNG.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Arquivo de imagem do avatar',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Avatar atualizado com sucesso. Retorna a nova URL.',
      schema: {
        example: {
          success: true,
          message: 'Avatar atualizado com sucesso',
          data: {
            avatar:
              'https://pgwnsrnshdyvzavvejej.supabase.co/storage/v1/object/public/avatars/2cd384ab-2386-4607-9f2e-d9fc02f32bf2/profile-avatar-1768622214672.jpeg',
          },
          timestamp: '2026-01-17T03:56:56.173Z',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Arquivo inválido ou muito grande.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}
