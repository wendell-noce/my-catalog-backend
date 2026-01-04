import { Controller, Delete, Get, Param } from '@nestjs/common';
import { PaymentService } from '../../payment/payment.service';
import { ApiFindAllPlans } from '../decorators/api-docs.decorator';
import { PlanService } from '../service/plan.service';

@Controller('plans')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  @ApiFindAllPlans()
  findAll() {
    return this.planService.findAll();
  }

  @Get('test-stripe')
  async testStripe() {
    try {
      const customer = await this.paymentService.createCustomer({
        email: 'teste@email.com',
        name: 'João Teste',
        metadata: { test: true },
      });

      return {
        success: true,
        message: 'Stripe conectado com sucesso!',
        customer,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com Stripe',
        error: error.message,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
