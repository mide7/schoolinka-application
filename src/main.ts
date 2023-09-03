import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
      errorHttpStatusCode: 422,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            error: `${error.property} has wrong value ${error.value}.`,
            message: Object.values(error.constraints).join(''),
          };
        });
        return new UnprocessableEntityException(messages[0].message);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Schoolinka Docs API')
    .setDescription('This is the API documentation for Schoolinka')
    .setVersion('0.0.1')
    .addTag('auth', 'Auth API')
    .addTag('users', 'Users API')
    .addTag('posts', 'Posts API')
    .addBearerAuth({
      description: 'JWT Token',
      type: 'http',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
