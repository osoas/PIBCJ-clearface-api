import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AppointmentsController } from './appointments.controller';

@Module({
  providers: [AppointmentsService,PrismaService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule {}
