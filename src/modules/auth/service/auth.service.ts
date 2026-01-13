import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UsersService } from 'src/modules/users/service/users.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { LoginDto } from '../dto/login.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Tokens } from '../interfaces/tokens.interface';
import { ValidateResetTokenResponse } from '../interfaces/validate-reset-token.interface';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(loginDto: LoginDto) {
    const user: any = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return ResponseHelper.success({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      plan: {
        active: user.subscriptions?.[0]?.status === SubscriptionStatus.ACTIVE,
        createdAt: user.subscriptions?.[0]?.createdAt || null,
        trialStart: user.subscriptions?.[0]?.trialStart || null,
        trialEnd: user.subscriptions?.[0]?.trialEnd || null,
        currentPeriodStart: user.subscriptions?.[0]?.currentPeriodStart || null,
        currentPeriodEnd: user.subscriptions?.[0]?.currentPeriodEnd || null,
        cancelAtPeriodEnd: user.subscriptions?.[0]?.cancelAtPeriodEnd || null,
        cancelAt: user.subscriptions?.[0]?.cancelAt || null,
        canceledAt: user.subscriptions?.[0]?.canceledAt || null,
        name: user.subscriptions?.[0]?.plan?.name || null,
        price: user.subscriptions?.[0]?.plan?.price || null,
        tier: user.subscriptions?.[0]?.plan?.tier || null,
      },
      ...tokens,
    });
  }

  public async generateTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias

    await this.refreshTokenRepository.create(userId, token, expiresAt);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const normalizedEmail = email.toLowerCase().trim();

    // TODO: Pensar em internacionalização
    const genericMessage =
      'Se o email existir em nossos registros, você receberá instruções para recuperação da sua senha';

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return { message: genericMessage };
    }

    const token = randomBytes(32).toString('hex');

    //***  Tempo de expiração: 5 minutos
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // TODO: Ajustar URL do front-end e pensar no melhor metodo para iso
    const projectUrl = 'https://my-catalog-frontend.com';
    const resetLink = `${projectUrl}/redefinir-senha?token=${token}`;

    // TODO: Envia email (sera implementado depois que tiver o serviço de email)
    console.log('Link de recuperação:', resetLink);

    return { message: genericMessage };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // *** Validações do token
    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    if (resetToken.used) {
      throw new BadRequestException('Token já foi utilizado');
    }

    if (new Date() > resetToken.expiresAt) {
      throw new BadRequestException('Token expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),

      // *** Marca token como usado
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Senha alterada com sucesso' };
  }

  async validateResetToken(token: string): Promise<ValidateResetTokenResponse> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, message: 'Token inválido' };
    }

    if (resetToken.used) {
      return { valid: false, message: 'Token já foi utilizado' };
    }

    if (new Date() > resetToken.expiresAt) {
      return { valid: false, message: 'Token expirado' };
    }

    return { valid: true };
  }
}
