import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
     providers:[PrismaService,ImagesService],
     controllers: [ImagesController]
})
export class ImagesModule {}
