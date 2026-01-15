import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    return this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteByToken(token: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
