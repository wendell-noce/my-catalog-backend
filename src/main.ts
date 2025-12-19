import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('My Catalog API')
    .setDescription('API de gerenciamento de catálogo de produtos')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  //***  Global Version to API
  app.setGlobalPrefix('api/v1');

  // Interceptor para padronizar respostas de sucesso
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Filtro para padronizar respostas de erro
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validation Pipe Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Application is running on: http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  // eslint-disable-next-line no-console
  console.log(`API base URL: http://localhost:${port}/api/v1`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error starting application:', err);
  process.exit(1);
});
