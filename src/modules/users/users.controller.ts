import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './interfaces/user-response.interface';
import { UsersService } from './service/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'John Doe',
        createdAt: '2024-12-05T10:00:00Z',
      },
    },
  })
  async getProfile(@CurrentUser() user: UserResponse) {
    console.log('Profile chamado!');
    return this.usersService.findById(user.id);
  }

  // eslint-disable-next-line max-lines-per-function
  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with email, password and name',
  })
  @ApiBody({ type: CreateUserDto, description: 'User registration data' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          name: 'John Doe',
          createdAt: '2024-12-05T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or email already exists',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must be at least 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already exists',
        error: 'Conflict',
      },
    },
  })
  async create(
    @Body() createUser: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.create(createUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved' })
  async findAll(@Query() query: FindUsersQueryDto) {
    console.log('oi');

    return this.usersService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      role: query.role,
      isActive: query.isActive,
      email: query.email,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao@example.com',
        avatar: 'https://example.com/avatar.jpg',
        document: '12345678901',
        cellPhone: '11987654321',
        birthDate: '1990-05-15',
        gender: 'MALE',
        role: 'USER',
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        lastLoginAt: '2024-12-15T08:30:00Z',
        createdAt: '2024-12-05T10:00:00Z',
        updatedAt: '2024-12-15T08:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Edit user by ID',
    description: 'Update a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao@example.com',
        avatar: 'https://example.com/avatar.jpg',
        document: '12345678901',
        cellPhone: '11987654321',
        birthDate: '1990-05-15',
        gender: 'MALE',
        role: 'USER',
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        lastLoginAt: '2024-12-15T08:30:00Z',
        createdAt: '2024-12-05T10:00:00Z',
        updatedAt: '2024-12-15T08:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }
}
