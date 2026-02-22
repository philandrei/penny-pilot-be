import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MockAuthGuard } from './auth/mock-auth.guard';
import { GlobalExceptionFilter } from '@common/filters/global-exception-filter';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

function configureApp(app: INestApplication) {
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.getOrThrow<string>('CORS_ORIGIN'),
    credentials: config.getOrThrow<string>('CORS_CREDENTIALS') === 'true',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());
}

function initializeSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Penny Pilot API')
    .setDescription('API documentation for Penny Pilot')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT access token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });

  // app
  //   .getHttpAdapter()
  //   .getInstance()
  //   .get('/swagger-json', (_req, res) => {
  //     res.json(document);
  //   });
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  configureApp(app);
  initializeSwaggerDocument(app);
  //dev env only
  // app.useGlobalGuards(new MockAuthGuard());
  //exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port =
    configService.get<number>('APP_PORT') || process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
