import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiGetUserById,
  ApiRestoreUser,
  ApiUpdateUser,
  ApiUserProfile,
  findWithAddressById,
} from './decorators/api-docs.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './interfaces/user-response.interface';
import { UsersService } from './service/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // *** Profile ***

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiUserProfile()
  async getProfile(@CurrentUser() user: UserResponse) {
    return this.usersService.findById(user.id);
  }

  // *** GETs ***

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiFindAllUsers()
  async findAll(@Query() query: FindUsersQueryDto) {
    return this.usersService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      role: query.role,
      isActive: query.isActive,
      email: query.email,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiGetUserById()
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/full')
  @UseGuards(JwtAuthGuard)
  @findWithAddressById()
  async findWithAddressById(@Param('id') id: string) {
    return this.usersService.findWithAddressById(id);
  }

  // --- SEÇÃO: ESCRITA (WRITE) ---

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiCreateUser()
  async create(
    @Body() createUser: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.create(createUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateUser()
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }

  // --- SEÇÃO: ADMINISTRAÇÃO / ESTADO ---

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiDeleteUser()
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiRestoreUser()
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
}
