import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HOST, PORT } from './shared/lib/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT ?? 3000,HOST,()=>{
    console.log(`\n ClearFaceAPI running on ${HOST} port ${process.env.PORT ?? 3000} full adress \u001b[34m http://${HOST}:${process.env.PORT ?? 3000} \u001b[0m`);
  });
}
bootstrap();
