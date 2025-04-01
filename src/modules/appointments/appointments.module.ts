import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AppointmentsController } from './appointments.controller';
import { AuthModule } from '../auth/auth.module';
import { DetectionServices } from './detections.service';
import { ImagesService } from '../images/images.service';

@Module({
  providers: [AppointmentsService,PrismaService,DetectionServices,ImagesService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
