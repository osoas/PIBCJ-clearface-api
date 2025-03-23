import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AppointmentsController } from './appointments.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [AppointmentsService,PrismaService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
