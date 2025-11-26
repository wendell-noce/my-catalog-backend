import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteByToken(token: string) {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllByUserId(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
