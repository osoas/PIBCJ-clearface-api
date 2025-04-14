import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { COOKIE_SECRET, HOST, PORT } from './shared/lib/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerDocument } from './types/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { log } from 'console';
import { readFileSync } from 'fs';


async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('cert.key'),
    cert: readFileSync('cert.cert'),
  };

  const app = await NestFactory.create(AppModule,{
    httpsOptions
  });
  
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  app.enableCors({
    origin: '*', // ⚠️ Aceita requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use((req, res, next) => {
    console.log(`Nova requisição recebida: ${req.method} ${req.url} `);
    log(req.body)
    next();
  });
  
 

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
