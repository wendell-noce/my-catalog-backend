import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PlanRepository } from './../repository/plan.repository';

@Injectable()
export class PlanService {
  constructor(private readonly PlanRepository: PlanRepository) {}

  async findAll() {
    const plans = await this.PlanRepository.findAll();
    return ResponseHelper.success(plans, 'Planos listados com sucesso');
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
