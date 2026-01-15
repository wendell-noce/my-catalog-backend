import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  ApiForgotPassword,
  ApiLogin,
  ApiResetPassword,
  ApiValidateResetToken,
} from './decorators/api-docs.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateTokenResponse } from './interfaces/validate-token-respone.interface';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  @ApiForgotPassword()
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResetPassword()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renova o token de acesso do usuário' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('validate-reset-token/:token')
  @ApiValidateResetToken()
  async validateResetToken(
    @Param('token') token: string,
  ): Promise<ValidateTokenResponse> {
    return this.authService.validateResetToken(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Inicia a Autenticação com o Google' })
  async googleAuth(@Req() _req) {
    // *** O Passport cuida do redirecionamento ***/
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback da Autenticação com o Google' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const tokens = await this.authService.generateTokens(user.id, user.email);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }
}
