import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (!user) return false;

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    // Regra de Ouro: Status deve ser ACTIVE e a data atual deve ser menor que o fim do período
    const isSubscriber =
      subscription?.status === 'ACTIVE' &&
      subscription?.currentPeriodEnd > new Date();

    if (!isSubscriber) {
      throw new ForbiddenException('Acesso restrito a assinantes ativos.');
    }

    return true;
  }
}
