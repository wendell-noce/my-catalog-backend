import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';

export function ApiCreateProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Criar uma nova categoria' }),
    ApiBody({
      type: CreateProductCategoryDto,
      description: 'Dados necessários para criar a categoria do produto',
      examples: {
        'Exemplo Completo': {
          value: {
            name: 'Celulares',
            slug: 'celulares',
            description:
              'Categoria destinada a smartphones, notebooks e gadgets tecnológicos.',
            storeId: '80d5d3ba-af2c-47bb-8638-d3b3ebf4a773',
            color: '#87CEEB',
            icon: 'MonitorIcon',
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' }),
    ApiResponse({ status: 409, description: 'Slug já existe na loja.' }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou erro na transação.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiGetAllProductCategoriesDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Listar todas as categorias de uma loja' }),
    ApiParam({ name: 'storeId', description: 'ID da loja (UUID)' }),
    ApiResponse({
      status: 200,
      description: 'Categorias listadas com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Loja não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiGetProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Obter detalhes de uma categoria pelo ID' }),
    ApiResponse({
      status: 200,
      description: 'Categoria obtida com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiUpdateProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Atualizar uma categoria existente' }),
    ApiBody({
      type: CreateProductCategoryDto,
      description: 'Dados necessários para criar a categoria do produto',
      examples: {
        'Exemplo Completo': {
          value: {
            name: 'Celulares',
            slug: 'celulares',
            description:
              'Categoria destinada a smartphones, notebooks e gadgets tecnológicos.',
            storeId: '80d5d3ba-af2c-47bb-8638-d3b3ebf4a773',
            color: '#87CEEB',
            icon: 'MonitorIcon',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Categoria atualizada com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos ou erro na transação.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
    ApiResponse({
      status: 409,
      description: 'Slug já está em uso por outra loja.',
    }),
  );
}

export function ApiDeleteProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Remover uma categoria pelo ID' }),
    ApiResponse({
      status: 200,
      description: 'Categoria removida com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiRestoreProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Restaurar uma categoria removida' }),
    ApiResponse({
      status: 200,
      description: 'Categoria restaurada com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiActivateProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Ativar uma categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria ativada com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}

export function ApiDeactivateProductCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Desativar uma categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria desativada com sucesso.',
    }),
    ApiResponse({
      status: 404,
      description: 'Categoria não encontrada.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado (Token ausente ou inválido).',
    }),
  );
}
