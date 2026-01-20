import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { StorageService } from 'src/modules/storage/service/storage.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindAllParams } from '../interfaces/find-all-users.interface';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException(
        `O email ${createUserDto.email} ja esta cadastrado. Tente novamente com outro email.`,
      );
    }

    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = await this.usersRepository.create(createUserDto);

    return ResponseHelper.success(user, 'Usuário cadastrado com sucesso');
  }

  async register(registerUser: RegisterUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      registerUser.email,
    );

    if (existingUser) {
      throw new ConflictException(
        `O email ${registerUser.email} ja esta cadastrado. Tente novamente com outro email.`,
      );
    }

    // *** Register new user
    if (registerUser.password) {
      registerUser.password = await bcrypt.hash(registerUser.password, 10);
    }

    const user = await this.usersRepository.register(registerUser);

    // *** Login user
    const token = await this.authService.generateTokens(user.id, user.email);

    return ResponseHelper.success(
      {
        user: {
          email: user.email,
          name: user.name,
          accessToken: token.accessToken,
        },
      },
      'Usuário registrado com sucesso!',
    );
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async getUserAuthData(email: string) {
    return this.usersRepository.getUserAuthData(email);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findAll(params: FindAllParams) {
    const { page, limit, role, isActive } = params;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({
        skip,
        take: limit,
        role,
        isActive,
      }),
      this.usersRepository.count({ role, isActive }),
    ]);

    return ResponseHelper.paginated(
      users,
      total,
      page,
      limit,
      'Usuários listados com sucesso',
    );
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (emailExists) {
        throw new ConflictException('Este email já está em uso');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(user.id, updateUserDto);

    return ResponseHelper.success({ message: 'Usuário editado com sucesso' });
  }

  async delete(id: string) {
    const user = await this.findById(id);

    await this.usersRepository.softDelete(user.id);

    return ResponseHelper.success({ message: 'Usuário deletado com sucesso' });
  }

  async restore(id: string) {
    const user = await this.findById(id);

    await this.usersRepository.restore(user.id);

    return ResponseHelper.success({
      message: 'Usuário restaurado com sucesso',
    });
  }

  async findWithAddressById(id: string) {
    return this.usersRepository.findWithAddressById(id);
  }

  async checkProfileCompleted(userId: string) {
    const user = await this.usersRepository.findById(userId);
    return user?.profileCompleted ?? false;
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    await this.findById(userId);

    const fileExt = file.originalname.split('.').pop();
    const path = `${userId}/profile-avatar-${Date.now()}.${fileExt}`;

    const publicUrl = await this.storageService.upload(file, 'avatars', path);

    const updatedUser = await this.usersRepository.updateUpdateAvatar(
      userId,
      publicUrl,
    );

    return ResponseHelper.success(
      { avatar: updatedUser.avatar },
      'Avatar atualizado com sucesso',
    );
  }
}
