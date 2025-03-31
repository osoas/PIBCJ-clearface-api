import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
     imports:[
          MulterModule.register({
               
          })
     ],
     providers:[PrismaService,ImagesService],
     controllers: [ImagesController]
})
export class ImagesModule {}
