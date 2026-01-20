import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateStoreDto } from '../dto/create-store.dto';
/* eslint-disable max-lines-per-function */
export function ApiCreateStore() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Criar uma nova loja',
      description:
        'Cria uma loja vinculada ao usuário logado e opcionalmente cadastra o endereço físico.',
    }),
    ApiBody({
      type: CreateStoreDto,
      description: 'Dados necessários para criar a loja e o endereço',
      examples: {
        'Exemplo Completo': {
          value: {
            name: 'Loja de teste',
            slug: 'loja-de-teste',
            url: 'https://minhaloja.com',
            description: 'Especializada em tecnologia',
            email: 'contato@loja.com',
            whatsappUrl: 'https://wa.me/5561999999999',
            themeStore: 'electronics',
            address: {
              street: 'SQN 316 Bloco A',
              number: '101',
              neighborhood: 'Asa Norte',
              city: 'Brasília',
              state: 'DF',
              zip_code: '70774-010',
              country: 'Brasil',
              storeAddressType: 'PHYSICAL',
              is_default: true,
            },
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Loja criada com sucesso.' }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou erro na transação.',
    }),
    ApiResponse({
      status: 409,
      description: 'Slug já está em uso por outra loja.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}
