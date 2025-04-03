import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { COOKIE_SECRET, HOST, PORT } from './shared/lib/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDocument } from './types/swagger';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.enableCors();

  //Setup do swagger
  const config = new DocumentBuilder()
    .setTitle('ClearFaceAPI')
    .setDescription('ClearFaceAPI - a face recognition plataform api for acne detection and classification')
    .setVersion('1.0')
    .addTag('ClearFaceAPI')
    .build();
  //const document = SwaggerModule.createDocument(app, config); //it will create an atomatic documentation based on the config but less customizable
  
  //Enable cookies Use
  app.use(cookieParser("ClearFaceAPI"))

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(PORT ?? 3000,HOST,()=>{
    console.log(`\nClearFaceAPI running on ${HOST} port ${process.env.PORT ?? 3000} full adress \u001b[34m http://${HOST}:${process.env.PORT ?? 3000} \u001b[0m\ncheck documentation \u001b[34m http://${HOST}:${process.env.PORT ?? 3000}/docs \u001b[0m\n`);
  });
  
}
bootstrap();
