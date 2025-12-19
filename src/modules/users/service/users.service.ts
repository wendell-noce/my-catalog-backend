import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FindAllParams } from '../interfaces/find-all-users.interface';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const user = await this.usersRepository.create(createUserDto);

    return ResponseHelper.success(user, 'Usuário cadastrado com sucesso');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
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
}
