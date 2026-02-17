import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MockAuthGuard } from './auth/mock-auth.guard';
import { GlobalExceptionFilter } from '@common/filters/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  //dev env only
  app.useGlobalGuards(new MockAuthGuard());
  //exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Penny Pilot API')
    .setDescription('API documentation for Penny Pilot')
    .setVersion('1.0')
    // .addBearerAuth() // remove if not using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app
    .getHttpAdapter()
    .getInstance()
    .get('/swagger-json', (_req, res) => {
      res.json(document);
    });
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
