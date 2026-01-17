import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiCheckProfileCompleted,
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiGetUserById,
  ApiRegisterUser,
  ApiRestoreUser,
  ApiUpdateUser,
  ApiUploadAvatar,
  ApiUserProfile,
  findWithAddressById,
} from './decorators/api-docs.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { RegisterUserDto } from './dto/register-user.dto';
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

  @Get('profile-completed')
  @UseGuards(JwtAuthGuard)
  @ApiCheckProfileCompleted()
  async getProfileCompleted(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

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

  @Get(':id/full')
  @UseGuards(JwtAuthGuard)
  @findWithAddressById()
  async findWithAddressById(@Param('id') id: string) {
    return this.usersService.findWithAddressById(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiGetUserById()
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('create')
  @ApiCreateUser()
  async create(
    @Body() createUser: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.create(createUser);
  }

  @Post('register')
  @ApiRegisterUser()
  async register(@Body() registerUser: RegisterUserDto) {
    return this.usersService.register(registerUser);
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadAvatar()
  async updateAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const userId = req.user.id;

    return this.usersService.updateAvatar(userId, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateUser()
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiRestoreUser()
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiDeleteUser()
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
